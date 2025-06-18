import apiClient from './api';

// 處理圖片路徑
const processImageUrl = (url) => {
  if (!url) return '';
  
  // 如果是完整的 URL（例如：http://或https://開頭），直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // 如果是相對路徑
  if (url.startsWith('/src/assets/')) {
    // 在開發環境中保持原樣
    if (import.meta.env.DEV) {
      return url;
    }
    // 在生產環境中修改路徑
    return url.replace('/src/assets/', '/assets/');
  }
  
  return url;
};

// Get all portfolio items
const getPortfolioItems = async () => {
  try {
    // Add a timestamp to bypass browser cache for GET requests
    const response = await apiClient.get(`/portfolio?_t=${new Date().getTime()}`);
    // 處理每個項目的圖片 URL
    return response.data.map(item => ({
      ...item,
      imageUrl: processImageUrl(item.imageUrl)
    }));
  } catch (error) {
    console.error('Error fetching portfolio items:', error.response?.data?.message || error.message);
    throw error; // Re-throw to be handled by the component
  }
};

// Get a single portfolio item by ID
const getPortfolioItemById = async (id) => {
  try {
    const response = await apiClient.get(`/portfolio/${id}`);
    // 處理圖片 URL
    return {
      ...response.data,
      imageUrl: processImageUrl(response.data.imageUrl)
    };
  } catch (error) {
    console.error(`Error fetching portfolio item ${id}:`, error.response?.data?.message || error.message);
    throw error;
  }
};

// Create a new portfolio item (requires admin auth)
const createPortfolioItem = async (itemData) => {
  try {
    const response = await apiClient.post('/portfolio', {
      ...itemData,
      imageUrl: processImageUrl(itemData.imageUrl)
    });
    return response.data;
  } catch (error) {
    console.error('Error creating portfolio item:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Update a portfolio item by ID (requires admin auth)
const updatePortfolioItem = async (id, itemData) => {
  try {
    const response = await apiClient.put(`/portfolio/${id}`, {
      ...itemData,
      imageUrl: processImageUrl(itemData.imageUrl)
    });
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