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
        boxShadow: isHovering
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(108, 99, 255, 0.1)'
          : 'var(--shadow-extruded)',
        transform: isHovering ? 'translateY(-5px) scale(1.01)' : 'translateY(0) scale(1)',
        transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform, box-shadow'
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
    </div>
  );
}