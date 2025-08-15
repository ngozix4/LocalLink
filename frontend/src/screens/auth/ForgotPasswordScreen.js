import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-rapi-ui';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const { isDarkmode } = useTheme();

  const handleResetPassword = () => {
    // Implement password reset logic
    navigation.navigate('ResetPassword');
  };

  return (
    <View style={[styles.container, isDarkmode ? styles.darkMode : styles.lightMode]}>
      <Text style={[styles.title, isDarkmode ? styles.textDark : styles.textLight]}>
        Forgot Password
      </Text>
      <Text style={[styles.subtitle, isDarkmode ? styles.textDark : styles.textLight]}>
        Enter your email to receive a reset link
      </Text>
      
      <TextInput
        style={[styles.input, isDarkmode ? styles.inputDark : styles.inputLight]}
        placeholder="Email"
        placeholderTextColor={isDarkmode ? '#999' : '#888'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleResetPassword}
      >
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={[styles.backText, isDarkmode ? styles.textDark : styles.textLight]}>
          Back to Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  darkMode: {
    backgroundColor: '#17171E',
  },
  lightMode: {
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30,
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLight: {
    color: '#000000',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  inputDark: {
    borderColor: '#333',
    color: '#FFF',
    backgroundColor: '#222',
  },
  inputLight: {
    borderColor: '#DDD',
    color: '#000',
    backgroundColor: '#FFF',
  },
  button: {
    height: 50,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backText: {
    textAlign: 'center',
  },
});