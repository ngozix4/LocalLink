import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import HomeScreen from '../screens/main/HomeScreen';
import OrdersScreen from '../screens/main/OrdersScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import BusinessProfileScreen from '../screens/main/BusinessProfileScreen';
import ProductDetailScreen from '../screens/main/ProductDetailScreen';
import { AuthContext } from '../context/AuthContext';
import MessagesStack from './MessageStack';
import OrderDetailScreen from '../screens/main/OrderDetailScreen.js'


const Tab = createBottomTabNavigator();
const BusinessStack = createStackNavigator();
const OrderStack = createStackNavigator();


function OrderScreenStack() {
  return (
    <OrderStack.Navigator screenOptions={{ headerShown: false }}>
      <OrderStack.Screen 
        name="OrderScreen" 
        component={OrdersScreen} 
        options={{ tabBarButton: () => null }}
      />

       <OrderStack.Screen 
        name="OrderDetail" 
        component={OrderDetailScreen} 
        options={{ tabBarButton: () => null }}
      />
    </OrderStack.Navigator>
  );
}

function BusinessProfileStack() {
  return (
    <BusinessStack.Navigator screenOptions={{ headerShown: false }}>
      <BusinessStack.Screen 
        name="BusinessProfile" 
        component={BusinessProfileScreen} 
        options={{ tabBarButton: () => null }}
      />

      <BusinessStack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
      />

      <BusinessStack.Screen 
        name="CreateOrder" 
        component={CreateOrder} 
      />
    </BusinessStack.Navigator>
  );
}

export default function MainTabNavigator() {
  const { business } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Orders') {
            return <MaterialIcons name="list-alt" size={size} color={color} />;
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <FontAwesome5 name="user-tie" size={size} color={color} />;
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: '#4A90E2',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Messages" component={MessagesStack} />
      <Tab.Screen name="Orders" component={OrderScreenStack} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen}/>
       <Tab.Screen name="BusinessProfile" component={BusinessProfileStack} />
    </Tab.Navigator>
  );
}