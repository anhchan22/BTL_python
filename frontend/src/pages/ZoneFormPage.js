import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, Paper, Alert,
  FormControlLabel, Checkbox
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { zoneService } from '../services/zoneService';

export default function ZoneFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    total_area: '',
    available_area: '',
    price_per_sqm: '',
    description: '',
    amenities: '',
    is_available: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadZone();
    }
  }, [id]);

  const loadZone = async () => {
    try {
      const data = await zoneService.getZone(id);
      setFormData(data);
    } catch (err) {
      setSubmitError('Failed to load zone');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitError('');
    setLoading(true);

    try {
      if (isEdit) {
        await zoneService.updateZone(id, formData);
      } else {
        await zoneService.createZone(formData);
      }
      navigate('/zones');
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setSubmitError('Failed to save zone');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this zone?')) {
      try {
        await zoneService.deleteZone(id);
        navigate('/zones');
      } catch (err) {
        setSubmitError('Failed to delete zone');
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/zones')} sx={{ mb: 2 }}>
        Back to Zones
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEdit ? 'Edit Industrial Zone' : 'Add New Industrial Zone'}
        </Typography>

        {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Zone Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.name}
            helperText={errors.name?.[0]}
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.location}
            helperText={errors.location?.[0]}
          />
          <TextField
            fullWidth
            label="Total Area (m²)"
            name="total_area"
            type="number"
            value={formData.total_area}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.total_area}
            helperText={errors.total_area?.[0]}
          />
          <TextField
            fullWidth
            label="Available Area (m²)"
            name="available_area"
            type="number"
            value={formData.available_area}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.available_area}
            helperText={errors.available_area?.[0]}
          />
          <TextField
            fullWidth
            label="Price per m²/month (VND)"
            name="price_per_sqm"
            type="number"
            value={formData.price_per_sqm}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.price_per_sqm}
            helperText={errors.price_per_sqm?.[0]}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            required
            error={!!errors.description}
            helperText={errors.description?.[0]}
          />
          <TextField
            fullWidth
            label="Amenities (comma-separated)"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={2}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="is_available"
                checked={formData.is_available}
                onChange={handleChange}
              />
            }
            label="Available for Rent"
            sx={{ mt: 2 }}
          />

          <Box mt={3} display="flex" gap={2}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Zone' : 'Create Zone')}
            </Button>
            {isEdit && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
