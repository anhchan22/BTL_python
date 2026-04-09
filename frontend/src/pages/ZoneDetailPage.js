import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { zoneService } from '../services/zoneService';
import DashboardCard from '../components/DashboardCard';
import ImageGallery from '../components/ImageGallery';
import NeuButton from '../components/NeuButton';
import StatusBadge from '../components/StatusBadge';

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
      console.error('Failed to load zone:', err);
      setError('Failed to load zone details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const backButtonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-base)',
    border: 'none',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-foreground)',
    fontWeight: '500',
    fontSize: '0.875rem',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-inset)',
    transition: 'all 300ms ease-out',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1rem',
    color: 'var(--color-muted)'
  };

  const errorBoxStyle = {
    backgroundColor: '#FEE2E2',
    borderLeft: '4px solid #EF4444',
    padding: '1.5rem',
    borderRadius: 'var(--radius-base)',
    marginBottom: '2rem'
  };

  const errorTextStyle = {
    color: '#7F1D1D',
    fontSize: '0.875rem',
    fontWeight: '500'
  };

  const contentGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    marginBottom: '2rem',
    alignItems: 'start'
  };

  const galleryWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const detailsWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const headerCardStyle = {
    padding: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 'var(--radius-base)',
    boxShadow: 'var(--shadow-extruded)',
    transition: 'all 300ms ease-out'
  };

  const titleStyle = {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: '700',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    color: 'var(--color-foreground)',
    marginBottom: '0.5rem'
  };

  const locationStyle = {
    fontSize: '0.95rem',
    color: 'var(--color-muted)',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const statusBadgeContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
  };

  const specsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem'
  };

  const specCardStyle = {
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 'var(--radius-inner)',
    transition: 'all 300ms ease-out'
  };

  const specLabelStyle = {
    fontSize: '0.7rem',
    fontWeight: '600',
    color: 'var(--color-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.35rem'
  };

  const specValueStyle = {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--color-foreground)'
  };

  const descriptionTextStyle = {
    color: 'var(--color-foreground)',
    fontSize: '0.95rem',
    lineHeight: '1.6'
  };

  const amenitiesTextStyle = {
    color: 'var(--color-foreground)',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap'
  };

  const actionContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '2rem'
  };

  // ===== RENDER STATES =====

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={maxWidthWrapperStyle}>
          <div style={loadingStyle}>Loading zone details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={maxWidthWrapperStyle}>
          <div style={errorBoxStyle}>
            <p style={errorTextStyle}>{error}</p>
          </div>
          <button
            style={backButtonStyle}
            onClick={() => navigate('/zones')}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = 'var(--shadow-inset-deep)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = 'var(--shadow-inset)';
            }}
          >
            ← Back to Zones
          </button>
        </div>
      </div>
    );
  }

  if (!zone) {
    return (
      <div style={containerStyle}>
        <div style={maxWidthWrapperStyle}>
          <div style={loadingStyle}>Zone not found</div>
          <button style={backButtonStyle} onClick={() => navigate('/zones')}>
            ← Back to Zones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={maxWidthWrapperStyle}>
        {/* Back Button */}
        <button
          style={backButtonStyle}
          onClick={() => navigate('/zones')}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = 'var(--shadow-inset-deep)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'var(--shadow-inset)';
          }}
        >
          ← Back to Zones
        </button>

        {/* Main Content Grid */}
        <div style={{ ...contentGridStyle, gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '1fr 1fr' }}>
          {/* LEFT: Image Gallery */}
          <div style={galleryWrapperStyle}>
            <ImageGallery images={zone.images} zoneId={zone.id} zoneName={zone.name} />
          </div>

          {/* RIGHT: Zone Details */}
          <div style={detailsWrapperStyle}>
            {/* Header Card */}
            <div style={headerCardStyle}>
              <h1 style={titleStyle}>{zone.name}</h1>
              <div style={locationStyle}>
                <span>📍</span>
                <span>{zone.location}</span>
              </div>
              <div style={statusBadgeContainerStyle}>
                <StatusBadge
                  status={zone.is_available && zone.available_area > 0 ? 'AVAILABLE' : 'NOT AVAILABLE'}
                  type="rental"
                />
              </div>
            </div>

            {/* Specs Card */}
            <DashboardCard title="Key Specifications" icon="📊">
              <div style={specsGridStyle}>
                <div style={specCardStyle}>
                  <div style={specLabelStyle}>Total Area</div>
                  <div style={specValueStyle}>{formatArea(zone.total_area)} m²</div>
                </div>
                <div style={specCardStyle}>
                  <div style={specLabelStyle}>Available</div>
                  <div style={specValueStyle}>{formatArea(zone.available_area)} m²</div>
                </div>
                <div style={specCardStyle}>
                  <div style={specLabelStyle}>Price/m²/mo</div>
                  <div style={specValueStyle}>{formatPrice(zone.price_per_sqm)}</div>
                </div>
              </div>
            </DashboardCard>

            {/* Description & Amenities Card */}
            {(zone.description || zone.amenities) && (
              <DashboardCard title="About this Zone" icon="ℹ️">
                {zone.description && (
                  <div style={{ marginBottom: zone.amenities ? '1.5rem' : 0 }}>
                    <p style={descriptionTextStyle}>{zone.description}</p>
                  </div>
                )}
                {zone.amenities && (
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                      Amenities
                    </div>
                    <p style={amenitiesTextStyle}>{zone.amenities}</p>
                  </div>
                )}
              </DashboardCard>
            )}

            {/* Action Buttons */}
            <div style={actionContainerStyle}>
              {/* Admin Edit Button */}
              {isAdmin() && (
                <NeuButton
                  variant="secondary"
                  size="medium"
                  onClick={() => navigate(`/zones/${id}/edit`)}
                >
                  ✏️ Edit Zone
                </NeuButton>
              )}

              {/* Tenant Request Button */}
              {!isAdmin() && zone.is_available && zone.available_area > 0 && (
                <button
                  style={{
                    padding: '0.875rem 1.5rem',
                    borderRadius: 'var(--radius-base)',
                    border: 'none',
                    backgroundColor: 'var(--color-accent)',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-extruded)',
                    transition: 'all 300ms ease-out',
                    fontFamily: '"DM Sans", sans-serif',
                    width: '100%'
                  }}
                  onClick={() => navigate(`/zones/${id}/request`)}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--color-accent-light)';
                    e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--color-accent)';
                    e.target.style.boxShadow = 'var(--shadow-extruded)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  🏢 Create Rental Request
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== HELPER FUNCTIONS =====

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price || 0);
}

function formatArea(area) {
  return new Intl.NumberFormat('en-US').format(Math.round(area || 0));
}
