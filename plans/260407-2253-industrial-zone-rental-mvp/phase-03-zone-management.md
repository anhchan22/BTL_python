---
phase: 3
title: Industrial Zone Management
duration: Days 8-12
priority: high
status: completed
dependencies: [phase-02]
---

# Phase 3: Industrial Zone Management

**Goal:** Implement complete CRUD operations for industrial zones with search/filter capabilities and role-based permissions (Admin can create/edit/delete, Tenants can view).

**Dependencies:** Phase 2 must be complete (authentication working)

## Overview

Features:
- IndustrialZone model with area, pricing, availability
- Admin-only create/edit/delete operations
- Public zone listing with search and filters
- Zone detail view
- Integration with Django admin panel

---

## Backend Implementation

### Step 1: Create IndustrialZone Model

Edit `backend/api/models.py` (add to existing file):

```python
class IndustrialZone(models.Model):
    """Industrial zone available for rental"""
    
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=500)
    total_area = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total area in m²")
    available_area = models.DecimalField(max_digits=10, decimal_places=2, help_text="Available area in m²")
    price_per_sqm = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price per m² per month (VND)")
    description = models.TextField()
    amenities = models.TextField(blank=True, help_text="Comma-separated amenities")
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.location}"
    
    @property
    def is_fully_rented(self):
        return self.available_area <= 0
    
    class Meta:
        db_table = 'industrial_zones'
        verbose_name = 'Industrial Zone'
        verbose_name_plural = 'Industrial Zones'
        ordering = ['-created_at']
```

### Step 2: Create Zone Serializer

Add to `backend/api/serializers.py`:

```python
from .models import IndustrialZone

class IndustrialZoneSerializer(serializers.ModelSerializer):
    is_fully_rented = serializers.ReadOnlyField()
    
    class Meta:
        model = IndustrialZone
        fields = [
            'id', 'name', 'location', 'total_area', 'available_area',
            'price_per_sqm', 'description', 'amenities', 'is_available',
            'is_fully_rented', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, data):
        # Validate available_area <= total_area
        available = data.get('available_area')
        total = data.get('total_area')
        
        if available and total and available > total:
            raise serializers.ValidationError({
                'available_area': 'Available area cannot exceed total area'
            })
        
        return data
```

### Step 3: Create Zone ViewSet

Add to `backend/api/views.py`:

```python
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import IndustrialZone
from .serializers import IndustrialZoneSerializer
from .permissions import IsAdmin

class IndustrialZoneViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Industrial Zones
    - List/Detail: Any authenticated user
    - Create/Update/Delete: Admin only
    """
    queryset = IndustrialZone.objects.all()
    serializer_class = IndustrialZoneSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'location', 'description', 'amenities']
    ordering_fields = ['name', 'price_per_sqm', 'available_area', 'created_at']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """Admin required for create/update/delete"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return super().get_permissions()
    
    def get_queryset(self):
        """Filter zones based on query params"""
        queryset = super().get_queryset()
        
        # Filter by availability
        available_only = self.request.query_params.get('available', None)
        if available_only == 'true':
            queryset = queryset.filter(is_available=True, available_area__gt=0)
        
        # Filter by min/max price
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        
        if min_price:
            queryset = queryset.filter(price_per_sqm__gte=min_price)
        if max_price:
            queryset = queryset.filter(price_per_sqm__lte=max_price)
        
        # Filter by min area
        min_area = self.request.query_params.get('min_area', None)
        if min_area:
            queryset = queryset.filter(available_area__gte=min_area)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get only available zones"""
        zones = self.get_queryset().filter(is_available=True, available_area__gt=0)
        serializer = self.get_serializer(zones, many=True)
        return Response(serializer.data)
```

### Step 4: Update URL Configuration

Edit `backend/api/urls.py`:

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'zones', views.IndustrialZoneViewSet, basename='zone')

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Test endpoint
    path('hello/', views.hello_world, name='hello-world'),
    
    # Authentication endpoints
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('auth/me/', views.get_current_user, name='current-user'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
```

### Step 5: Register in Admin

Add to `backend/api/admin.py`:

```python
@admin.register(IndustrialZone)
class IndustrialZoneAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'total_area', 'available_area', 
                    'price_per_sqm', 'is_available', 'created_at']
    list_filter = ['is_available', 'created_at']
    search_fields = ['name', 'location', 'description']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'location', 'description')
        }),
        ('Area & Pricing', {
            'fields': ('total_area', 'available_area', 'price_per_sqm')
        }),
        ('Additional Info', {
            'fields': ('amenities', 'is_available')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
```

### Step 6: Run Migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Step 7: Create Sample Data (Optional but Recommended)

Create `backend/api/management/commands/seed_zones.py`:

```python
from django.core.management.base import BaseCommand
from api.models import IndustrialZone

class Command(BaseCommand):
    help = 'Seed database with sample industrial zones'

    def handle(self, *args, **kwargs):
        zones = [
            {
                'name': 'Khu Công Nghiệp Tân Bình',
                'location': 'Quận Tân Bình, TP.HCM',
                'total_area': 50000.00,
                'available_area': 35000.00,
                'price_per_sqm': 150000,
                'description': 'Khu công nghiệp hiện đại với đầy đủ tiện ích',
                'amenities': 'Điện 3 pha, Nước công nghiệp, Đường rộng 20m, An ninh 24/7',
                'is_available': True
            },
            {
                'name': 'Khu Công Nghiệp Bình Dương',
                'location': 'Thủ Dầu Một, Bình Dương',
                'total_area': 100000.00,
                'available_area': 80000.00,
                'price_per_sqm': 120000,
                'description': 'Khu công nghiệp quy mô lớn, gần cảng biển',
                'amenities': 'Điện, Nước, Đường 30m, Hệ thống xử lý nước thải',
                'is_available': True
            },
            {
                'name': 'Khu Công Nghiệp Đồng Nai',
                'location': 'Biên Hòa, Đồng Nai',
                'total_area': 75000.00,
                'available_area': 60000.00,
                'price_per_sqm': 100000,
                'description': 'Vị trí đắc địa, gần sân bay Tân Sơn Nhất',
                'amenities': 'Hạ tầng hoàn chỉnh, Gần cao tốc, Bảo vệ chuyên nghiệp',
                'is_available': True
            },
        ]

        for zone_data in zones:
            zone, created = IndustrialZone.objects.get_or_create(
                name=zone_data['name'],
                defaults=zone_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created zone: {zone.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Zone already exists: {zone.name}'))
```

Run seeding:
```bash
python manage.py seed_zones
```

---

## Frontend Implementation

### Step 1: Create Zone Service

Create `frontend/src/services/zoneService.js`:

```javascript
import api from './api';

export const zoneService = {
  // Get all zones with optional filters
  getAllZones: async (params = {}) => {
    const response = await api.get('/zones/', { params });
    return response.data;
  },

  // Get only available zones
  getAvailableZones: async () => {
    const response = await api.get('/zones/available/');
    return response.data;
  },

  // Get single zone details
  getZone: async (id) => {
    const response = await api.get(`/zones/${id}/`);
    return response.data;
  },

  // Create zone (admin only)
  createZone: async (zoneData) => {
    const response = await api.post('/zones/', zoneData);
    return response.data;
  },

  // Update zone (admin only)
  updateZone: async (id, zoneData) => {
    const response = await api.put(`/zones/${id}/`, zoneData);
    return response.data;
  },

  // Delete zone (admin only)
  deleteZone: async (id) => {
    await api.delete(`/zones/${id}/`);
  }
};
```

### Step 2: Create Zone List Page

Create `frontend/src/pages/ZoneListPage.js`:

```javascript
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
      setZones(data);
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
```

### Step 3: Create Zone Detail Page

Create `frontend/src/pages/ZoneDetailPage.js`:

```javascript
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
```

### Step 4: Create Zone Form Page (Admin)

Create `frontend/src/pages/ZoneFormPage.js`:

```javascript
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
```

### Step 5: Update App.js with New Routes

Edit `frontend/src/App.js` (add routes):

```javascript
import ZoneListPage from './pages/ZoneListPage';
import ZoneDetailPage from './pages/ZoneDetailPage';
import ZoneFormPage from './pages/ZoneFormPage';

// Inside <Routes>:
<Route
  path="/zones"
  element={
    <PrivateRoute>
      <ZoneListPage />
    </PrivateRoute>
  }
/>
<Route
  path="/zones/create"
  element={
    <PrivateRoute requireAdmin>
      <ZoneFormPage />
    </PrivateRoute>
  }
/>
<Route
  path="/zones/:id"
  element={
    <PrivateRoute>
      <ZoneDetailPage />
    </PrivateRoute>
  }
/>
<Route
  path="/zones/:id/edit"
  element={
    <PrivateRoute requireAdmin>
      <ZoneFormPage />
    </PrivateRoute>
  }
/>
```

---

## Testing Checklist

### Backend Tests ✅
- [ ] Migrations run successfully
- [ ] Can create zones via Django admin
- [ ] API endpoint `/api/zones/` returns zone list
- [ ] Can filter zones with query params
- [ ] `/api/zones/available/` returns only available zones
- [ ] Admin can create/update/delete zones
- [ ] Tenant cannot create/update/delete (403 error)

### Frontend Tests ✅
- [ ] Zone list page displays all zones
- [ ] Search filter works
- [ ] Zone cards show correct information
- [ ] Click zone card → Navigate to detail page
- [ ] Detail page shows full zone info
- [ ] Admin sees "Add Zone" and "Edit" buttons
- [ ] Tenant doesn't see admin buttons
- [ ] Admin can create new zone via form
- [ ] Admin can edit existing zone
- [ ] Admin can delete zone (with confirmation)

---

## Success Criteria

Phase 3 complete when:

1. ✅ IndustrialZone model working with migrations
2. ✅ CRUD operations functional in Django admin
3. ✅ API endpoints return zone data correctly
4. ✅ Search and filtering work
5. ✅ Frontend displays zone list
6. ✅ Zone detail page shows full info
7. ✅ Admin can create/edit/delete zones
8. ✅ Tenants can only view zones (no edit access)
9. ✅ Role-based permissions enforced

---

## Next Phase

**Proceed to:** [Phase 4: Rental Request System](./phase-04-rental-request-system.md)  
**Start:** Day 13
