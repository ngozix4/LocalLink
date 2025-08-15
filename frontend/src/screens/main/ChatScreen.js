import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { getConversations, sendMessage } from '../../services/api';
import MessageBubble from '../../components/MessageBubble';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ChatScreen({ route }) {
  const { connectionId, otherBusinessId, otherBusinessName } = route.params;
  const { business } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef();

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messagesData = await getConversations(business._id, otherBusinessId);
        setMessages(messagesData);
      } catch (error) {
        console.error('Failed to load messages', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();
  }, [business._id, otherBusinessId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        sender_id: business._id,
        receiver_id: otherBusinessId,
        content: newMessage
      };

      // Optimistically update UI
      const tempId = Date.now().toString();
      setMessages(prev => [
        ...prev,
        {
          _id: tempId,
          ...messageData,
          created_at: new Date().toISOString()
        }
      ]);
      
      setNewMessage('');
      
      // Scroll to bottom
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }

      // Actually send to server
      const sentMessage = await sendMessage(messageData);
      
      // Replace temp message with actual one from server
      setMessages(prev => [
        ...prev.filter(m => m._id !== tempId),
        sentMessage
      ]);
    } catch (error) {
      console.error('Failed to send message', error);
      // Remove the optimistic message if sending failed
      setMessages(prev => prev.filter(m => m._id !== tempId));
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{otherBusinessName}</Text>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MessageBubble 
            message={item} 
            isCurrentUser={item.sender_id === business._id}
          />
        )}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
        />
        
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Icon 
            name="send" 
            size={24} 
            color={newMessage.trim() ? '#4A90E2' : '#ccc'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messagesContainer: {
    padding: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
  },
});