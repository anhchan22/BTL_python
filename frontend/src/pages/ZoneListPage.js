import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button, Grid, Card, CardContent,
  CardActions, TextField, InputAdornment, Chip, Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../contexts/AuthContext';
import { zoneService } from '../services/zoneService';

export default function ZoneListPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      const data = await zoneService.getAllZones();
      // Handle both paginated and non-paginated responses
      const zoneList = Array.isArray(data) ? data : (data.results || []);
      setZones(zoneList);
    } catch (err) {
      setError('Failed to load zones');
    } finally {
      setLoading(false);
    }
  };

  const filteredZones = zones.filter(zone =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Industrial Zones</Typography>
        {isAdmin() && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/zones/create')}
          >
            Add Zone
          </Button>
        )}
      </Box>

      <TextField
        fullWidth
        placeholder="Search by name or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Typography>Loading zones...</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredZones.map((zone) => (
            <Grid item xs={12} md={6} lg={4} key={zone.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {zone.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    📍 {zone.location}
                  </Typography>
                  <Box mt={2}>
                    <Typography variant="body2">
                      Total Area: <strong>{zone.total_area} m²</strong>
                    </Typography>
                    <Typography variant="body2">
                      Available: <strong>{zone.available_area} m²</strong>
                    </Typography>
                    <Typography variant="body2">
                      Price: <strong>{formatPrice(zone.price_per_sqm)}/m²/month</strong>
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    {zone.is_available && zone.available_area > 0 ? (
                      <Chip label="Available" color="success" size="small" />
                    ) : (
                      <Chip label="Not Available" color="error" size="small" />
                    )}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/zones/${zone.id}`)}>
                    View Details
                  </Button>
                  {isAdmin() && (
                    <Button size="small" onClick={() => navigate(`/zones/${zone.id}/edit`)}>
                      Edit
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && filteredZones.length === 0 && (
        <Typography align="center" color="text.secondary">
          No zones found
        </Typography>
      )}
    </Container>
  );
}
