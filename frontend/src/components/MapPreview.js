import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MapPreview = ({ businesses, onBusinessPress, onViewAll }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Businesses Nearby</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.imageWrapper} onPress={onViewAll}>
        <Image
          source={require('../../assets/map-placeholder.png')} // Replace with your static map image
          style={styles.mapImage}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <Icon name="location-on" size={24} color="#fff" />
          <Text style={styles.overlayText}>
            {businesses.length} businesses nearby
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
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
  imageWrapper: {
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: 200,
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 5,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MapPreview;
