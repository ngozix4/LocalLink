import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import { useTheme } from 'react-native-rapi-ui';

const Stack = createStackNavigator();

export default function AuthStack() {
  const { isDarkmode } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: isDarkmode ? '#17171E' : '#FFFFFF',
        },
      }}
      initialRouteName="Welcome"
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen} 
        options={{
          animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{
          animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{
          animationEnabled: true,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
        options={{
          title: 'Reset Password',
        }}
      />
      <Stack.Screen 
        name="ResetPassword" 
        component={ResetPasswordScreen} 
        options={{
          title: 'Set New Password',
        }}
      />
    </Stack.Navigator>
  );
}