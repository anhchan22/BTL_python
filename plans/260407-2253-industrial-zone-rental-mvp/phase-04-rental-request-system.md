---
phase: 4
title: Rental Request System
duration: Days 13-18
priority: high
status: completed
dependencies: [phase-03]
---

# Phase 4: Rental Request System

**Goal:** Implement rental request workflow where tenants can submit requests and admins can approve/reject them.

**Dependencies:** Phase 3 (zones must exist for rental requests)

## Overview

Features:
- Tenants create rental requests for zones
- Admins view all requests, tenants see only their own
- Admin approve/reject workflow
- Request status tracking (PENDING, APPROVED, REJECTED, CANCELLED)
- Auto-update zone available area on approval

---

## Backend Implementation

### Step 1: Create RentalRequest Model

Add to `backend/api/models.py`:

```python
class RentalRequest(models.Model):
    """Rental request submitted by tenant"""
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rental_requests')
    zone = models.ForeignKey(IndustrialZone, on_delete=models.CASCADE, related_name='rental_requests')
    requested_area = models.DecimalField(max_digits=10, decimal_places=2, help_text="Requested area in m²")
    rental_duration = models.IntegerField(help_text="Rental duration in months")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    admin_note = models.TextField(blank=True, help_text="Admin's review note")
    requested_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_requests')
    
    def __str__(self):
        return f"{self.tenant.username} - {self.zone.name} ({self.status})"
    
    @property
    def estimated_monthly_cost(self):
        return self.requested_area * self.zone.price_per_sqm
    
    @property
    def total_cost(self):
        return self.estimated_monthly_cost * self.rental_duration
    
    class Meta:
        db_table = 'rental_requests'
        verbose_name = 'Rental Request'
        verbose_name_plural = 'Rental Requests'
        ordering = ['-requested_at']
```

### Step 2: Create Serializer

Add to `backend/api/serializers.py`:

```python
class RentalRequestSerializer(serializers.ModelSerializer):
    tenant_info = UserSerializer(source='tenant', read_only=True)
    zone_info = IndustrialZoneSerializer(source='zone', read_only=True)
    estimated_monthly_cost = serializers.ReadOnlyField()
    total_cost = serializers.ReadOnlyField()
    
    class Meta:
        model = RentalRequest
        fields = [
            'id', 'tenant', 'tenant_info', 'zone', 'zone_info',
            'requested_area', 'rental_duration', 'status', 'admin_note',
            'estimated_monthly_cost', 'total_cost',
            'requested_at', 'reviewed_at', 'reviewed_by'
        ]
        read_only_fields = ['id', 'tenant', 'status', 'admin_note', 'requested_at', 'reviewed_at', 'reviewed_by']
    
    def validate(self, data):
        zone = data.get('zone')
        requested_area = data.get('requested_area')
        
        # Check if zone has enough available area
        if zone and requested_area:
            if requested_area > zone.available_area:
                raise serializers.ValidationError({
                    'requested_area': f'Requested area exceeds available area ({zone.available_area} m²)'
                })
            
            if requested_area <= 0:
                raise serializers.ValidationError({
                    'requested_area': 'Requested area must be greater than 0'
                })
        
        # Check rental duration
        rental_duration = data.get('rental_duration')
        if rental_duration and rental_duration < 1:
            raise serializers.ValidationError({
                'rental_duration': 'Rental duration must be at least 1 month'
            })
        
        return data

class RentalRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating rental requests"""
    
    class Meta:
        model = RentalRequest
        fields = ['zone', 'requested_area', 'rental_duration']
    
    def validate(self, data):
        zone = data.get('zone')
        requested_area = data.get('requested_area')
        
        if not zone.is_available:
            raise serializers.ValidationError({'zone': 'This zone is not available for rent'})
        
        if requested_area > zone.available_area:
            raise serializers.ValidationError({
                'requested_area': f'Only {zone.available_area} m² available'
            })
        
        if requested_area <= 0:
            raise serializers.ValidationError({
                'requested_area': 'Must be greater than 0'
            })
        
        return data
```

### Step 3: Create ViewSet

Add to `backend/api/views.py`:

```python
from django.utils import timezone
from .models import RentalRequest
from .serializers import RentalRequestSerializer, RentalRequestCreateSerializer

class RentalRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Rental Requests
    - Tenants: Create and view own requests
    - Admins: View all, approve/reject
    """
    serializer_class = RentalRequestSerializer
    
    def get_queryset(self):
        """Filter based on user role"""
        user = self.request.user
        
        if user.profile.role == 'ADMIN':
            # Admins see all requests
            return RentalRequest.objects.all()
        else:
            # Tenants see only their own requests
            return RentalRequest.objects.filter(tenant=user)
    
    def get_serializer_class(self):
        """Use different serializer for create"""
        if self.action == 'create':
            return RentalRequestCreateSerializer
        return RentalRequestSerializer
    
    def perform_create(self, serializer):
        """Set tenant to current user"""
        serializer.save(tenant=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def approve(self, request, pk=None):
        """Approve rental request (admin only)"""
        rental_request = self.get_object()
        
        if rental_request.status != 'PENDING':
            return Response({
                'error': 'Only pending requests can be approved'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if zone still has enough area
        if rental_request.requested_area > rental_request.zone.available_area:
            return Response({
                'error': 'Zone no longer has enough available area'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update request status
        rental_request.status = 'APPROVED'
        rental_request.reviewed_by = request.user
        rental_request.reviewed_at = timezone.now()
        rental_request.admin_note = request.data.get('admin_note', '')
        rental_request.save()
        
        # Update zone available area
        zone = rental_request.zone
        zone.available_area -= rental_request.requested_area
        zone.save()
        
        return Response({
            'message': 'Request approved successfully',
            'request': RentalRequestSerializer(rental_request).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def reject(self, request, pk=None):
        """Reject rental request (admin only)"""
        rental_request = self.get_object()
        
        if rental_request.status != 'PENDING':
            return Response({
                'error': 'Only pending requests can be rejected'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        rental_request.status = 'REJECTED'
        rental_request.reviewed_by = request.user
        rental_request.reviewed_at = timezone.now()
        rental_request.admin_note = request.data.get('admin_note', 'Request rejected')
        rental_request.save()
        
        return Response({
            'message': 'Request rejected',
            'request': RentalRequestSerializer(rental_request).data
        })
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel own request (tenant only, if pending)"""
        rental_request = self.get_object()
        
        # Check ownership
        if rental_request.tenant != request.user:
            return Response({
                'error': 'You can only cancel your own requests'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if rental_request.status != 'PENDING':
            return Response({
                'error': 'Only pending requests can be cancelled'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        rental_request.status = 'CANCELLED'
        rental_request.save()
        
        return Response({
            'message': 'Request cancelled',
            'request': RentalRequestSerializer(rental_request).data
        })
```

### Step 4: Update URLs

Edit `backend/api/urls.py`:

```python
# Add to router
router.register(r'rentals', views.RentalRequestViewSet, basename='rental')
```

### Step 5: Register in Admin

Add to `backend/api/admin.py`:

```python
@admin.register(RentalRequest)
class RentalRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'tenant', 'zone', 'requested_area', 'rental_duration', 
                    'status', 'requested_at', 'reviewed_by']
    list_filter = ['status', 'requested_at', 'reviewed_at']
    search_fields = ['tenant__username', 'zone__name']
    readonly_fields = ['requested_at', 'reviewed_at']
```

### Step 6: Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Frontend Implementation

### Step 1: Create Rental Service

Create `frontend/src/services/rentalService.js`:

```javascript
import api from './api';

export const rentalService = {
  // Get all rental requests (filtered by role on backend)
  getAllRequests: async () => {
    const response = await api.get('/rentals/');
    return response.data;
  },

  // Get single request
  getRequest: async (id) => {
    const response = await api.get(`/rentals/${id}/`);
    return response.data;
  },

  // Create rental request
  createRequest: async (requestData) => {
    const response = await api.post('/rentals/', requestData);
    return response.data;
  },

  // Approve request (admin only)
  approveRequest: async (id, adminNote = '') => {
    const response = await api.post(`/rentals/${id}/approve/`, { admin_note: adminNote });
    return response.data;
  },

  // Reject request (admin only)
  rejectRequest: async (id, adminNote = '') => {
    const response = await api.post(`/rentals/${id}/reject/`, { admin_note: adminNote });
    return response.data;
  },

  // Cancel request (tenant)
  cancelRequest: async (id) => {
    const response = await api.post(`/rentals/${id}/cancel/`);
    return response.data;
  }
};
```

### Step 2: Create Rental Request Form Page

Create `frontend/src/pages/RentalRequestFormPage.js`:

```javascript
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
```

### Step 3: Create Rental Request List Page

Create `frontend/src/pages/RentalRequestListPage.js`:

```javascript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Table, TableBody, TableCell, TableContainer,
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
      setRequests(data);
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
```

### Step 4: Create Rental Request Detail Page

Create `frontend/src/pages/RentalRequestDetailPage.js`:

```javascript
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
```

### Step 5: Update Routes in App.js

Add routes:

```javascript
import RentalRequestFormPage from './pages/RentalRequestFormPage';
import RentalRequestListPage from './pages/RentalRequestListPage';
import RentalRequestDetailPage from './pages/RentalRequestDetailPage';

// In <Routes>:
<Route
  path="/zones/:zoneId/request"
  element={
    <PrivateRoute>
      <RentalRequestFormPage />
    </PrivateRoute>
  }
/>
<Route
  path="/rentals"
  element={
    <PrivateRoute>
      <RentalRequestListPage />
    </PrivateRoute>
  }
/>
<Route
  path="/rentals/:id"
  element={
    <PrivateRoute>
      <RentalRequestDetailPage />
    </PrivateRoute>
  }
/>
```

---

## Testing Checklist

### Backend Tests ✅
- [ ] RentalRequest model created
- [ ] Tenants can create requests
- [ ] Tenants see only their requests
- [ ] Admins see all requests
- [ ] Approve updates zone available area
- [ ] Reject doesn't change zone area
- [ ] Can't approve if not enough area
- [ ] Tenants can cancel pending requests

### Frontend Tests ✅
- [ ] Request form calculates costs correctly
- [ ] Form validates requested area <= available
- [ ] Tenant sees "Request to Rent" button
- [ ] Request list shows correct data
- [ ] Admin sees approve/reject buttons
- [ ] Tenant sees cancel button (if pending)
- [ ] Status colors correct
- [ ] Approval/rejection workflow works

---

## Success Criteria

Phase 4 complete when:

1. ✅ Tenants can submit rental requests
2. ✅ Cost calculations accurate
3. ✅ Admins view all requests, tenants see own
4. ✅ Admin approve/reject workflow functional
5. ✅ Zone area updates on approval
6. ✅ Tenants can cancel pending requests
7. ✅ Status tracking works correctly

---

## Next Phase

**Proceed to:** [Phase 5: Contract Tracking](./phase-05-contract-tracking.md)  
**Start:** Day 19
