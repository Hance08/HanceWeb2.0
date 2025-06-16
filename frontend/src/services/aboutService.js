import apiClient from './api';

// Get a specific section of About Me content
const getAboutSection = async (sectionName) => {
  try {
    const response = await apiClient.get(`/about/${sectionName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching about section ${sectionName}:`, error.response?.data?.message || error.message);
    throw error; // Re-throw to be handled by the component
  }
};

// Get all About Me sections
const getAllAboutSections = async () => {
  try {
    const response = await apiClient.get('/about');
    return response.data;
  } catch (error) {
    console.error('Error fetching all about sections:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Update a specific section of About Me content (requires admin auth)
const updateAboutSection = async (sectionName, data) => {
  try {
    // Token will be included by the apiClient interceptor
    const response = await apiClient.put(`/about/${sectionName}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating about section ${sectionName}:`, error.response?.data?.message || error.message);
    throw error;
  }
};

export const aboutService = {
  getAboutSection,
  getAllAboutSections,
  updateAboutSection,
}; 