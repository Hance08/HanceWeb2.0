import apiClient from './api';

// Get all portfolio items
const getPortfolioItems = async () => {
  try {
    // Add a timestamp to bypass browser cache for GET requests
    const response = await apiClient.get(`/portfolio?_t=${new Date().getTime()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio items:', error.response?.data?.message || error.message);
    throw error; // Re-throw to be handled by the component
  }
};

// Get a single portfolio item by ID
const getPortfolioItemById = async (id) => {
  try {
    const response = await apiClient.get(`/portfolio/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching portfolio item ${id}:`, error.response?.data?.message || error.message);
    throw error;
  }
};

// Create a new portfolio item (requires admin auth)
const createPortfolioItem = async (itemData) => {
  try {
    const response = await apiClient.post('/portfolio', itemData);
    return response.data;
  } catch (error) {
    console.error('Error creating portfolio item:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Update a portfolio item by ID (requires admin auth)
const updatePortfolioItem = async (id, itemData) => {
  try {
    const response = await apiClient.put(`/portfolio/${id}`, itemData);
    return response.data;
  } catch (error) {
    console.error(`Error updating portfolio item ${id}:`, error.response?.data?.message || error.message);
    throw error;
  }
};

// Delete a portfolio item by ID (requires admin auth)
const deletePortfolioItem = async (id) => {
  try {
    const response = await apiClient.delete(`/portfolio/${id}`);
    return response.data; // Should be { message: 'Portfolio item removed' }
  } catch (error) {
    console.error(`Error deleting portfolio item ${id}:`, error.response?.data?.message || error.message);
    throw error;
  }
};

export const portfolioService = {
  getPortfolioItems,
  getPortfolioItemById,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
}; 