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
    gap: 'clamp(1.5rem, 3vw, 2rem)'
  };

  const noResultsStyle = {
    textAlign: 'center',
    padding: '3rem',
    color: 'var(--color-muted)',
    fontSize: '1rem'
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
              <div style={gridStyle}>
                {sortedZones.map((zone) => (
                  <ZoneCard
                    key={zone.id}
                    zone={zone}
                    isAdmin={isAdmin()}
                    onViewDetails={() => handleViewDetails(zone.id)}
                    onEdit={() => handleEdit(zone.id)}
                  />
                ))}
              </div>
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
