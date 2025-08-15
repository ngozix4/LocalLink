import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { createOrder } from '../../services/api';

export default function CreateOrderScreen({ route, navigation }) {
  const { productId, supplierId } = route.params;
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const { business } = useContext(AuthContext);

  const handleCreateOrder = async () => {
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity');
      return;
    }

    try {
      const orderData = {
        buyer_id: business._id,
        supplier_id: supplierId,
        product_id: productId,
        quantity: parseInt(quantity),
        status: 'pending',
        verification_code: Math.random().toString(36).substring(2, 8).toUpperCase()
      };

      await createOrder(orderData);
      Alert.alert('Success', 'Order created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Order creation failed', error);
      Alert.alert('Error', 'Failed to create order');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Order</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Enter quantity"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Additional Notes</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          value={notes}
          onChangeText={setNotes}
          placeholder="Any special instructions..."
        />
      </View>
      
      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleCreateOrder}
      >
        <Text style={styles.createButtonText}>Submit Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});