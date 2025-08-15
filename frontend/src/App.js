import React from 'react';
import { AuthProvider } from './context/AuthContext';
import RootNavigator from './screens/RootNavigator';
import { NavigationIndependentTree } from '@react-navigation/native';


export default function App() {
  return (
    <AuthProvider>   
      <NavigationIndependentTree>
        <RootNavigator />
      </NavigationIndependentTree>
    </AuthProvider>
    
  );
}