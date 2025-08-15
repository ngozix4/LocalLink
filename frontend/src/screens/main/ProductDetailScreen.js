import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { getProductById } from '../../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  console.log("Product Id: ", productId);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
        setMainImage(productData.mainImage || 
          (productData.gallery?.length > 0 ? productData.gallery[0] : null));
      } catch (error) {
        console.error('Failed to load product', error);
      }
    };
    
    loadProduct();
  }, [productId]);

  const handleCreateOrder = () => {
    navigation.navigate('CreateOrderScreen', { productId: product._id, supplierId: product.business_id });
  };

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {mainImage && (
        <Image 
          source={{ uri: mainImage.url }} 
          style={styles.mainImage}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        
        <View style={styles.infoRow}>
          <Icon name="category" size={20} color="#666" />
          <Text style={styles.infoText}>{product.category || 'No category'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="location-on" size={20} color="#666" />
          <Text style={styles.infoText}>{product.location || 'No location specified'}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description || 'No description provided.'}</Text>
        </View>
        
        {/* Gallery images */}
        {product.gallery?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {product.gallery.map((image, index) => (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => setMainImage(image)}
                >
                  <Image 
                    source={{ uri: image.url }} 
                    style={styles.galleryImage}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.orderButton}
          onPress={handleCreateOrder}
        >
          <Text style={styles.orderButtonText}>Create Order</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 15,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  orderButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  orderButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});