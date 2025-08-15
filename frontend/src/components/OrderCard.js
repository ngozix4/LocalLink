import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OrderCard = ({ order, onPress, type }) => {
  const getStatusColor = () => {
    switch (order.status) {
      case 'completed': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return '#FFC107';
    }
  };

  const otherBusiness = type === 'buyer' ? order.supplier_id : order.buyer_id;
  const productName = order.product_id?.name || 'Product';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.productName} numberOfLines={1}>
          {productName}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.detailsRow}>
        <Icon name="store" size={16} color="#666" />
        <Text style={styles.businessName} numberOfLines={1}>
          {otherBusiness.business_name}
        </Text>
      </View>
      
      <View style={styles.detailsRow}>
        <Icon name="shopping-cart" size={16} color="#666" />
        <Text style={styles.detailText}>
          Qty: {order.quantity} | Total: ${(order.quantity * order.product_id.price).toFixed(2)}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.dateText}>
          {new Date(order.created_at).toLocaleDateString()}
        </Text>
        <Icon name="chevron-right" size={20} color="#666" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  businessName: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
});

export default OrderCard;