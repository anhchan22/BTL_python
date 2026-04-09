import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { rentalService } from '../services/rentalService';
import StatusBadge from '../components/StatusBadge';
import TablePagination from '../components/TablePagination';

export default function RentalRequestListPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await rentalService.getAllRequests();
      const requestList = Array.isArray(data) ? data : (data.results || []);
      setRequests(requestList);
    } catch (err) {
      console.error('Failed to load requests:', err);
      setError('Failed to load rental requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRequests = requests.slice(startIndex, endIndex);

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

  const handleViewDetails = (requestId) => {
    navigate(`/rentals/${requestId}`);
  };

  const handleRetry = () => {
    setError('');
    loadRequests();
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
            {isAdmin() ? 'All Rental Requests' : 'My Rental Requests'}
          </h1>
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
        {loading && <div style={loadingStyle}>Loading rental requests...</div>}

        {/* Table */}
        {!loading && (
          <>
            {requests.length > 0 ? (
              <>
                <div style={tableWrapperStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr style={rowHoverStyle}>
                        <th style={headerCellStyle}>ID</th>
                        {isAdmin() && <th style={headerCellStyle}>Tenant</th>}
                        <th style={headerCellStyle}>Zone</th>
                        <th style={headerCellStyle}>Area (m²)</th>
                        <th style={headerCellStyle}>Duration</th>
                        <th style={headerCellStyle}>Est. Cost/Month</th>
                        <th style={headerCellStyle}>Status</th>
                        <th style={headerCellStyle}>Requested</th>
                        <th style={headerCellStyle}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRequests.map((request) => (
                        <tr
                          key={request.id}
                          style={rowHoverStyle}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <td style={bodyCellStyle}>{request.id}</td>
                          {isAdmin() && (
                            <td style={bodyCellStyle}>{request.tenant_info?.username || 'N/A'}</td>
                          )}
                          <td style={bodyCellStyle}>{request.zone_info?.name || 'N/A'}</td>
                          <td style={bodyCellStyle}>{request.requested_area?.toLocaleString() || 0}</td>
                          <td style={bodyCellStyle}>{request.rental_duration || 0} months</td>
                          <td style={bodyCellStyle}>{formatPrice(request.estimated_monthly_cost)}</td>
                          <td style={bodyCellStyle}>
                            <StatusBadge status={request.status} type="rental" />
                          </td>
                          <td style={bodyCellStyle}>
                            {request.requested_at
                              ? new Date(request.requested_at).toLocaleDateString()
                              : 'N/A'}
                          </td>
                          <td style={bodyCellStyle}>
                            <button
                              style={actionButtonStyle}
                              onClick={() => handleViewDetails(request.id)}
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
                No rental requests found
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
