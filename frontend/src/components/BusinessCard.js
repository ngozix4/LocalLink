import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BusinessCard = ({ business, onPress }) => {
  // Helper function to display location
  const renderLocation = () => {
    if (!business.location) return 'No location specified';
    
    // Handle both old string format and new object format
    if (typeof business.location === 'string') {
      return business.location;
    }
    
    // New location object format
    if (business.location.address) {
      return business.location.address;
    }
    
    if (business.location.coordinates) {
      return `${business.location.coordinates.latitude.toFixed(4)}, ${business.location.coordinates.longitude.toFixed(4)}`;
    }
    
    return 'Location available';
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {business.logo?.url ? (
        <Image source={{ uri: business.logo.url }} style={styles.logo} />
      ) : (
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>{business.business_name.charAt(0)}</Text>
        </View>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={styles.businessName} numberOfLines={1}>{business.business_name}</Text>
        <Text style={styles.businessType} numberOfLines={1}>
          {business.business_type || 'No type specified'}
        </Text>
        
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={14} color="#666" />
          <Text style={styles.locationText} numberOfLines={1}>
            {renderLocation()}
          </Text>
        </View>
      </View>
      
      <View style={styles.ratingContainer}>
        <Icon name="star" size={16} color="#FFD700" />
        <Text style={styles.ratingText}>
          {business.rating ? business.rating.toFixed(1) : 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    resizeMode: 'contain',
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  businessType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 3,
    flexShrink: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    minWidth: 40,
  },
  ratingText: {
    marginLeft: 3,
    fontSize: 14,
  },
});

export default BusinessCard;