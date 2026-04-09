import React from 'react';

/**
 * AuthCard - Neumorphic card wrapper for authentication forms
 * Replaces MUI Paper + Container with native HTML + inline styles
 *
 * Features:
 * - Neumorphic extruded shadow (raised appearance)
 * - Responsive padding (1.5rem mobile, 2rem desktop)
 * - Rounded corners with design token radius-container (32px)
 * - Smooth transitions on hover (lift effect)
 * - Size variants: sm (384px), md (448px), lg (672px)
 *
 * @param {React.ReactNode} children - Form content
 * @param {string} size - Card width: 'sm', 'md', 'lg' (default: 'md')
 * @param {React.CSSProperties} style - Additional inline styles
 */
export default function AuthCard({ children, size = 'md', style = {} }) {
  const sizeMap = {
    sm: '384px',   // 24rem
    md: '448px',   // 28rem
    lg: '672px'    // 42rem
  };

  const cardStyle = {
    width: '100%',
    maxWidth: sizeMap[size],
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: 'var(--color-background)',
    borderRadius: 'var(--radius-container)',
    boxShadow: 'var(--shadow-extruded)',
    transition: 'all 300ms ease-out',
    padding: '1.5rem',
    '@media (min-width: 640px)': {
      padding: '2rem'
    },
    ...style
  };

  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <div
      style={{
        ...cardStyle,
        boxShadow: isHovering ? 'var(--shadow-extruded-hover)' : 'var(--shadow-extruded)',
        transform: isHovering ? 'translateY(-2px)' : 'translateY(0)'
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
    </div>
  );
}