import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button, Paper, Chip, Grid, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../contexts/AuthContext';
import { zoneService } from '../services/zoneService';

export default function ZoneDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [zone, setZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadZone();
  }, [id]);

  const loadZone = async () => {
    try {
      const data = await zoneService.getZone(id);
      setZone(data);
    } catch (err) {
      setError('Failed to load zone details');
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

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!zone) return <Typography>Zone not found</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/zones')} sx={{ mb: 2 }}>
        Back to Zones
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {zone.name}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              📍 {zone.location}
            </Typography>
          </Box>
          {isAdmin() && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/zones/${id}/edit`)}
            >
              Edit
            </Button>
          )}
        </Box>

        <Box mb={3}>
          {zone.is_available && zone.available_area > 0 ? (
            <Chip label="Available for Rent" color="success" />
          ) : (
            <Chip label="Not Available" color="error" />
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Total Area</Typography>
            <Typography variant="h6">{zone.total_area} m²</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Available Area</Typography>
            <Typography variant="h6">{zone.available_area} m²</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Price per m²/month</Typography>
            <Typography variant="h6">{formatPrice(zone.price_per_sqm)}</Typography>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Description</Typography>
          <Typography variant="body1" paragraph>
            {zone.description}
          </Typography>
        </Box>

        {zone.amenities && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>Amenities</Typography>
            <Typography variant="body1">
              {zone.amenities}
            </Typography>
          </Box>
        )}

        {!isAdmin() && zone.is_available && zone.available_area > 0 && (
          <Box mt={4}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => navigate(`/zones/${id}/request`)}
            >
              Request to Rent
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
