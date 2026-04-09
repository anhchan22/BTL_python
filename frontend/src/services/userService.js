/**
 * User Management Service
 * Helper functions for user-related API calls (role changes, profile updates)
 */

import api from './api';

/**
 * Get all users (admin-only)
 * GET /api/users/
 */
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users/');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to fetch users'
    };
  }
};

/**
 * Change user role (admin-only)
 * PATCH /api/users/{user_id}/role/
 */
export const changeUserRole = async (userId, newRole) => {
  try {
    const response = await api.patch(`/users/${userId}/role/`, {
      role: newRole
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.detail || 'Failed to change role'
    };
  }
};

/**
 * Promote user to admin
 * PATCH /api/users/{user_id}/role/
 */
export const promoteUser = async (userId) => {
  return changeUserRole(userId, 'ADMIN');
};

/**
 * Demote user to tenant
 * PATCH /api/users/{user_id}/role/
 */
export const demoteUser = async (userId) => {
  return changeUserRole(userId, 'TENANT');
};

/**
 * Update current user profile
 * PATCH /api/users/me/profile/
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.patch('/users/me/profile/', profileData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || { detail: 'Failed to update profile' }
    };
  }
};

/**
 * Change user password
 * PATCH /api/users/me/profile/
 */
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await api.patch('/users/me/profile/', {
      old_password: oldPassword,
      password: newPassword,
      password_confirm: newPassword
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || { detail: 'Failed to change password' }
    };
  }
};
