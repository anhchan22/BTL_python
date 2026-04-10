import React from 'react';

/**
 * StatBox - Neumorphic KPI statistics display
 * Shows key metrics (count, label, optional icon/color)
 *
 * Features:
 * - Neumorphic extruded shadow (raised appearance)
 * - Large number display for quick scanning
 * - Subtitle label for context
 * - Optional accent color (success/info/warning)
 * - Responsive sizing (adapts to grid)
 * - Smooth transitions on hover (lift effect)
 *
 * @param {number|string} value - The statistic value (count, percentage, etc.)
 * @param {string} label - Descriptive label for the stat
 * @param {string} variant - Color variant (default, success, info, warning)
 * @param {React.ReactNode} icon - Optional icon to display (emoji or component)
 */
export default function StatBox({
  value,
  label,
  variant = 'default',
  icon
}) {
  const [isHovering, setIsHovering] = React.useState(false);

  const variantColorMap = {
    default: 'var(--color-accent)',
    success: 'var(--color-accent-secondary)',
    info: '#3B82F6',
    warning: '#FBBF24'
  };

  const containerStyle = {
    width: '100%',
    backgroundColor: 'var(--color-background)',
    borderRadius: 'var(--radius-base)',
    boxShadow: isHovering
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(108, 99, 255, 0.1)'
      : 'var(--shadow-extruded)',
    transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    transform: isHovering ? 'translateY(-5px) scale(1.01)' : 'translateY(0) scale(1)',
    willChange: 'transform, box-shadow'
  };

  const iconStyle = {
    fontSize: '1.875rem',
    color: variantColorMap[variant],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const valueStyle = {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: '700',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    color: 'var(--color-foreground)',
    lineHeight: '1.2'
  };

  const labelStyle = {
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    fontWeight: '500',
    color: 'var(--color-muted)',
    textAlign: 'center'
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Icon (optional) */}
      {icon && <div style={iconStyle}>{icon}</div>}

      {/* Value - Large number */}
      <div style={valueStyle}>{value}</div>

      {/* Label - Descriptive text */}
      <div style={labelStyle}>{label}</div>
    </div>
  );
}
