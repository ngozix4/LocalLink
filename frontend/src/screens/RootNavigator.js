import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import AuthStack from '../navigation/AuthStack';
import MainTabNavigator from '../navigation/MainTabNavigator';

export default function RootNavigator() {
  const { userToken, isLoading, isAppFirstLaunch } = useContext(AuthContext);

  if (isLoading || isAppFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <MainTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}