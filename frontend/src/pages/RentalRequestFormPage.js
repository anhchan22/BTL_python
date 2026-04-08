import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, Paper, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { zoneService } from '../services/zoneService';
import { rentalService } from '../services/rentalService';

export default function RentalRequestFormPage() {
  const { zoneId } = useParams();
  const navigate = useNavigate();
  const [zone, setZone] = useState(null);
  const [formData, setFormData] = useState({
    zone: zoneId,
    requested_area: '',
    rental_duration: 12
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    loadZone();
  }, [zoneId]);

  const loadZone = async () => {
    try {
      const data = await zoneService.getZone(zoneId);
      setZone(data);
      setFormData(prev => ({ ...prev, zone: zoneId }));
    } catch (err) {
      setSubmitError('Failed to load zone');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateCost = () => {
    if (zone && formData.requested_area) {
      const monthlyCost = formData.requested_area * zone.price_per_sqm;
      const totalCost = monthlyCost * (formData.rental_duration || 1);
      return { monthlyCost, totalCost };
    }
    return { monthlyCost: 0, totalCost: 0 };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitError('');
    setLoading(true);

    try {
      await rentalService.createRequest(formData);
      navigate('/rentals');
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setSubmitError('Failed to submit request');
      }
    } finally {
      setLoading(false);
    }
  };

  const { monthlyCost, totalCost } = calculateCost();

  if (!zone) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/zones/${zoneId}`)} sx={{ mb: 2 }}>
        Back to Zone
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Request to Rent
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {zone.name}
        </Typography>

        {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}

        <Alert severity="info" sx={{ mb: 3 }}>
          Available Area: <strong>{zone.available_area} m²</strong>
        </Alert>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Requested Area (m²)"
            name="requested_area"
            type="number"
            value={formData.requested_area}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ min: 1, max: zone.available_area, step: 0.01 }}
            error={!!errors.requested_area}
            helperText={errors.requested_area?.[0] || `Max: ${zone.available_area} m²`}
          />
          <TextField
            fullWidth
            label="Rental Duration (months)"
            name="rental_duration"
            type="number"
            value={formData.rental_duration}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ min: 1 }}
            error={!!errors.rental_duration}
            helperText={errors.rental_duration?.[0]}
          />

          {formData.requested_area > 0 && (
            <Box mt={3} p={2} bgcolor="background.default" borderRadius={1}>
              <Typography variant="h6" gutterBottom>Cost Estimation</Typography>
              <Typography variant="body1">
                Monthly Cost: <strong>{formatPrice(monthlyCost)}</strong>
              </Typography>
              <Typography variant="body1">
                Total Cost ({formData.rental_duration} months): <strong>{formatPrice(totalCost)}</strong>
              </Typography>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
