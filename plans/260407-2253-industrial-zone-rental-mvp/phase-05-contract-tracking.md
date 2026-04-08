---
phase: 5
title: Contract Tracking
duration: Days 19-22
priority: medium
status: complete
progress: 100%
dependencies: [phase-04]
completed_date: 2026-04-08
---

# Phase 5: Contract Tracking

**Goal:** Implement basic contract viewing functionality that auto-generates contracts when rental requests are approved.

**Dependencies:** Phase 4 (contracts created from approved requests)

## Overview

Features:
- Auto-generate Contract when request approved
- Contract list (filtered by role)
- Contract detail view
- Link contracts to zones and requests
- No document generation (out of MVP scope)

---

## Backend Implementation

### Step 1: Create Contract Model

Add to `backend/api/models.py`:

```python
from datetime import date
from dateutil.relativedelta import relativedelta

class Contract(models.Model):
    """Rental contract auto-generated from approved request"""
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('EXPIRED', 'Expired'),
        ('TERMINATED', 'Terminated'),
    ]
    
    rental_request = models.OneToOneField(RentalRequest, on_delete=models.CASCADE, related_name='contract')
    contract_number = models.CharField(max_length=50, unique=True)
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contracts')
    zone = models.ForeignKey(IndustrialZone, on_delete=models.CASCADE, related_name='contracts')
    area = models.DecimalField(max_digits=10, decimal_places=2, help_text="Contracted area in m²")
    monthly_rent = models.DecimalField(max_digits=15, decimal_places=2, help_text="Monthly rent in VND")
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.contract_number} - {self.tenant.username}"
    
    @property
    def duration_months(self):
        return self.rental_request.rental_duration
    
    @property
    def total_value(self):
        return self.monthly_rent * self.duration_months
    
    @property
    def is_active(self):
        return self.status == 'ACTIVE' and self.start_date <= date.today() <= self.end_date
    
    @property
    def days_remaining(self):
        if self.status == 'ACTIVE':
            delta = self.end_date - date.today()
            return max(0, delta.days)
        return 0
    
    @classmethod
    def generate_contract_number(cls):
        """Generate unique contract number"""
        import random
        import string
        from datetime import datetime
        
        year = datetime.now().year
        random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        return f"CNT-{year}-{random_str}"
    
    class Meta:
        db_table = 'contracts'
        verbose_name = 'Contract'
        verbose_name_plural = 'Contracts'
        ordering = ['-created_at']
```

### Step 2: Update RentalRequest Approval to Create Contract

Modify `backend/api/views.py` - update the `approve` action in `RentalRequestViewSet`:

```python
from datetime import date
from dateutil.relativedelta import relativedelta
from .models import Contract

# In RentalRequestViewSet.approve() method, after rental_request.save():

# Create contract
contract_number = Contract.generate_contract_number()
start_date = date.today()
end_date = start_date + relativedelta(months=rental_request.rental_duration)

contract = Contract.objects.create(
    rental_request=rental_request,
    contract_number=contract_number,
    tenant=rental_request.tenant,
    zone=rental_request.zone,
    area=rental_request.requested_area,
    monthly_rent=rental_request.estimated_monthly_cost,
    start_date=start_date,
    end_date=end_date,
    status='ACTIVE'
)

return Response({
    'message': 'Request approved successfully',
    'request': RentalRequestSerializer(rental_request).data,
    'contract': ContractSerializer(contract).data  # Add serializer below
})
```

### Step 3: Create Contract Serializer

Add to `backend/api/serializers.py`:

```python
from .models import Contract

class ContractSerializer(serializers.ModelSerializer):
    tenant_info = UserSerializer(source='tenant', read_only=True)
    zone_info = IndustrialZoneSerializer(source='zone', read_only=True)
    rental_request_id = serializers.IntegerField(source='rental_request.id', read_only=True)
    duration_months = serializers.ReadOnlyField()
    total_value = serializers.ReadOnlyField()
    is_active = serializers.ReadOnlyField()
    days_remaining = serializers.ReadOnlyField()
    
    class Meta:
        model = Contract
        fields = [
            'id', 'contract_number', 'rental_request_id',
            'tenant', 'tenant_info', 'zone', 'zone_info',
            'area', 'monthly_rent', 'start_date', 'end_date',
            'status', 'duration_months', 'total_value',
            'is_active', 'days_remaining', 'created_at'
        ]
        read_only_fields = ['id', 'contract_number', 'created_at']
```

### Step 4: Create Contract ViewSet

Add to `backend/api/views.py`:

```python
class ContractViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Contracts (Read-only)
    - Tenants: View own contracts
    - Admins: View all contracts
    """
    serializer_class = ContractSerializer
    
    def get_queryset(self):
        """Filter based on user role"""
        user = self.request.user
        
        if user.profile.role == 'ADMIN':
            # Admins see all contracts
            return Contract.objects.all()
        else:
            # Tenants see only their own contracts
            return Contract.objects.filter(tenant=user)
    
    @action(detail=False, methods=['get'])
    def my_active(self, request):
        """Get current user's active contracts"""
        contracts = self.get_queryset().filter(status='ACTIVE')
        serializer = self.get_serializer(contracts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active contracts (admin only)"""
        if request.user.profile.role != 'ADMIN':
            return Response({
                'error': 'Admin access required'
            }, status=status.HTTP_403_FORBIDDEN)
        
        contracts = Contract.objects.filter(status='ACTIVE')
        serializer = self.get_serializer(contracts, many=True)
        return Response(serializer.data)
```

### Step 5: Update URLs

Edit `backend/api/urls.py`:

```python
# Add to router
router.register(r'contracts', views.ContractViewSet, basename='contract')
```

### Step 6: Register in Admin

Add to `backend/api/admin.py`:

```python
@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ['contract_number', 'tenant', 'zone', 'area', 'monthly_rent', 
                    'start_date', 'end_date', 'status', 'created_at']
    list_filter = ['status', 'start_date', 'end_date', 'created_at']
    search_fields = ['contract_number', 'tenant__username', 'zone__name']
    readonly_fields = ['contract_number', 'created_at']
```

### Step 7: Install python-dateutil

Add to `backend/requirements.txt`:

```txt
python-dateutil==2.8.2
```

Install:
```bash
pip install python-dateutil
```

### Step 8: Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Frontend Implementation

### Step 1: Create Contract Service

Create `frontend/src/services/contractService.js`:

```javascript
import api from './api';

export const contractService = {
  // Get all contracts (filtered by role on backend)
  getAllContracts: async () => {
    const response = await api.get('/contracts/');
    return response.data;
  },

  // Get single contract
  getContract: async (id) => {
    const response = await api.get(`/contracts/${id}/`);
    return response.data;
  },

  // Get user's active contracts
  getMyActiveContracts: async () => {
    const response = await api.get('/contracts/my_active/');
    return response.data;
  },

  // Get all active contracts (admin only)
  getAllActiveContracts: async () => {
    const response = await api.get('/contracts/active/');
    return response.data;
  }
};
```

### Step 2: Create Contract List Page

Create `frontend/src/pages/ContractListPage.js`:

```javascript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Button, Alert, Tabs, Tab
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { contractService } from '../services/contractService';

export default function ContractListPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadContracts();
  }, [tabValue]);

  const loadContracts = async () => {
    setLoading(true);
    try {
      let data;
      if (tabValue === 0) {
        data = await contractService.getAllContracts();
      } else {
        data = isAdmin() 
          ? await contractService.getAllActiveContracts()
          : await contractService.getMyActiveContracts();
      }
      setContracts(data);
    } catch (err) {
      setError('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'EXPIRED': return 'warning';
      case 'TERMINATED': return 'error';
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
        {isAdmin() ? 'All Contracts' : 'My Contracts'}
      </Typography>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label="All Contracts" />
        <Tab label="Active Only" />
      </Tabs>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Typography>Loading contracts...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Contract #</TableCell>
                {isAdmin() && <TableCell>Tenant</TableCell>}
                <TableCell>Zone</TableCell>
                <TableCell>Area (m²)</TableCell>
                <TableCell>Monthly Rent</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>{contract.contract_number}</TableCell>
                  {isAdmin() && <TableCell>{contract.tenant_info?.username}</TableCell>}
                  <TableCell>{contract.zone_info?.name}</TableCell>
                  <TableCell>{contract.area}</TableCell>
                  <TableCell>{formatPrice(contract.monthly_rent)}</TableCell>
                  <TableCell>{new Date(contract.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(contract.end_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={contract.status} 
                      color={getStatusColor(contract.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => navigate(`/contracts/${contract.id}`)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && contracts.length === 0 && (
        <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
          No contracts found
        </Typography>
      )}
    </Container>
  );
}
```

### Step 3: Create Contract Detail Page

Create `frontend/src/pages/ContractDetailPage.js`:

```javascript
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
```

### Step 4: Update Dashboard to Show Active Contracts

Edit `frontend/src/pages/DashboardPage.js`:

```javascript
import { useEffect, useState } from 'react';
import { contractService } from '../services/contractService';

// Inside component:
const [activeContracts, setActiveContracts] = useState([]);

useEffect(() => {
  loadActiveContracts();
}, []);

const loadActiveContracts = async () => {
  try {
    const data = await contractService.getMyActiveContracts();
    setActiveContracts(data);
  } catch (err) {
    console.error('Failed to load contracts:', err);
  }
};

// Add to render:
<Box sx={{ mt: 4 }}>
  <Typography variant="h6" gutterBottom>
    Active Contracts: {activeContracts.length}
  </Typography>
  {activeContracts.length > 0 && (
    <Button variant="outlined" onClick={() => navigate('/contracts')}>
      View All Contracts
    </Button>
  )}
</Box>
```

### Step 5: Update Routes in App.js

Add routes:

```javascript
import ContractListPage from './pages/ContractListPage';
import ContractDetailPage from './pages/ContractDetailPage';

// In <Routes>:
<Route
  path="/contracts"
  element={
    <PrivateRoute>
      <ContractListPage />
    </PrivateRoute>
  }
/>
<Route
  path="/contracts/:id"
  element={
    <PrivateRoute>
      <ContractDetailPage />
    </PrivateRoute>
  }
/>
```

---

## Testing Checklist

### Backend Tests ✅
- [ ] Contract model created successfully
- [ ] Contract auto-generated on request approval
- [ ] Unique contract numbers generated
- [ ] Date calculations correct (start + duration = end)
- [ ] Tenants see only their contracts
- [ ] Admins see all contracts
- [ ] Contract linked to rental request

### Frontend Tests ✅
- [ ] Contract list displays correctly
- [ ] Tabs switch between all/active
- [ ] Contract detail shows full info
- [ ] Progress bar displays correctly for active contracts
- [ ] Link to original request works
- [ ] Dashboard shows active contract count

---

## Success Criteria

Phase 5 complete when:

1. ✅ Contracts auto-generated on approval
2. ✅ Contract list filtered by role
3. ✅ Contract detail view complete
4. ✅ Contract linked to original request
5. ✅ Date and cost calculations accurate
6. ✅ Active/expired status tracking works
7. ✅ Dashboard integration complete

---

## Next Phase

**Proceed to:** [Phase 6: Polish & Testing](./phase-06-polish-and-testing.md)  
**Start:** Day 23
