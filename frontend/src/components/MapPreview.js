import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MapPreview = ({ businesses, onBusinessPress, onViewAll }) => {
  // Calculate initial region based on businesses' locations
  const calculateInitialRegion = () => {
    if (!businesses || businesses.length === 0) {
      return {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }

    // Calculate bounds that contain all markers
    const latitudes = businesses.map(b => b.location?.latitude || 0);
    const longitudes = businesses.map(b => b.location?.longitude || 0);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    
    const center = {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
    };
    
    const latitudeDelta = (maxLat - minLat) * 1.5; // Add some padding
    const longitudeDelta = (maxLng - minLng) * 1.5;
    
    return {
      ...center,
      latitudeDelta: Math.max(latitudeDelta, 0.01), // Ensure minimum zoom
      longitudeDelta: Math.max(longitudeDelta, 0.01),
    };
  };

  const initialRegion = calculateInitialRegion();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Businesses Nearby</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <MapView 
        style={styles.map} 
        initialRegion={initialRegion}
        scrollEnabled={false}
        zoomEnabled={false}
        loadingEnabled={true}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#eeeeee"
      >
        {/* OpenStreetMap Tile Layer */}
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          minimumZ={0}
          flipY={false}
        />

        {/* Business Markers */}
        {businesses.map((business, index) => (
          <Marker
            key={`${business._id}-${index}`}
            coordinate={{
              latitude: business.location?.latitude || 0,
              longitude: business.location?.longitude || 0,
            }}
            onPress={() => onBusinessPress(business._id)}
          >
            <View style={styles.marker}>
              <Icon name="location-on" size={24} color="#4A90E2" />
              {business.business_name && (
                <View style={styles.markerLabel}>
                  <Text style={styles.markerText}>{business.business_name}</Text>
                </View>
              )}
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
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
  },
  marker: {
    alignItems: 'center',
  },
  markerLabel: {
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 2,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  markerText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default MapPreview;