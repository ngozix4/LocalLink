import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from 'react-native-rapi-ui';

export default function WelcomeScreen({ navigation }) {
  const { isDarkmode } = useTheme();

  return (
    <View style={[styles.container, isDarkmode ? styles.darkMode : styles.lightMode]}>
      <Image 
        source={require('../../../assets/images/icon.png')} 
        style={styles.logo}
      />
      <Text style={[styles.title, isDarkmode ? styles.textDark : styles.textLight]}>
        Welcome to LocalLink
      </Text>
      <Text style={[styles.subtitle, isDarkmode ? styles.textDark : styles.textLight]}>
        Connect with local businesses
      </Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={[styles.secondaryButtonText, isDarkmode ? styles.textDark : styles.textLight]}>
          Create Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  darkMode: {
    backgroundColor: '#17171E',
  },
  lightMode: {
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLight: {
    color: '#000000',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
  },
});