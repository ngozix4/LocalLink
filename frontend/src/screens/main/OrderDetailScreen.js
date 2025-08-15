import React, { useState, useEffect, useContext } from 'react';
import { View,ScrollView, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { getOrderById, updateOrderStatus } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function OrderDetailScreen({ route }) {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { business } = useContext(AuthContext);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to load order', error);
        Alert.alert('Error', 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    
    loadOrder();
  }, [orderId]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrder(updatedOrder);
      Alert.alert('Success', `Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update order status', error);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>Order not found</Text>
      </View>
    );
  }

  const isSupplier = business._id === order.supplier_id._id;
  const isBuyer = business._id === order.buyer_id._id;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{order._id.substring(0, 8)}</Text>
        <View style={[styles.statusBadge, { 
          backgroundColor: 
            order.status === 'completed' ? '#4CAF50' :
            order.status === 'cancelled' ? '#F44336' :
            '#FFC107'
        }]}>
          <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Details</Text>
        <View style={styles.productContainer}>
          {order.product_id.mainImage?.url && (
            <Image 
              source={{ uri: order.product_id.mainImage.url }} 
              style={styles.productImage}
            />
          )}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{order.product_id.name}</Text>
            <Text style={styles.productPrice}>${order.product_id.price.toFixed(2)}</Text>
            <Text style={styles.quantity}>Quantity: {order.quantity}</Text>
            <Text style={styles.total}>Total: ${(order.quantity * order.product_id.price).toFixed(2)}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Details</Text>
        <View style={styles.businessContainer}>
          <View style={styles.businessRow}>
            <Icon name="store" size={20} color="#666" />
            <Text style={styles.businessText}>{isSupplier ? order.buyer_id.business_name : order.supplier_id.business_name}</Text>
          </View>
          <View style={styles.businessRow}>
            <Icon name="location-on" size={20} color="#666" />
            <Text style={styles.businessText}>
              {isSupplier ? order.buyer_id.location : order.supplier_id.location}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Timeline</Text>
        <View style={styles.timelineContainer}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineDate}>
                {new Date(order.created_at).toLocaleString()}
              </Text>
              <Text style={styles.timelineText}>Order created</Text>
            </View>
          </View>
          
          {order.status !== 'pending' && (
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineDate}>
                  {new Date(order.updated_at).toLocaleString()}
                </Text>
                <Text style={styles.timelineText}>
                  Order {order.status === 'completed' ? 'completed' : 'cancelled'}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
      
      {isSupplier && order.status === 'pending' && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleUpdateStatus('completed')}
          >
            <Text style={styles.actionButtonText}>Accept Order</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleUpdateStatus('cancelled')}
          >
            <Text style={styles.actionButtonText}>Reject Order</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {isBuyer && order.status === 'pending' && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleUpdateStatus('cancelled')}
          >
            <Text style={styles.actionButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4A90E2',
  },
  productContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#4A90E2',
    marginBottom: 5,
  },
  quantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  businessContainer: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
  },
  businessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  businessText: {
    marginLeft: 10,
    fontSize: 14,
  },
  timelineContainer: {
    borderLeftWidth: 2,
    borderLeftColor: '#4A90E2',
    paddingLeft: 15,
    marginLeft: 6,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4A90E2',
    marginLeft: -19,
    marginTop: 3,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 10,
  },
  timelineDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  timelineText: {
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});