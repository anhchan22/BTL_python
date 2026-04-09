import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { zoneService } from '../services/zoneService';
import ZoneCard from '../components/ZoneCard';
import ZoneSearchBar from '../components/ZoneSearchBar';

export default function ZoneListPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6; // 6 cards per page = 2 rows of 3 on desktop

  useEffect(() => {
    loadZones();
  }, []);

  // Reset to page 1 when filters/search/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, filterAvailable]);

  const loadZones = async () => {
    try {
      const data = await zoneService.getAllZones();
      // Handle both paginated and non-paginated responses
      const zoneList = Array.isArray(data) ? data : (data.results || []);
      setZones(zoneList);
    } catch (err) {
      console.error('Failed to load zones:', err);
      setError('Failed to load zones. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter zones based on search term and availability filter
  const filteredZones = zones.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = !filterAvailable || (zone.is_available && zone.available_area > 0);
    return matchesSearch && matchesAvailability;
  });

  // Sort zones
  const sortedZones = [...filteredZones].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price_per_sqm - b.price_per_sqm;
      case 'area':
        return b.total_area - a.total_area;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedZones.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedZones = sortedZones.slice(startIndex, endIndex);

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
    maxWidth: '80rem',
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
    fontWeight: '500',
    marginBottom: '0.5rem'
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
    transition: 'color 300ms ease-out'
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1rem',
    color: 'var(--color-muted)'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 'clamp(1.5rem, 3vw, 2rem)',
    marginBottom: '2rem'
  };

  const noResultsStyle = {
    textAlign: 'center',
    padding: '3rem',
    color: 'var(--color-muted)',
    fontSize: '1rem'
  };

  const paginationContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '2rem 0'
  };

  const paginationButtonStyle = (isDisabled, isActive) => ({
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-base)',
    border: 'none',
    backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-background)',
    color: isActive ? 'white' : 'var(--color-foreground)',
    fontWeight: isActive ? '600' : '500',
    fontSize: '0.875rem',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    boxShadow: isActive ? 'var(--shadow-extruded)' : 'var(--shadow-inset)',
    transition: 'all 300ms ease-out'
  });

  const paginationInfoStyle = {
    fontSize: '0.875rem',
    color: 'var(--color-foreground)',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  };

  // ===== HANDLERS =====

  const handleViewDetails = (zoneId) => {
    navigate(`/zones/${zoneId}`);
  };

  const handleEdit = (zoneId) => {
    navigate(`/zones/${zoneId}/edit`);
  };

  const handleAddZone = () => {
    navigate('/zones/create');
  };

  const handleRetry = () => {
    setError('');
    loadZones();
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Scroll to top of zone grid
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Scroll to top of zone grid
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Show max 5 page buttons

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, and pages around current
      if (currentPage <= 3) {
        // Show first 5 pages
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show last 5 pages
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show pages around current
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div style={containerStyle}>
      <div style={maxWidthWrapperStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>Industrial Zones</h1>
        </div>

        {/* Search Bar */}
        <ZoneSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterAvailable={filterAvailable}
          onFilterChange={setFilterAvailable}
          isAdmin={isAdmin()}
          onAddZone={handleAddZone}
        />

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
        {loading && <div style={loadingStyle}>Loading zones...</div>}

        {/* Zone Grid */}
        {!loading && (
          <>
            {sortedZones.length > 0 ? (
              <>
                <div style={gridStyle}>
                  {paginatedZones.map((zone) => (
                    <ZoneCard
                      key={zone.id}
                      zone={zone}
                      isAdmin={isAdmin()}
                      onViewDetails={() => handleViewDetails(zone.id)}
                      onEdit={() => handleEdit(zone.id)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div style={paginationContainerStyle}>
                    {/* Previous Button */}
                    <button
                      style={paginationButtonStyle(currentPage === 1, false)}
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      onMouseEnter={(e) => {
                        if (currentPage > 1) {
                          e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
                          e.target.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.boxShadow = 'var(--shadow-inset)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      ← Previous
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page, index) => {
                      if (page === '...') {
                        return (
                          <span key={`ellipsis-${index}`} style={paginationInfoStyle}>
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={page}
                          style={paginationButtonStyle(false, page === currentPage)}
                          onClick={() => handlePageClick(page)}
                          onMouseEnter={(e) => {
                            if (page !== currentPage) {
                              e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
                              e.target.style.transform = 'translateY(-2px)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (page !== currentPage) {
                              e.target.style.boxShadow = 'var(--shadow-inset)';
                              e.target.style.transform = 'translateY(0)';
                            }
                          }}
                        >
                          {page}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      style={paginationButtonStyle(currentPage === totalPages, false)}
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      onMouseEnter={(e) => {
                        if (currentPage < totalPages) {
                          e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
                          e.target.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.boxShadow = 'var(--shadow-inset)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      Next →
                    </button>

                    {/* Page Info */}
                    <span style={paginationInfoStyle}>
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div style={noResultsStyle}>
                {zones.length === 0
                  ? 'No zones available'
                  : 'No zones match your search or filter criteria'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
