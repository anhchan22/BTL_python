import React from 'react';

/**
 * DashboardCard - Neumorphic card wrapper for dashboard sections
 * Groups related content (quick actions, contract list, etc.)
 *
 * Features:
 * - Neumorphic extruded shadow (raised appearance)
 * - Title with optional icon
 * - Optional action button in header
 * - Flexible content area
 * - Responsive padding (mobile vs desktop)
 * - Smooth transitions on hover (lift effect)
 *
 * @param {string} title - Card section title
 * @param {React.ReactNode} icon - Optional icon for title
 * @param {React.ReactNode} action - Optional action button/element for header
 * @param {React.ReactNode} children - Card content
 */
export default function DashboardCard({
  title,
  icon,
  action,
  children
}) {
  const [isHovering, setIsHovering] = React.useState(false);

  const cardStyle = {
    width: '100%',
    backgroundColor: 'var(--color-background)',
    borderRadius: 'var(--radius-container)',
    boxShadow: isHovering ? 'var(--shadow-extruded-hover)' : 'var(--shadow-extruded)',
    transition: 'all 300ms ease-out',
    padding: 'clamp(1.5rem, 4vw, 2rem)',
    transform: isHovering ? 'translateY(-4px)' : 'translateY(0)'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid var(--color-muted)',
    borderBottomOpacity: '0.2'
  };

  const titleContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  };

  const iconStyle = {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)'
  };

  const titleStyle = {
    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
    fontWeight: '700',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    color: 'var(--color-foreground)'
  };

  const actionStyle = {
    marginLeft: '1rem'
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Header with title and optional action */}
      {title && (
        <div style={headerStyle}>
          <div style={titleContainerStyle}>
            {icon && <span style={iconStyle}>{icon}</span>}
            <h2 style={titleStyle}>{title}</h2>
          </div>

          {action && <div style={actionStyle}>{action}</div>}
        </div>
      )}

      {/* Content area */}
      <div style={contentStyle}>{children}</div>
    </div>
  );
}
