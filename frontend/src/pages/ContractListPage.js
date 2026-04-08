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
      // Handle both paginated and non-paginated responses
      const contractList = Array.isArray(data) ? data : (data.results || []);
      setContracts(contractList);
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
