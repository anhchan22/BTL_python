import React from 'react';
import ZoneImagePlaceholder from './ZoneImagePlaceholder';
import { translations, formatPriceVND } from '../utils/vietnamese-translations';

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

  // Get the first image if available
  const firstImage = zone.images && zone.images.length > 0 ? zone.images[0] : null;
  const imageUrl = firstImage?.image
    ? (firstImage.image.startsWith('http')
        ? firstImage.image
        : `http://127.0.0.1:8000${firstImage.image}`)
    : null;

  const cardStyle = {
    width: '100%',
    backgroundColor: 'var(--color-background)',
    borderRadius: 'var(--radius-container)',
    boxShadow: isHovering
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(108, 99, 255, 0.1)'
      : 'var(--shadow-extruded)',
    transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    cursor: 'pointer',
    transform: isHovering ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)',
    display: 'flex',
    flexDirection: 'column',
    willChange: 'transform, box-shadow'
  };

  const imageContainerStyle = {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 'var(--radius-container) var(--radius-container) 0 0',
    position: 'relative'
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1), filter 400ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovering ? 'scale(1.08)' : 'scale(1)',
    filter: isHovering ? 'brightness(0.92)' : 'brightness(1)'
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
    marginBottom: '0.5rem',
    lineHeight: '1.3'
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
    marginBottom: '0.75rem',
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
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.875rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '700',
    backgroundColor: zone.is_available && zone.available_area > 0
      ? 'rgba(56, 178, 172, 0.2)'
      : 'rgba(239, 68, 68, 0.2)',
    color: zone.is_available && zone.available_area > 0
      ? 'var(--color-accent-secondary)'
      : '#DC2626',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const actionsStyle = {
    display: 'flex',
    gap: '0.75rem',
    marginTop: 'auto',
    paddingTop: '1.25rem',
    borderTop: '1px solid rgba(0, 0, 0, 0.05)'
  };

  const buttonStyle = {
    flex: 1,
    padding: '0.65rem 1rem',
    borderRadius: 'var(--radius-base)',
    border: 'none',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: 'var(--shadow-extruded-small)',
    willChange: 'transform, box-shadow, background-color'
  };

  const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'var(--color-muted)',
    flex: 1
  };

  const formatPrice = (price) => {
    return formatPriceVND(price);
  };

  const formatArea = (area) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(area));
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image */}
      <div style={imageContainerStyle}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={zone.name}
            style={imageStyle}
            onError={(e) => {
              // If image fails to load, hide it and show placeholder
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <ZoneImagePlaceholder zoneId={zone.id} zoneName="🏭" />
        )}
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
            <span style={specLabelStyle}>{translations.totalAreaLabel}</span>{' '}
            <span style={specValueStyle}>{formatArea(zone.total_area)} m²</span>
          </span>
        </div>

        <div style={specsStyle}>
          <span>
            <span style={specLabelStyle}>{translations.availableLabel}</span>{' '}
            <span style={specValueStyle}>{formatArea(zone.available_area)} m²</span>
          </span>
        </div>

        <div style={specsStyle}>
          <span>
            <span style={specLabelStyle}>{translations.priceLabel}</span>{' '}
            <span style={specValueStyle}>{formatPrice(zone.price_per_sqm)}/m²/tháng</span>
          </span>
        </div>

        {/* Status */}
        <div style={statusContainerStyle}>
          <span style={statusBadgeStyle}>
            {zone.is_available && zone.available_area > 0 ? translations.statusAvailable : translations.statusNotAvailable}
          </span>
        </div>

        {/* Action Buttons */}
        <div style={actionsStyle}>
          <button
            style={buttonStyle}
            onClick={onViewDetails}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-accent-light)';
              e.target.style.boxShadow = '0 20px 25px -5px rgba(108, 99, 255, 0.3), 0 10px 10px -5px rgba(108, 99, 255, 0.2)';
              e.target.style.transform = 'translateY(-3px) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--color-accent)';
              e.target.style.boxShadow = 'var(--shadow-extruded-small)';
              e.target.style.transform = 'translateY(0) scale(1)';
            }}
          >
            {translations.viewDetails}
          </button>
          {isAdmin && (
            <button
              style={editButtonStyle}
              onClick={onEdit}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#9CA3AF';
                e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.05)';
                e.target.style.transform = 'translateY(-3px) scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-muted)';
                e.target.style.boxShadow = 'var(--shadow-extruded-small)';
                e.target.style.transform = 'translateY(0) scale(1)';
              }}
            >
              {translations.edit}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
