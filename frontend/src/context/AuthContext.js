import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login, register, getBusinessProfile } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [business, setBusiness] = useState(null);
  const [isAppFirstLaunch, setIsAppFirstLaunch] = useState(null);

  useEffect(() => {
  const bootstrapAsync = async () => {
    try {
      const hasLaunched = await SecureStore.getItemAsync('isAppFirstLaunch');
      
      if (hasLaunched === null) {
        // FIRST LAUNCH
        await SecureStore.setItemAsync('isAppFirstLaunch', 'launched');
        setIsAppFirstLaunch(true); // 👈 Correct: true = first launch
        setUserToken(null);
      } else {
        // SUBSEQUENT LAUNCH
        setIsAppFirstLaunch(false); // 👈 Correct: false = not first launch
        
        // Normal auth flow
        const token = await SecureStore.getItemAsync('userToken');
        const storedBusinessId = await SecureStore.getItemAsync(String('businessId'));

        if (token && storedBusinessId) {
          const businessProfile = await getBusinessProfile(token, storedBusinessId);
          setUserToken(token);
          setBusiness(businessProfile);
        } else {
          // Token or businessId missing — treat as logged out
          setUserToken(null);
        }
      }
    } catch (error) {
      console.error('Bootstrap failed:', error);
      setIsAppFirstLaunch(false); // Default to false on error
      setUserToken(null);
    } finally {
      setIsLoading(false);
    }
  };
  bootstrapAsync();
}, []);

  const authContext = {
    business,
    isLoading,
    userToken,
    login: async (email, password) => {
      try {
        console.log("[Context] Starting login...");
        const { token, business } = await login(email, password);
        console.log("[Context] Login successful, token:", token);
        setUserToken(token);
        setBusiness(business);
        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('businessId', String(business._id));
        console.log("[Context] Tokens stored successfully");
        return true;
      } catch (error) {
        throw error;
      }
    },
    register: async (email, password, businessData) => {
      try {
        const { token, business } = await register(email, password, businessData);
        setUserToken(token);
        setBusiness(business);
        await SecureStore.setItemAsync('userToken', token);
        return true;
      } catch (error) {
        throw error;
      }
    },
    logout: async () => {
      setUserToken(null);
      setBusiness(null);
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('businessId');
    },
    updateBusiness: (updatedBusiness) => {
      setBusiness(updatedBusiness);
    }
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};