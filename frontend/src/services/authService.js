import apiClient from './api';

const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data && response.data.token) {
      // Store token and user info upon successful login
      localStorage.setItem('authToken', response.data.token);
      // You might want to store user info as well, or fetch it separately
      // localStorage.setItem('authUser', JSON.stringify({ username: response.data.username, role: response.data.role, _id: response.data._id }));
      return response.data; // Contains token, user details, message
    } else {
      // Handle cases where token is not in the response, though backend should always send it on success
      throw new Error('Login failed: No token received');
    }
  } catch (error) {
    // Axios wraps errors, actual error from backend is in error.response.data
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    console.error('Login error:', errorMessage);
    throw new Error(errorMessage);
  }
};

const logout = () => {
  // Remove token and user info from storage
  localStorage.removeItem('authToken');
  // localStorage.removeItem('authUser');
  // Optionally, you might want to call a backend logout endpoint if it exists
  // e.g., await apiClient.post('/auth/logout');
  // For now, client-side logout is sufficient for JWT based auth if no server-side session invalidation is needed.
};

// Optional: if you need a registration function in the frontend
// const register = async (userData) => {
//   try {
//     const response = await apiClient.post('/auth/register', userData);
//     if (response.data && response.data.token) {
//       localStorage.setItem('authToken', response.data.token);
//       // localStorage.setItem('authUser', JSON.stringify({ username: response.data.username, role: response.data.role, _id: response.data._id }));
//       return response.data;
//     }
//     throw new Error('Registration failed: No token received');
//   } catch (error) {
//     const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
//     console.error('Registration error:', errorMessage);
//     throw new Error(errorMessage);
//   }
// };

// Function to get current user from localStorage (if stored)
const getCurrentUser = () => {
  const token = localStorage.getItem('authToken');
  // const userString = localStorage.getItem('authUser');
  // if (token && userString) {
  //   try {
  //     return JSON.parse(userString);
  //   } catch (e) {
  //     console.error("Error parsing user from localStorage", e);
  //     return null;
  //   }
  // } // For now, we will rely on AuthContext to fetch user or decode from token
  return token ? true : false; // Simplified: just check if token exists for now
};

const getMyProfile = async () => {
  // This function assumes the token is already set in apiClient's interceptor
  try {
    const response = await apiClient.get('/auth/profile');
    return response.data; // { _id, username, role }
  } catch (error) {
    console.error('Get profile error:', error.response?.data?.message || error.message);
    // If token is invalid or expired, backend will return 401, which will be caught here
    // The interceptor in api.js doesn't handle 401 globally yet, 
    // so AuthContext will need to clear auth state if this fails due to auth issues.
    throw error; 
  }
};

export const authService = {
  login,
  logout,
  // register, // Uncomment if you implement frontend registration
  getCurrentUser, // This is a simplified version
  getMyProfile, 
}; 