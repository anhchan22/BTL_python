import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Button, Paper, Dialog,
  DialogTitle, DialogContent, DialogActions, Alert, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Tooltip, Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../contexts/AuthContext';
import * as userService from '../services/userService';

export default function UserManagementPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch all users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const result = await userService.getAllUsers();
    if (result.success) {
      setUsers(result.data.users || result.data || []);
    } else {
      showSnackbar(result.error, 'error');
    }
    setLoading(false);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const openRoleDialog = (selectedUser) => {
    setSelectedUser(selectedUser);
    setNewRole(selectedUser.profile.role);
    setDialogOpen(true);
  };

  const handleRoleChange = async () => {
    if (!selectedUser || newRole === selectedUser.profile.role) {
      setDialogOpen(false);
      return;
    }

    // Validate: cannot demote last admin
    if (selectedUser.profile.role === 'ADMIN' && newRole === 'TENANT') {
      const adminCount = users.filter(u => u.profile.role === 'ADMIN').length;
      if (adminCount <= 1) {
        showSnackbar('Cannot demote last admin', 'error');
        setDialogOpen(false);
        return;
      }
    }

    // Optimistic update
    const optimisticUser = { ...selectedUser, profile: { ...selectedUser.profile, role: newRole } };
    setUsers(users.map(u => u.id === selectedUser.id ? optimisticUser : u));
    setDialogOpen(false);

    // API call
    const result = await userService.changeUserRole(selectedUser.id, newRole);
    if (result.success) {
      showSnackbar(result.data.message || `Role changed to ${newRole}`, 'success');
      setSelectedUser(null);
    } else {
      // Revert optimistic update on error
      setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
      showSnackbar(result.error, 'error');
    }
  };

  const canDemote = (targetUser) => {
    if (!targetUser || !targetUser.profile) return false;
    if (targetUser.profile.role === 'TENANT') return false;
    const adminCount = users.filter(u => u.profile.role === 'ADMIN').length;
    return adminCount > 1;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Manage user roles and permissions
        </Typography>

        {users.length === 0 ? (
          <Alert severity="info">No users found</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Username</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Role</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      {u.first_name && u.last_name
                        ? `${u.first_name} ${u.last_name}`
                        : '(No name)'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={u.profile.role}
                        color={u.profile.role === 'ADMIN' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Change role">
                        <IconButton
                          size="small"
                          onClick={() => openRoleDialog(u)}
                          disabled={u.id === user.id}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Role Change Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          {selectedUser && (
            <Box sx={{ py: 2 }}>
              <Typography variant="body2" gutterBottom>
                User: <strong>{selectedUser.username}</strong>
              </Typography>
              <Typography variant="body2" gutterBottom>
                Current Role: <strong>{selectedUser.profile.role}</strong>
              </Typography>
              <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2">New Role:</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  {['TENANT', 'ADMIN'].map(role => (
                    <Button
                      key={role}
                      variant={newRole === role ? 'contained' : 'outlined'}
                      onClick={() => setNewRole(role)}
                      size="small"
                    >
                      {role}
                    </Button>
                  ))}
                </Box>
              </Box>
              {!canDemote(selectedUser) && selectedUser?.profile?.role === 'ADMIN' && newRole === 'TENANT' && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Cannot demote the last administrator
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRoleChange}
            variant="contained"
            disabled={newRole === selectedUser?.profile?.role || (selectedUser && !canDemote(selectedUser) && selectedUser.profile.role === 'ADMIN' && newRole === 'TENANT')}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
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
