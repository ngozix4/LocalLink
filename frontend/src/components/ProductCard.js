import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const ProductCard = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {product.mainImage?.url ? (
        <Image source={{ uri: product.mainImage.url }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        {product.location && (
          <Text style={styles.location} numberOfLines={1}>
            {product.location}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 5,
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
});

export default ProductCard;