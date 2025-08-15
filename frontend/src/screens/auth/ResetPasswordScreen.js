import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-rapi-ui';

export default function ResetPasswordScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { isDarkmode } = useTheme();

  const handleSubmit = () => {
    // Implement password reset logic
    navigation.navigate('Login');
  };

  return (
    <View style={[styles.container, isDarkmode ? styles.darkMode : styles.lightMode]}>
      <Text style={[styles.title, isDarkmode ? styles.textDark : styles.textLight]}>
        Reset Password
      </Text>
      
      <TextInput
        style={[styles.input, isDarkmode ? styles.inputDark : styles.inputLight]}
        placeholder="New Password"
        placeholderTextColor={isDarkmode ? '#999' : '#888'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TextInput
        style={[styles.input, isDarkmode ? styles.inputDark : styles.inputLight]}
        placeholder="Confirm New Password"
        placeholderTextColor={isDarkmode ? '#999' : '#888'}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Update Password</Text>
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
    marginBottom: 15,
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
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});