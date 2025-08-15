import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, SafeAreaView, Touchable } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import BusinessCard from '../../components/BusinessCard';
import MapPreview from '../../components/MapPreview';
import { searchBusinesses } from '../../services/api';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const { business } = useContext(AuthContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const data = await searchBusinesses();
        setBusinesses(data);
        setFilteredBusinesses(data);
      } catch (error) {
        console.error('Failed to load businesses', error);
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
        (biz.business_type && biz.business_type.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredBusinesses(filtered);
    }
  }, [searchQuery, businesses]);

  return (
    <SafeAreaView style={styles.container}>
      
      <TextInput
        style={styles.searchBar}
        placeholder="Search businesses..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <MapPreview 
        businesses={businesses} 
        onBusinessPress={(id) => navigation.navigate('BusinessProfile', { businessId: id })}
      />
      
      <FlatList
        data={filteredBusinesses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <BusinessCard 
            business={item}
            onPress={() => {
              console.log("Navigating with ID:", item._id);
              navigation.navigate('BusinessProfile', {
                screen: 'BusinessProfile',
                params: { businessId: item._id }
              });
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No businesses found</Text>
          </View>
        }v
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
});