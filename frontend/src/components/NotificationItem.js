import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NotificationItem = ({ notification, onPress }) => {
  const getIconName = () => {
    switch (notification.type) {
      case 'new_order': return 'shopping-cart';
      case 'connection_request': return 'person-add';
      case 'new_message': return 'chat';
      case 'order_update': return 'info';
      default: return 'notifications';
    }
  };

  const getIconColor = () => {
    return notification.read ? '#999' : '#4A90E2';
  };

  return (
    <TouchableOpacity 
      style={[styles.container, !notification.read && styles.unreadContainer]} 
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Icon 
          name={getIconName()} 
          size={24} 
          color={getIconColor()} 
        />
      </View>
      
      <View style={styles.content}>
        <Text 
          style={[styles.message, !notification.read && styles.unreadMessage]}
          numberOfLines={2}
        >
          {notification.message}
        </Text>
        <Text style={styles.time}>
          {new Date(notification.created_at).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
      
      {!notification.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  unreadContainer: {
    backgroundColor: '#F5F9FF',
  },
  iconContainer: {
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A90E2',
    marginLeft: 10,
  },
});

export default NotificationItem;