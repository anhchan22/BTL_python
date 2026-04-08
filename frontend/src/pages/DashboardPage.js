import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Paper, Grid } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { contractService } from '../services/contractService';

export default function DashboardPage() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeContracts, setActiveContracts] = useState([]);

  useEffect(() => {
    loadActiveContracts();
  }, []);

  const loadActiveContracts = async () => {
    try {
      const data = await contractService.getMyActiveContracts();
      // Handle both paginated and non-paginated responses
      const contractList = Array.isArray(data) ? data : (data.results || []);
      setActiveContracts(contractList);
    } catch (err) {
      console.error('Failed to load contracts:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome, {user?.username}!
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Role: {user?.profile?.role}
          </Typography>

          {user?.profile?.company_name && (
            <Typography variant="body1" gutterBottom>
              Company: {user.profile.company_name}
            </Typography>
          )}

          <Typography variant="body2" sx={{ mt: 2 }}>
            Email: {user?.email}
          </Typography>

          {user?.profile?.phone && (
            <Typography variant="body2">
              Phone: {user.profile.phone}
            </Typography>
          )}

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              {isAdmin() ? '🔧 Admin Dashboard' : '👤 Tenant Dashboard'}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/zones')}
                >
                  View Industrial Zones
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/rentals')}
                >
                  {isAdmin() ? 'Manage Rental Requests' : 'My Rental Requests'}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/contracts')}
                >
                  View Contracts
                </Button>
              </Grid>
            </Grid>
          </Box>

          {activeContracts.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Active Contracts: {activeContracts.length}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/contracts')}
              >
                View All Contracts
              </Button>
            </Box>
          )}

          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{ mt: 3 }}
          >
            Logout
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

