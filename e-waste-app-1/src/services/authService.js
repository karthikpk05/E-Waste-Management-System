
import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const authService = {
  // User login endpoint
  loginUser: async (credentials) => {
    return axios.post(`${API_URL}/auth/login/user`, credentials);
  },

  // Admin login endpoint
  loginAdmin: async (credentials) => {
    return axios.post(`${API_URL}/auth/login/admin`, credentials);
  },

  // Pickup person login endpoint
  loginPickup: async (credentials) => {
    return axios.post(`${API_URL}/auth/login/pickup`, credentials); // Pickup uses same endpoint as user
  },

  // Legacy login method for backward compatibility
  login: async (credentials, isAdmin = false) => {
    const url = isAdmin ? `${API_URL}/auth/login/admin` : `${API_URL}/auth/login/user`;
    return axios.post(url, credentials);
  },

  register: async (userData) => {
    return axios.post(`${API_URL}/auth/register`, userData);
  },

  logout: async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    // Wrap email in an object so Spring can parse it as JSON
    return axios.post(
      `${API_URL}/auth/logout`,
      { email: user.email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  },

  getUserProfile: async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateUserProfile: async (profileData) => {
    const token = localStorage.getItem("token");
    return axios.put(`${API_URL}/user/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// import axios from 'axios';
// //import { authService } from '../services/authService';

// const API_BASE_URL = 'http://localhost:8080/api';

// // Create axios instance with base configuration
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add request interceptor to include token in headers
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor to handle token expiration
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export const authService = {
//   register: (userData) => {
//     return apiClient.post('/auth/register', userData);
//   },

//   login: (credentials, isAdmin = false) => {
//     const endpoint = isAdmin ? '/auth/login/admin' : '/auth/login/user';
//     return apiClient.post(endpoint, credentials);
//   },

//   logout: () => {
//     return apiClient.post('/auth/logout');
//   },

//   getUserProfile: () => {
//     return apiClient.get('/user/profile');
//   },

//   updateUserProfile: (userData) => {
//     return apiClient.put('/user/profile', userData);
//   },

//   getAllUsers: () => {
//     return apiClient.get('/admin/users');
//   },
// };

// //export default apiClient;
