import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageBubble = ({ message, isCurrentUser }) => {
  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      <Text style={[
        styles.messageText,
        isCurrentUser ? styles.currentUserText : styles.otherUserText
      ]}>
        {message.content}
      </Text>
      <Text style={[
        styles.timeText,
        isCurrentUser ? styles.currentUserTime : styles.otherUserTime
      ]}>
        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginBottom: 10,
    padding: 10,
    borderRadius: 12,
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#4A90E2',
    borderTopRightRadius: 0,
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },
  currentUserText: {
    color: 'white',
  },
  otherUserText: {
    color: 'black',
  },
  timeText: {
    fontSize: 10,
    marginTop: 5,
    textAlign: 'right',
  },
  currentUserTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  otherUserTime: {
    color: 'rgba(0,0,0,0.5)',
  },
});

export default MessageBubble;