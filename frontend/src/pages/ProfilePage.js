import React, { useState } from 'react';
import {
  Container, Box, TextField, Button, Typography, Paper, Alert, Divider, Snackbar
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import * as userService from '../services/userService';

export default function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    company_name: user?.profile?.company_name || ''
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    password: '',
    password_confirm: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e, isPassword = false) => {
    const { name, value } = e.target;
    if (isPassword) {
      setPasswordData({ ...passwordData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = await userService.updateUserProfile(formData);
    if (result.success) {
      showSnackbar('Profile updated successfully', 'success');
    } else {
      if (typeof result.error === 'object') {
        setErrors(result.error);
      } else {
        showSnackbar(result.error, 'error');
      }
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validate passwords match
    if (passwordData.password !== passwordData.password_confirm) {
      setErrors({ password: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    const result = await userService.changePassword(
      passwordData.old_password,
      passwordData.password
    );

    if (result.success) {
      showSnackbar('Password changed successfully', 'success');
      setPasswordData({ old_password: '', password: '', password_confirm: '' });
    } else {
      if (typeof result.error === 'object') {
        setErrors(result.error);
      } else {
        showSnackbar(result.error, 'error');
      }
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            My Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Update your account information
          </Typography>

          <Box sx={{ my: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>Username:</strong> {user?.username}
            </Typography>
            <Typography variant="body2">
              <strong>Role:</strong> {user?.profile?.role}
            </Typography>
          </Box>

          {/* Profile Form */}
          <Box component="form" onSubmit={handleSaveProfile} sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>

            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              margin="normal"
              error={!!errors.first_name}
              helperText={errors.first_name}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              margin="normal"
              error={!!errors.last_name}
              helperText={errors.last_name}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              disabled
              helperText="Email cannot be changed"
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              error={!!errors.phone}
              helperText={errors.phone}
            />
            <TextField
              fullWidth
              label="Company Name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              margin="normal"
              error={!!errors.company_name}
              helperText={errors.company_name}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              Save Profile
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Password Change Form */}
          <Box component="form" onSubmit={handleChangePassword}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>

            <TextField
              fullWidth
              label="Current Password"
              name="old_password"
              type="password"
              value={passwordData.old_password}
              onChange={(e) => handleChange(e, true)}
              margin="normal"
              error={!!errors.old_password}
              helperText={errors.old_password}
            />
            <TextField
              fullWidth
              label="New Password"
              name="password"
              type="password"
              value={passwordData.password}
              onChange={(e) => handleChange(e, true)}
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              name="password_confirm"
              type="password"
              value={passwordData.password_confirm}
              onChange={(e) => handleChange(e, true)}
              margin="normal"
              error={!!errors.password_confirm}
              helperText={errors.password_confirm}
            />

            <Button
              fullWidth
              type="submit"
              variant="outlined"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              Change Password
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
