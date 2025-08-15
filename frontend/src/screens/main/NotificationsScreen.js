import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { getBusinessNotifications, markNotificationAsRead } from '../../services/api';
import NotificationItem from '../../components/NotificationItem';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function NotificationsScreen({ navigation }) {
  const { business } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notificationsData = await getBusinessNotifications(business._id);
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Failed to load notifications', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadNotifications();
  }, [business._id]);

  const handleNotificationPress = async (notification) => {
    // Mark as read if not already
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification._id);
        setNotifications(prev => 
          prev.map(n => 
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
      } catch (error) {
        console.error('Failed to mark notification as read', error);
      }
    }
    
    // Handle navigation based on notification type
    switch (notification.type) {
      case 'new_order':
        navigation.navigate('Orders');
        break;
      case 'connection_request':
        navigation.navigate('Messages');
        break;
      case 'new_message':
        if (notification.metadata?.message_id) {
          navigation.navigate('Chat', { 
            otherBusinessId: notification.business_id,
            otherBusinessName: 'Business'
          });
        }
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <NotificationItem 
              notification={item} 
              onPress={() => handleNotificationPress(item)}
            />
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="notifications-off" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      )}
    </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});