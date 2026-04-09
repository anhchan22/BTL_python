import api from './api';

// Get unread notification count
export const getUnreadCount = async () => {
  try {
    const response = await api.get(`/notifications/unread-count/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};

// Get all notifications for current user
export const getNotifications = async (page = 1, pageSize = 20) => {
  try {
    const response = await api.get(`/notifications/`, {
      params: {
        page,
        page_size: pageSize
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Mark notifications as read (bulk)
export const markAsRead = async (notificationIds = null, markAll = false) => {
  try {
    const data = markAll ? { mark_all: true } : { notification_ids: notificationIds };
    const response = await api.post(`/notifications/mark-as-read/`, data);
    return response.data;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};

// Mark single notification as read
export const markSingleAsRead = async (notificationId) => {
  try {
    const response = await api.post(
      `/notifications/${notificationId}/mark_single/`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};
