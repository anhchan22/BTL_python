import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button, Paper, Chip, Grid, Alert,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../contexts/AuthContext';
import { rentalService } from '../services/rentalService';

export default function RentalRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    loadRequest();
  }, [id]);

  const loadRequest = async () => {
    try {
      const data = await rentalService.getRequest(id);
      setRequest(data);
    } catch (err) {
      setError('Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    try {
      if (action === 'approve') {
        await rentalService.approveRequest(id, adminNote);
      } else if (action === 'reject') {
        await rentalService.rejectRequest(id, adminNote);
      } else if (action === 'cancel') {
        await rentalService.cancelRequest(id);
      }
      setDialogOpen(false);
      loadRequest();
    } catch (err) {
      setError(`Failed to ${action} request`);
    }
  };

  const openDialog = (type) => {
    setDialogType(type);
    setAdminNote('');
    setDialogOpen(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!request) return <Typography>Request not found</Typography>;

  const canApprove = isAdmin() && request.status === 'PENDING';
  const canCancel = !isAdmin() && request.tenant === user?.id && request.status === 'PENDING';

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/rentals')} sx={{ mb: 2 }}>
        Back to Requests
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={3}>
          <Typography variant="h4">Rental Request #{request.id}</Typography>
          <Chip
            label={request.status}
            color={
              request.status === 'APPROVED' ? 'success' :
              request.status === 'REJECTED' ? 'error' :
              request.status === 'CANCELLED' ? 'default' : 'warning'
            }
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Zone</Typography>
            <Typography variant="h6">{request.zone_info?.name}</Typography>
            <Typography variant="body2">{request.zone_info?.location}</Typography>
          </Grid>

          {isAdmin() && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Tenant</Typography>
              <Typography variant="body1">{request.tenant_info?.username}</Typography>
              <Typography variant="body2">{request.tenant_info?.email}</Typography>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Requested Area</Typography>
            <Typography variant="h6">{request.requested_area} m²</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Rental Duration</Typography>
            <Typography variant="h6">{request.rental_duration} months</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Monthly Cost</Typography>
            <Typography variant="h6">{formatPrice(request.estimated_monthly_cost)}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Total Cost</Typography>
            <Typography variant="h6">{formatPrice(request.total_cost)}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Requested Date</Typography>
            <Typography variant="body1">
              {new Date(request.requested_at).toLocaleString()}
            </Typography>
          </Grid>

          {request.reviewed_at && (
            <>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Reviewed Date</Typography>
                <Typography variant="body1">
                  {new Date(request.reviewed_at).toLocaleString()}
                </Typography>
              </Grid>
              {request.admin_note && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Admin Note</Typography>
                  <Typography variant="body1">{request.admin_note}</Typography>
                </Grid>
              )}
            </>
          )}
        </Grid>

        {canApprove && (
          <Box mt={4} display="flex" gap={2}>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => openDialog('approve')}
              fullWidth
            >
              Approve Request
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => openDialog('reject')}
              fullWidth
            >
              Reject Request
            </Button>
          </Box>
        )}

        {canCancel && (
          <Box mt={4}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => openDialog('cancel')}
              fullWidth
            >
              Cancel Request
            </Button>
          </Box>
        )}
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'approve' ? 'Approve Request' :
           dialogType === 'reject' ? 'Reject Request' :
           'Cancel Request'}
        </DialogTitle>
        <DialogContent>
          {dialogType !== 'cancel' && (
            <TextField
              fullWidth
              label="Note (optional)"
              multiline
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              margin="normal"
            />
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {dialogType === 'approve' ? 'This will reduce the zone\'s available area.' :
             dialogType === 'reject' ? 'The tenant will be notified of rejection.' :
             'You can create a new request later.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleAction(dialogType)}
            variant="contained"
            color={dialogType === 'approve' ? 'success' : 'error'}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
