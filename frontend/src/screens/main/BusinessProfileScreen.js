import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard';
import { getBusinessById, getBusinessProducts } from '../../services/api';
import { createConnection } from '../../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function BusinessProfileScreen({ route, navigation }) {
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const { userToken, business: currentBusiness } = useContext(AuthContext);
  const businessId = route.params?.businessId;

  console.log("Business Id from HomeScreen", businessId);

   if (!businessId) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Business information not available</Text>
      </View>
    );
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const bizData = await getBusinessById(userToken,businessId);
        setBusiness(bizData);
        console.log("Business Data ", bizData);

        const productsData = await getBusinessProducts(userToken,businessId);
        setProducts(productsData);
        
        // Check if already connected (you'd need to implement this)
        // setIsConnected(await checkConnection(currentBusiness._id, businessId));
      } catch (error) {
        console.error('Failed to load business profile', error);
      }
    };
    
    loadData();
  }, [businessId]);

  const handleRequestConnection = async () => {
    try {
      await createConnection({
        business1_id: currentBusiness._id,
        business2_id: businessId,
        status: 'pending'
      });
      setIsConnected(true);
      // Show success message
    } catch (error) {
      console.error('Connection request failed', error);
      // Show error message
    }
  };

  const handleProductPress = (productId) => {
    navigation.navigate('ProductDetail', { productId });
  };

  if (!business) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {business.logo?.url ? (
          <Image source={{ uri: business.logo.url }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>{business.business_name.charAt(0)}</Text>
          </View>
        )}
        
        <View style={styles.headerInfo}>
          <Text style={styles.businessName}>{business.business_name}</Text>
          <Text style={styles.businessType}>{business.business_type}</Text>
          <Text style={styles.location}>{business.location}</Text>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{business.rating?.toFixed(1) || 'N/A'}</Text>
            {/* Add star rating component here */}
          </View>
        </View>
      </View>
      
      {!isConnected && currentBusiness._id !== businessId && (
        <TouchableOpacity 
          style={styles.connectButton}
          onPress={handleRequestConnection}
        >
          <Text style={styles.connectButtonText}>Request Connection</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{business.description || 'No description provided.'}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Products/Services</Text>
        {products.length > 0 ? (
          <FlatList
            horizontal
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ProductCard 
                product={item} 
                onPress={() => handleProductPress(item._id)}
              />
            )}
            contentContainerStyle={styles.productsList}
          />
        ) : (
          <Text style={styles.noProducts}>No products listed yet.</Text>
        )}
      </View>
      
      {/* Add gallery/images section if needed */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  logoText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  businessType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
  },
  connectButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 15,
  },
  connectButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
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
  productsList: {
    paddingVertical: 5,
  },
  noProducts: {
    fontStyle: 'italic',
    color: '#888',
  },
});