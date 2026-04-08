import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button, Paper, Chip, Grid, Alert,
  LinearProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../contexts/AuthContext';
import { contractService } from '../services/contractService';

export default function ContractDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadContract();
  }, [id]);

  const loadContract = async () => {
    try {
      const data = await contractService.getContract(id);
      setContract(data);
    } catch (err) {
      setError('Failed to load contract');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateProgress = () => {
    if (!contract) return 0;
    const start = new Date(contract.start_date);
    const end = new Date(contract.end_date);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!contract) return <Typography>Contract not found</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/contracts')} sx={{ mb: 2 }}>
        Back to Contracts
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Contract {contract.contract_number}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created: {new Date(contract.created_at).toLocaleDateString()}
            </Typography>
          </Box>
          <Chip
            label={contract.status}
            color={
              contract.status === 'ACTIVE' ? 'success' :
              contract.status === 'EXPIRED' ? 'warning' : 'error'
            }
            size="large"
          />
        </Box>

        <Grid container spacing={3}>
          {isAdmin() && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">Tenant</Typography>
              <Typography variant="h6">{contract.tenant_info?.username}</Typography>
              <Typography variant="body2">{contract.tenant_info?.email}</Typography>
              {contract.tenant_info?.profile?.company_name && (
                <Typography variant="body2">
                  Company: {contract.tenant_info.profile.company_name}
                </Typography>
              )}
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Industrial Zone</Typography>
            <Typography variant="h6">{contract.zone_info?.name}</Typography>
            <Typography variant="body2">{contract.zone_info?.location}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Contracted Area</Typography>
            <Typography variant="h6">{contract.area} m²</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Monthly Rent</Typography>
            <Typography variant="h6">{formatPrice(contract.monthly_rent)}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
            <Typography variant="body1">
              {new Date(contract.start_date).toLocaleDateString()}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
            <Typography variant="body1">
              {new Date(contract.end_date).toLocaleDateString()}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
            <Typography variant="body1">{contract.duration_months} months</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Total Contract Value</Typography>
            <Typography variant="h6">{formatPrice(contract.total_value)}</Typography>
          </Grid>
        </Grid>

        {contract.status === 'ACTIVE' && (
          <Box mt={4}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Contract Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={calculateProgress()}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {contract.days_remaining} days remaining
            </Typography>
          </Box>
        )}

        {contract.rental_request_id && (
          <Box mt={3}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/rentals/${contract.rental_request_id}`)}
            >
              View Original Request
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
