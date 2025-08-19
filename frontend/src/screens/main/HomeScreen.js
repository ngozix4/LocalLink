import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import BusinessCard from '../../components/BusinessCard';
import MapPreview from '../../components/MapPreview';
import { searchBusinesses, getNearbyBusinesses } from '../../services/api';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { business } = useContext(AuthContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;
        try {
          const johannesburgCoords = {
            latitude: -26.2041,
            longitude: 28.0473,
          };
          data = await getNearbyBusinesses(
            johannesburgCoords.latitude,
            johannesburgCoords.longitude,
            5000
          );
        } catch (locationError) {
          console.error('Falling back to general search', locationError);
          data = await searchBusinesses();
        }

        setBusinesses(data);
        setFilteredBusinesses(data);
      } catch (err) {
        console.error('Failed to load businesses', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      loadBusinesses();
    }
  }, [isFocused]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBusinesses(businesses);
    } else {
      const filtered = businesses.filter(biz =>
        biz.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (biz.description && biz.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (biz.business_type && biz.business_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (biz.location?.address && biz.location.address.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredBusinesses(filtered);
    }
  }, [searchQuery, businesses]);

  const handleViewAllOnMap = () => {
    navigation.navigate('FullMap', { 
      businesses: filteredBusinesses,
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search businesses..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {filteredBusinesses.length > 0 && (
        <MapPreview 
          businesses={filteredBusinesses}
          onBusinessPress={(id) => navigation.navigate('BusinessProfile', { businessId: id })}
          onViewAll={handleViewAllOnMap}
        />
      )}

      <FlatList
        data={filteredBusinesses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <BusinessCard 
            business={item}
            onPress={() => navigation.navigate('BusinessProfile', { businessId: item._id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No businesses found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
