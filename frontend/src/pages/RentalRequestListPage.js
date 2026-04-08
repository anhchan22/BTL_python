import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Button, Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { rentalService } from '../services/rentalService';

export default function RentalRequestListPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await rentalService.getAllRequests();
      // Handle both paginated and non-paginated responses
      const requestList = Array.isArray(data) ? data : (data.results || []);
      setRequests(requestList);
    } catch (err) {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'CANCELLED': return 'default';
      default: return 'default';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {isAdmin() ? 'All Rental Requests' : 'My Rental Requests'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Typography>Loading requests...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                {isAdmin() && <TableCell>Tenant</TableCell>}
                <TableCell>Zone</TableCell>
                <TableCell>Area (m²)</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Monthly Cost</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Requested</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  {isAdmin() && <TableCell>{request.tenant_info?.username}</TableCell>}
                  <TableCell>{request.zone_info?.name}</TableCell>
                  <TableCell>{request.requested_area}</TableCell>
                  <TableCell>{request.rental_duration} months</TableCell>
                  <TableCell>{formatPrice(request.estimated_monthly_cost)}</TableCell>
                  <TableCell>
                    <Chip label={request.status} color={getStatusColor(request.status)} size="small" />
                  </TableCell>
                  <TableCell>{new Date(request.requested_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => navigate(`/rentals/${request.id}`)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && requests.length === 0 && (
        <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
          No rental requests found
        </Typography>
      )}
    </Container>
  );
}
