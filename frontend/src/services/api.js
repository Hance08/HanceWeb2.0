import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : '/api'; // Adjust for production if your API is served on the same domain

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to include JWT token in requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Or however you store your token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient; 