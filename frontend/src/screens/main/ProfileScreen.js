import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text,
  TextInput, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { 
  getBusinessById, 
  updateBusinessProfile, 
  uploadBusinessLogo, 
  uploadBusinessImages,
  deleteBusinessImage
} from '../../services/api';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';



const ProfileScreen = () => {
  const { business, updateBusiness, userToken } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: '',
    location: '',
    description: ''
  });

  const handleLogout = async () => {
    try {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              await logout();
              // If you're using navigation, you might want to reset the stack here
              // navigation.reset({
              //   index: 0,
              //   routes: [{ name: 'Login' }],
              // });
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
        console.log("In Profile screen now");
      if (business?._id) {
        console.log(business._id);
        try {
          setIsLoading(true);
          const profileData = await getBusinessById(userToken, business._id);
          console.log("Profile", profileData);
          setProfile(profileData);
          setFormData({
            business_name: profileData.business_name || '',
            business_type: profileData.business_type || '',
            location: profileData.location || '',
            description: profileData.description || ''
          });
        } catch (error) {
          Alert.alert('Error', 'Failed to load profile');
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
  }, [business]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      const updatedProfile = await updateBusinessProfile(business._id, formData);
      setProfile(updatedProfile);
      updateBusiness(updatedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const pickLogo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsLoading(true);
        const updatedBusiness = await uploadBusinessLogo(business._id, result.assets[0].uri);
        setProfile(updatedBusiness);
        updateBusiness(updatedBusiness);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to upload logo');
    } finally {
      setIsLoading(false);
    }
  };

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 5
      });

      if (!result.canceled && result.assets.length > 0) {
        setIsLoading(true);
        const imageUris = result.assets.map(asset => asset.uri);
        const updatedBusiness = await uploadBusinessImages(business._id, imageUris);
        setProfile(updatedBusiness);
        updateBusiness(updatedBusiness);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to upload images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async (publicId) => {
    try {
      setIsLoading(true);
      await deleteBusinessImage(business._id, publicId);
      const updatedProfile = await getBusinessById(business._id);
      setProfile(updatedProfile);
      updateBusiness(updatedProfile);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to delete image');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>No profile data available</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <MaterialIcons name="logout" size={24} color="#FF3B30" />
      <Text style={styles.buttonText}>Logout</Text>
    </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Business Profile</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="#FF3B30" />
        <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        
        {!isEditing ? (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <MaterialIcons name="edit" size={24} color="#4A90E2" />
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity 
              onPress={handleUpdateProfile}
              disabled={isLoading}
            >
              <Ionicons name="checkmark" size={24} color="#4A90E2" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setIsEditing(false)}
              style={{ marginLeft: 15 }}
              disabled={isLoading}
            >
              <Ionicons name="close" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Logo</Text>
        <TouchableOpacity 
          onPress={pickLogo}
          disabled={isLoading || !isEditing}
        >
          {profile.logo?.url ? (
            <Image 
              source={{ uri: profile.logo.url }} 
              style={styles.logo} 
            />
          ) : (
            <View style={styles.logoPlaceholder}>
              <MaterialIcons name="add-a-photo" size={40} color="#ccc" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Information</Text>
        
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={formData.business_name}
              onChangeText={(text) => handleInputChange('business_name', text)}
              placeholder="Business Name"
            />
            <TextInput
              style={styles.input}
              value={formData.business_type}
              onChangeText={(text) => handleInputChange('business_type', text)}
              placeholder="Business Type"
            />
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => handleInputChange('location', text)}
              placeholder="Location"
            />
            <TextInput
              style={[styles.input, { height: 100 }]}
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              placeholder="Description"
              multiline
            />
          </>
        ) : (
          <>
            <Text style={styles.infoText}>Name: {profile.business_name}</Text>
            <Text style={styles.infoText}>Type: {profile.business_type || 'Not specified'}</Text>
            <Text style={styles.infoText}>Location: {profile.location || 'Not specified'}</Text>
            <Text style={styles.infoText}>Description: {profile.description || 'Not specified'}</Text>
          </>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          {isEditing && (
            <TouchableOpacity onPress={pickImages} disabled={isLoading}>
              <MaterialIcons name="add-photo-alternate" size={24} color="#4A90E2" />
            </TouchableOpacity>
          )}
        </View>
        
        {profile.images?.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {profile.images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image 
                  source={{ uri: image.url }} 
                  style={styles.galleryImage} 
                />
                {isEditing && (
                  <TouchableOpacity 
                    style={styles.deleteImageButton}
                    onPress={() => handleDeleteImage(image.public_id)}
                    disabled={isLoading}
                  >
                    <Ionicons name="trash" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noImagesText}>No images added yet</Text>
        )}
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  editActions: {
    flexDirection: 'row',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  galleryImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  deleteImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    padding: 5,
  },
  noImagesText: {
    color: '#999',
    fontStyle: 'italic',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;