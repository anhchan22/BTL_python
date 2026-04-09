import React from 'react';
import ZoneImagePlaceholder from './ZoneImagePlaceholder';

/**
 * ZoneCard - Neumorphic card for displaying zone information
 * Shows image, title, location, specs, status, and action buttons
 *
 * Features:
 * - Responsive card layout
 * - Image placeholder with zone gradient
 * - Zone details (name, location, area, price)
 * - Availability status badge
 * - View Details and Edit (admin) buttons
 * - Hover lift effect with enhanced shadow
 *
 * @param {Object} zone - Zone data object
 * @param {boolean} isAdmin - Whether user is admin
 * @param {function} onViewDetails - Callback for View Details button
 * @param {function} onEdit - Callback for Edit button (admin only)
 */
export default function ZoneCard({ zone, isAdmin, onViewDetails, onEdit }) {
  const [isHovering, setIsHovering] = React.useState(false);

  const cardStyle = {
    width: '100%',
    backgroundColor: 'var(--color-background)',
    borderRadius: 'var(--radius-base)',
    boxShadow: isHovering ? 'var(--shadow-extruded-hover)' : 'var(--shadow-extruded)',
    transition: 'all 300ms ease-out',
    overflow: 'hidden',
    cursor: 'pointer',
    transform: isHovering ? 'translateY(-4px)' : 'translateY(0)',
    display: 'flex',
    flexDirection: 'column'
  };

  const imageContainerStyle = {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  };

  const contentStyle = {
    padding: '1.5rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    color: 'var(--color-foreground)',
    marginBottom: '0.5rem'
  };

  const locationStyle = {
    fontSize: '0.875rem',
    color: 'var(--color-muted)',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const specsStyle = {
    fontSize: '0.875rem',
    marginBottom: '0.5rem',
    color: 'var(--color-fg)',
    display: 'flex',
    justifyContent: 'space-between'
  };

  const specLabelStyle = {
    color: 'var(--color-muted)',
    fontWeight: '500'
  };

  const specValueStyle = {
    color: 'var(--color-foreground)',
    fontWeight: '700'
  };

  const statusContainerStyle = {
    marginTop: '1rem',
    marginBottom: '1rem'
  };

  const statusBadgeStyle = {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '700',
    backgroundColor: zone.is_available && zone.available_area > 0
      ? 'rgba(56, 178, 172, 0.2)'
      : 'rgba(239, 68, 68, 0.2)',
    color: zone.is_available && zone.available_area > 0
      ? 'var(--color-accent-secondary)'
      : '#DC2626'
  };

  const actionsStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginTop: 'auto',
    paddingTop: '1rem',
    borderTop: '1px solid var(--color-muted)',
    borderTopOpacity: '0.2'
  };

  const buttonStyle = {
    flex: 1,
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-inner)',
    border: 'none',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 300ms ease-out',
    boxShadow: 'var(--shadow-extruded-small)'
  };

  const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'var(--color-muted)',
    flex: 1
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatArea = (area) => {
    return new Intl.NumberFormat('en-US').format(Math.round(area));
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image */}
      <div style={imageContainerStyle}>
        <ZoneImagePlaceholder zoneId={zone.id} zoneName="🏭" />
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {/* Title */}
        <h3 style={titleStyle}>{zone.name}</h3>

        {/* Location */}
        <div style={locationStyle}>
          <span>📍</span>
          <span>{zone.location}</span>
        </div>

        {/* Specs */}
        <div style={specsStyle}>
          <span>
            <span style={specLabelStyle}>Total Area:</span>{' '}
            <span style={specValueStyle}>{formatArea(zone.total_area)} m²</span>
          </span>
        </div>

        <div style={specsStyle}>
          <span>
            <span style={specLabelStyle}>Available:</span>{' '}
            <span style={specValueStyle}>{formatArea(zone.available_area)} m²</span>
          </span>
        </div>

        <div style={specsStyle}>
          <span>
            <span style={specLabelStyle}>Price:</span>{' '}
            <span style={specValueStyle}>{formatPrice(zone.price_per_sqm)}/m²/mo</span>
          </span>
        </div>

        {/* Status */}
        <div style={statusContainerStyle}>
          <span style={statusBadgeStyle}>
            {zone.is_available && zone.available_area > 0 ? 'AVAILABLE' : 'NOT AVAILABLE'}
          </span>
        </div>

        {/* Action Buttons */}
        <div style={actionsStyle}>
          <button
            style={buttonStyle}
            onClick={onViewDetails}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-accent-light)';
              e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--color-accent)';
              e.target.style.boxShadow = 'var(--shadow-extruded-small)';
            }}
          >
            View Details
          </button>
          {isAdmin && (
            <button
              style={editButtonStyle}
              onClick={onEdit}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#9CA3AF';
                e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-muted)';
                e.target.style.boxShadow = 'var(--shadow-extruded-small)';
              }}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
