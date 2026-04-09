import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { contractService } from '../services/contractService';
import StatusBadge from '../components/StatusBadge';
import TablePagination from '../components/TablePagination';

export default function ContractListPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadContracts();
    setCurrentPage(1); // Reset to page 1 when tab changes
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
      const contractList = Array.isArray(data) ? data : (data.results || []);
      setContracts(contractList);
    } catch (err) {
      console.error('Failed to load contracts:', err);
      setError('Failed to load contracts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(contracts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedContracts = contracts.slice(startIndex, endIndex);

  // Ensure current page is valid
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  // ===== STYLE DEFINITIONS =====

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: 'var(--color-background)',
    padding: 'clamp(1rem, 2vw, 2rem)'
  };

  const maxWidthWrapperStyle = {
    maxWidth: '90rem',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  };

  const titleStyle = {
    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
    fontWeight: '700',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    color: 'var(--color-foreground)'
  };

  const tabsContainerStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    borderBottom: '2px solid var(--color-muted)',
    borderBottomOpacity: '0.2'
  };

  const tabButtonStyle = (isActive) => ({
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: isActive ? 'var(--color-accent)' : 'var(--color-muted)',
    fontWeight: isActive ? '600' : '500',
    fontSize: '0.9rem',
    cursor: 'pointer',
    borderBottom: isActive ? '3px solid var(--color-accent)' : 'none',
    transition: 'all 300ms ease-out',
    marginBottom: '-2px',
    fontFamily: '"DM Sans", sans-serif'
  });

  const errorBoxStyle = {
    backgroundColor: '#FEE2E2',
    borderLeft: '4px solid #EF4444',
    padding: 'clamp(1rem, 2vw, 1.5rem)',
    marginBottom: '2rem',
    borderRadius: 'var(--radius-base)'
  };

  const errorTextStyle = {
    color: '#7F1D1D',
    fontSize: '0.875rem',
    fontWeight: '500'
  };

  const retryButtonStyle = {
    backgroundColor: 'transparent',
    color: '#DC2626',
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
    transition: 'color 300ms ease-out',
    marginTop: '0.5rem'
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1rem',
    color: 'var(--color-muted)'
  };

  const tableWrapperStyle = {
    overflow: 'auto',
    borderRadius: 'var(--radius-base)',
    boxShadow: 'var(--shadow-extruded)',
    backgroundColor: 'var(--color-background)'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem'
  };

  const headerCellStyle = {
    padding: '1rem',
    textAlign: 'left',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-foreground)',
    fontWeight: '600',
    borderBottom: '2px solid var(--color-muted)',
    borderBottomOpacity: '0.2'
  };

  const bodyCellStyle = {
    padding: '1rem',
    borderBottom: '1px solid var(--color-muted)',
    borderBottomOpacity: '0.1',
    color: 'var(--color-foreground)'
  };

  const rowHoverStyle = {
    transition: 'background-color 300ms ease-out'
  };

  const actionButtonStyle = {
    padding: '0.4rem 0.8rem',
    borderRadius: 'var(--radius-inner)',
    border: 'none',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 300ms ease-out',
    boxShadow: 'var(--shadow-extruded-small)'
  };

  const noResultsStyle = {
    textAlign: 'center',
    padding: '3rem',
    color: 'var(--color-muted)',
    fontSize: '1rem'
  };

  // ===== HANDLERS =====

  const handleViewDetails = (contractId) => {
    navigate(`/contracts/${contractId}`);
  };

  const handleRetry = () => {
    setError('');
    loadContracts();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  return (
    <div style={containerStyle}>
      <div style={maxWidthWrapperStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            {isAdmin() ? 'All Contracts' : 'My Contracts'}
          </h1>
        </div>

        {/* Tabs */}
        <div style={tabsContainerStyle}>
          <button
            style={tabButtonStyle(tabValue === 0)}
            onClick={() => setTabValue(0)}
            onMouseEnter={(e) => {
              if (tabValue !== 0) {
                e.target.style.color = 'var(--color-foreground)';
              }
            }}
            onMouseLeave={(e) => {
              if (tabValue !== 0) {
                e.target.style.color = 'var(--color-muted)';
              }
            }}
          >
            All Contracts
          </button>
          <button
            style={tabButtonStyle(tabValue === 1)}
            onClick={() => setTabValue(1)}
            onMouseEnter={(e) => {
              if (tabValue !== 1) {
                e.target.style.color = 'var(--color-foreground)';
              }
            }}
            onMouseLeave={(e) => {
              if (tabValue !== 1) {
                e.target.style.color = 'var(--color-muted)';
              }
            }}
          >
            Active Only
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div style={errorBoxStyle}>
            <p style={errorTextStyle}>{error}</p>
            <button style={retryButtonStyle} onClick={handleRetry}>
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && <div style={loadingStyle}>Loading contracts...</div>}

        {/* Table */}
        {!loading && (
          <>
            {contracts.length > 0 ? (
              <>
                <div style={tableWrapperStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr style={rowHoverStyle}>
                        <th style={headerCellStyle}>Contract #</th>
                        {isAdmin() && <th style={headerCellStyle}>Tenant</th>}
                        <th style={headerCellStyle}>Zone</th>
                        <th style={headerCellStyle}>Area (m²)</th>
                        <th style={headerCellStyle}>Monthly Rent</th>
                        <th style={headerCellStyle}>Start Date</th>
                        <th style={headerCellStyle}>End Date</th>
                        <th style={headerCellStyle}>Status</th>
                        <th style={headerCellStyle}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedContracts.map((contract) => (
                        <tr
                          key={contract.id}
                          style={rowHoverStyle}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <td style={bodyCellStyle}>{contract.contract_number || contract.id}</td>
                          {isAdmin() && (
                            <td style={bodyCellStyle}>{contract.tenant_info?.username || 'N/A'}</td>
                          )}
                          <td style={bodyCellStyle}>{contract.zone_info?.name || 'N/A'}</td>
                          <td style={bodyCellStyle}>{contract.area?.toLocaleString() || 0}</td>
                          <td style={bodyCellStyle}>{formatPrice(contract.monthly_rent)}</td>
                          <td style={bodyCellStyle}>
                            {contract.start_date
                              ? new Date(contract.start_date).toLocaleDateString()
                              : 'N/A'}
                          </td>
                          <td style={bodyCellStyle}>
                            {contract.end_date
                              ? new Date(contract.end_date).toLocaleDateString()
                              : 'N/A'}
                          </td>
                          <td style={bodyCellStyle}>
                            <StatusBadge status={contract.status} type="contract" />
                          </td>
                          <td style={bodyCellStyle}>
                            <button
                              style={actionButtonStyle}
                              onClick={() => handleViewDetails(contract.id)}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'var(--color-accent-light)';
                                e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
                                e.target.style.transform = 'translateY(-2px)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'var(--color-accent)';
                                e.target.style.boxShadow = 'var(--shadow-extruded-small)';
                                e.target.style.transform = 'translateY(0)';
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div style={noResultsStyle}>
                No contracts found
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
