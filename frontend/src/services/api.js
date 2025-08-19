import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


const API_BASE_URL = "https://locallink-lxzp.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const publicEndpoints = [
    '/api/businesses',
    '/api/businesses/nearby'
  ];

   if (publicEndpoints.some(endpoint => config.url.includes(endpoint))) {
    return config;
  }
  const token = await SecureStore.getItemAsync('apiuserToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Updated searchBusinesses with location support
export const searchBusinesses = async (queryParams = {}) => {
  try {
    // If location coordinates are provided, use the nearby endpoint
    if (queryParams.latitude && queryParams.longitude) {
      const response = await api.get('/api/businesses/nearby', {
        params: {
          lat: queryParams.latitude,
          lng: queryParams.longitude,
          radius: queryParams.radius || 10000 // Default 10km radius
        }
      });
      return response.data;
    }
    
    // Otherwise use regular search
    const response = await api.get('/api/businesses', { 
      params: queryParams 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// New function to get businesses near current location
export const getNearbyBusinesses = async (latitude, longitude, radius = 10000) => {
  try {
    console.log('Making nearby request with:', { latitude, longitude, radius });
    
    const response = await api.get('/api/businesses/nearby', {
      params: { 
        lat: latitude, 
        lng: longitude, 
        radius 
      },
      // Explicitly skip auth if needed
      skipAuth: true
    });
    
    console.log('Nearby businesses response:', response.data.length);
    return response.data;
  } catch (error) {
    console.error("Failed to get nearby businesses", {
      error: error.message,
      response: error.response?.data,
      config: error.config
    });
    throw error.response?.data?.error || error.message;
  }
};
// Updated getBusinessById to include full location data
export const getBusinessById = async (businessId) => {
  try {
    const response = await api.get(`/api/businesses/${businessId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting business:", error);
    throw error.response?.data?.error || error.message;
  }
};


export const registerBusiness = async (businessData) => {
  try {
    const response = await api.post('/api/auth/register', businessData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const loginBusiness = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

// business.js routes
export const uploadBusinessImages = async (businessId, images) => {
  try {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('/apiimages', {
        uri: image.uri,
        name: `image_${index}.jpg`,
        type: 'image/jpeg',
      });
    });

    const response = await api.post(`/api/businesses/${businessId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const deleteBusinessImage = async (businessId, publicId) => {
  try {
    const response = await api.delete(`/api/businesses/${businessId}/images/${publicId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getBusinessProducts = async (token, businessId) => {
  try {
    const response = await api.get(`/api/products/business/${businessId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await api.get(`/api/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post('/api/products', productData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/api/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const searchProducts = async (queryParams = {}) => {
  try {
    const response = await api.get('/api/products/search', { params: queryParams });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const uploadProductMainImage = async (productId, imageUri) => {
  try {
    const formData = new FormData();
    formData.append('/apimainImage', {
      uri: imageUri,
      name: 'mainImage.jpg',
      type: 'image/jpeg',
    });

    const response = await api.post(`/api/products/${productId}/mainImage`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const uploadProductGalleryImages = async (productId, images) => {
  try {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('/apigallery', {
        uri: image.uri,
        name: `gallery_${index}.jpg`,
        type: 'image/jpeg',
      });
    });

    const response = await api.post(`/api/products/${productId}/gallery`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const deleteProductGalleryImage = async (productId, publicId) => {
  try {
    const response = await api.delete(`/api/products/${productId}/gallery/${publicId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};


export const createConnection = async (connectionData) => {
  try {
    const response = await api.post('/api/connections', connectionData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createReview = async (reviewData) => {
  try {
    const response = await api.post('/api/reviews', reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getBusinessReviews = async (businessId) => {
  try {
    const response = await api.get(`/api/reviews/business/${businessId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const updateBusinessProfile = async (businessId, updateData) => {
  try {
    const response = await api.put(`/api/businesses/${businessId}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const uploadBusinessLogo = async (businessId, imageUri) => {
  try {
    const formData = new FormData();
    formData.append('/apilogo', {
      uri: imageUri,
      name: 'logo.jpg',
      type: 'image/jpeg',
    });

    const response = await api.post(`/api/businesses/${businessId}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};


export const getBusinessConnections = async (businessId, status = null) => {
  try {
    const params = status ? { status } : {};
    const response = await api.get(`/api/connections/business/${businessId}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const updateConnectionStatus = async (connectionId, status) => {
  try {
    const response = await api.put(`/api/connections/${connectionId}`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getConversations = async (business1, business2, limit = null) => {
  try {
    const params = { business1, business2 };
    if (limit) params.limit = limit;
    const response = await api.get('/api/messages/conversation', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const sendMessage = async (messageData) => {
  try {
    const response = await api.post('/api/messages', messageData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/api/orders', orderData );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getBusinessOrders = async (businessId, type) => {
  try {
    const response = await api.get(`/api/orders/business/${businessId}`, { params: { type } });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const updateOrderStatus = async (orderId, status, verificationCode) => {
  try {
    const response = await api.put(`/api/orders/${orderId}/status`, { 
      status, 
      verification_code: verificationCode 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getBusinessNotifications = async (businessId) => {
  try {
    const response = await api.get(`api/notifications/business/${businessId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getUnreadNotifications = async (businessId) => {
  try {
    const response = await api.get(`/api/notifications/business/${businessId}`, { 
      params: { read: false } 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getCurrentLocation = async () => {
  // This is a mock implementation returning Johannesburg coordinates
  return {
    latitude: -26.2041,
    longitude: 28.0473,
    city: 'Johannesburg'
  };
};

