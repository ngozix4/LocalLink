import axios from 'axios';

const API_BASE_URL = "https://locallink-lxzp.onrender.com";

export const login = async (email, password) => {
  try {
  console.log("Attempting login at:", `${API_BASE_URL}/api/auth/login`);
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
    console.log("[Auth] Login response:", response.data);
    return {
      token: response.data.token,
      business: response.data.user,
    };
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const register = async (email, password, businessData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
      email,
      password,
      business_name: businessData.business_name,
      business_type: businessData.business_type,
      location: businessData.location,
    });
    return {
      token: response.data.token,
      business: response.data.user,
    };
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getBusinessProfile = async (token, businessId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/businesses/${businessId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};