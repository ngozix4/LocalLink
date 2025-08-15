import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import OrderCard from '../../components/OrderCard';
import { AuthContext } from '../../context/AuthContext';
import { getBusinessOrders } from '../../services/api';

const Tab = createMaterialTopTabNavigator();

function OrdersTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
        tabBarIndicatorStyle: { backgroundColor: '#4A90E2' },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="MyOrders" component={MyOrdersScreen} options={{ title: 'My Orders' }} />
      <Tab.Screen name="ReceivedOrders" component={ReceivedOrdersScreen} options={{ title: 'Received Orders' }} />
    </Tab.Navigator>
  );
}

function MyOrdersScreen({ navigation }) {
  const { business } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await getBusinessOrders(business._id, 'buyer');
        setOrders(ordersData);
      } catch (error) {
        console.error('Failed to load orders', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrders();
  }, [business._id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <OrderCard 
            order={item} 
            //screen="OrderDetail"
            onPress={() => navigation.navigate('OrderDetail', { orderId: item._id })}
            type="buyer"
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No orders found</Text>
          </View>
        }
      />
    </View>
  );
}

function ReceivedOrdersScreen({ navigation }) {
  const { business } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await getBusinessOrders(business._id, 'supplier');
        setOrders(ordersData);
      } catch (error) {
        console.error('Failed to load orders', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrders();
  }, [business._id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <OrderCard 
            order={item} 
            onPress={() => navigation.navigate('OrderDetail', { orderId: item._id })}
            type="supplier"
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No orders received</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
});

export default OrdersTabNavigator;