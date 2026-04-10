import React from 'react';

/**
 * NeuNavButton - Neumorphic navigation button for dashboard quick actions
 * Used in grid layouts for navigation-focused buttons
 *
 * Features:
 * - Extruded shadow by default (raised appearance)
 * - Hover lift effect with shadow increase
 * - Press/active state with inset shadow
 * - Icon + label layout (vertical alignment)
 * - Full-width in grid contexts
 * - Smooth 300ms transitions
 * - Focus ring for keyboard navigation
 *
 * @param {string} label - Button label text
 * @param {React.ReactNode} icon - Icon or emoji
 * @param {function} onClick - Click handler
 * @param {boolean} disabled - Disable button
 */
export default function NeuNavButton({
  label,
  icon,
  onClick,
  disabled = false
}) {
  const [buttonState, setButtonState] = React.useState('normal'); // normal, hover, active

  const stateConfig = {
    normal: {
      boxShadow: 'var(--shadow-extruded)',
      transform: 'translateY(0)'
    },
    hover: {
      boxShadow: 'var(--shadow-extruded-hover)',
      transform: 'translateY(-4px)'
    },
    active: {
      boxShadow: 'var(--shadow-inset-small)',
      transform: 'translateY(2px)'
    }
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-foreground)',
    borderRadius: 'var(--radius-base)',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    padding: 'clamp(1.5rem, 4vw, 2rem)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    transition: 'all 300ms ease-out',
    opacity: disabled ? 0.5 : 1,
    minHeight: '44px',
    ...stateConfig[buttonState]
  };

  const iconStyle = {
    fontSize: '1.875rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const labelStyle = {
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: '1.25'
  };

  const handleMouseEnter = () => {
    if (!disabled) setButtonState('hover');
  };

  const handleMouseLeave = () => {
    setButtonState('normal');
  };

  const handleMouseDown = () => {
    if (!disabled) setButtonState('active');
  };

  const handleMouseUp = () => {
    if (!disabled) setButtonState('hover');
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Icon */}
      {icon && <span style={iconStyle}>{icon}</span>}

      {/* Label */}
      <span style={labelStyle}>{label}</span>
    </button>
  );
}
