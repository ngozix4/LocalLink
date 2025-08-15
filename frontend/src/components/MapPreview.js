import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MapPreview = ({ businesses, onBusinessPress }) => {
  // Calculate initial region based on businesses' locations
  // This is a simplified version - you'd want to implement proper region calculation
  const initialRegion = {
    latitude: businesses[0]?.location?.latitude || 0,
    longitude: businesses[0]?.location?.longitude || 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Businesses Nearby</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <MapView 
        style={styles.map} 
        initialRegion={initialRegion}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        {businesses.map((business, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: business.location?.latitude || 0,
              longitude: business.location?.longitude || 0,
            }}
            onPress={() => onBusinessPress(business._id)}
          >
            <View style={styles.marker}>
              <Icon name="location-on" size={24} color="#4A90E2" />
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#4A90E2',
    fontSize: 14,
  },
  map: {
    flex: 1,
    borderRadius: 8,
  },
  marker: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default MapPreview;