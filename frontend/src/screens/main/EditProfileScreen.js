import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { uploadBusinessLogo } from '../../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function EditProfileScreen({ navigation }) {
  const { business, updateBusiness } = useContext(AuthContext);
  const [businessName, setBusinessName] = useState(business.business_name);
  const [businessType, setBusinessType] = useState(business.business_type || '');
  const [location, setLocation] = useState(business.location || '');
  const [description, setDescription] = useState(business.description || '');
  const [logo, setLogo] = useState(business.logo?.url || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectLogo = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!pickerResult.cancelled) {
      setIsLoading(true);
      try {
        const uploadedLogo = await uploadBusinessLogo(business._id, pickerResult.uri);
        setLogo(uploadedLogo.url);
        updateBusiness({ ...business, logo: uploadedLogo });
        Alert.alert('Success', 'Logo updated successfully');
      } catch (error) {
        console.error('Failed to upload logo', error);
        Alert.alert('Error', 'Failed to upload logo');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updatedData = {
        business_name: businessName,
        business_type: businessType,
        location,
        description,
      };
      
      // Call API to update business
      const updatedBusiness = await updateBusinessProfile(business._id, updatedData);
      updateBusiness(updatedBusiness);
      
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update profile', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.logoContainer}
        onPress={handleSelectLogo}
        disabled={isLoading}
      >
        {logo ? (
          <Image source={{ uri: logo }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Icon name="add-a-photo" size={30} color="#4A90E2" />
          </View>
        )}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4A90E2" />
          </View>
        )}
      </TouchableOpacity>
      
      <Text style={styles.uploadText}>Tap to {logo ? 'change' : 'upload'} logo</Text>
      
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Business Name"
          value={businessName}
          onChangeText={setBusinessName}
        />
        <TextInput
          style={styles.input}
          placeholder="Business Type"
          value={businessType}
          onChangeText={setBusinessType}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </View>
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignSelf: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderStyle: 'dashed',
  },
  loadingOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 60,
  },
  uploadText: {
    textAlign: 'center',
    color: '#4A90E2',
    marginBottom: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  saveButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});