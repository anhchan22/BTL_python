import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Chip
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}>
          Industrial Zone Rental
        </Typography>

        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/zones')}>
            Zones
          </Button>
          <Button color="inherit" onClick={() => navigate('/rentals')}>
            Requests
          </Button>
          <Button color="inherit" onClick={() => navigate('/contracts')}>
            Contracts
          </Button>
          {isAdmin && isAdmin() && (
            <Button color="inherit" onClick={() => navigate('/admin/users')}>
              Manage Users
            </Button>
          )}
        </Box>

        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Role Badge */}
          <Chip
            label={user.profile?.role || 'TENANT'}
            color={user.profile?.role === 'ADMIN' ? 'primary' : 'default'}
            size="small"
            icon={user.profile?.role === 'ADMIN' ? <AdminPanelSettings /> : undefined}
          />

          <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">
                {user.username}
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
              My Profile
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/dashboard'); }}>
              Dashboard
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
