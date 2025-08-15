import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { getBusinessConnections, getConversations } from '../../services/api';

export default function MessagesScreen({ navigation }) {
  const { business } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        // First get all accepted connections
        const connections = await getBusinessConnections(business._id, 'accepted');
        
        // Then get the last message for each conversation
        const convos = await Promise.all(
          connections.map(async (conn) => {
            const otherBusinessId = 
              conn.business1_id._id === business._id ? 
              conn.business2_id._id : conn.business1_id._id;
              
            const messages = await getConversations(business._id, otherBusinessId, 1);
            
            return {
              connectionId: conn._id,
              otherBusiness: conn.business1_id._id === business._id ? 
                conn.business2_id : conn.business1_id,
              lastMessage: messages[0] || null
            };
          })
        );
        
        setConversations(convos);
      } catch (error) {
        console.error('Failed to load conversations', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadConversations();
  }, [business._id]);

  const handleOpenChat = (connectionId, otherBusiness) => {
    navigation.navigate('Chat', { 
      connectionId,
      otherBusinessId: otherBusiness._id,
      otherBusinessName: otherBusiness.business_name
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.connectionId}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.conversationItem}
            onPress={() => handleOpenChat(item.connectionId, item.otherBusiness)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.otherBusiness.business_name.charAt(0)}
              </Text>
            </View>
            
            <View style={styles.conversationInfo}>
              <Text style={styles.businessName}>{item.otherBusiness.business_name}</Text>
              <Text 
                style={styles.lastMessage}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.lastMessage?.content || 'No messages yet'}
              </Text>
            </View>
            
            {item.lastMessage && (
              <Text style={styles.timeText}>
                {new Date(item.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No conversations yet</Text>
          </View>
        }
      />
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
    marginTop: 50,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  conversationInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    maxWidth: '80%',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
});