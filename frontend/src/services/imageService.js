import api from './api';

// Add image to zone
export const addImage = async (zoneId, imageData) => {
  try {
    // If imageData is FormData, don't set Content-Type (let browser handle it)
    const config = {};
    if (imageData instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data'
      };
    }

    const response = await api.post(
      `/zones/${zoneId}/images/`,
      imageData,
      config
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding image to zone ${zoneId}:`, error);
    throw error;
  }
};

// Delete image from zone
export const deleteImage = async (zoneId, imageId) => {
  try {
    await api.delete(
      `/zones/${zoneId}/images/${imageId}/`
    );
  } catch (error) {
    console.error(`Error deleting image ${imageId}:`, error);
    throw error;
  }
};

// Get zone images (usually called as part of zone detail)
export const getZoneImages = async (zoneId) => {
  try {
    const response = await api.get(
      `/zones/${zoneId}/images/`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching images for zone ${zoneId}:`, error);
    throw error;
  }
};
