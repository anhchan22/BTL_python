import React from 'react';

/**
 * NeuButton - Neumorphic button with multiple variants
 * Replaces MUI Button with native button + neumorphic styling
 *
 * Features:
 * - Extruded (raised) state by default
 * - Hover lift effect (-1px translateY)
 * - Press/active state with inset shadow
 * - Focus ring for keyboard navigation (WCAG AA)
 * - Disabled state with reduced opacity
 * - Smooth 300ms transitions on all state changes
 *
 * Variants:
 * - primary (accent color, white text)
 * - secondary (muted, foreground text)
 *
 * Sizes:
 * - small (py-2, px-4)
 * - medium (py-3, px-6) - default
 * - large (py-4, px-8) - form submit
 *
 * @param {React.ReactNode} children - Button text or content
 * @param {string} variant - Button style variant (primary, secondary)
 * @param {string} size - Button size (small, medium, large)
 * @param {boolean} fullWidth - Full width button
 * @param {string} type - Button type (button, submit, reset)
 * @param {boolean} disabled - Disable button
 * @param {function} onClick - Click handler
 */
export default function NeuButton({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  type = 'button',
  disabled = false,
  onClick
}) {
  const [buttonState, setButtonState] = React.useState('normal'); // normal, hover, active

  const sizeConfig = {
    small: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    medium: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    large: { padding: '1rem 2rem', fontSize: '1rem' }
  };

  const variantConfig = {
    primary: {
      normal: {
        backgroundColor: 'var(--color-accent)',
        color: 'white',
        boxShadow: 'var(--shadow-extruded)'
      },
      hover: {
        backgroundColor: 'var(--color-accent-light)',
        color: 'white',
        boxShadow: '0 20px 25px -5px rgba(108, 99, 255, 0.3), 0 10px 10px -5px rgba(108, 99, 255, 0.2), 0 0 0 2px rgba(108, 99, 255, 0.2)',
        transform: 'translateY(-3px) scale(1.02)'
      },
      active: {
        backgroundColor: 'var(--color-accent)',
        color: 'white',
        boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.2), inset -2px -2px 4px rgba(255, 255, 255, 0.3)',
        transform: 'translateY(0.5px) scale(0.98)'
      }
    },
    secondary: {
      normal: {
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-foreground)',
        boxShadow: 'var(--shadow-extruded)'
      },
      hover: {
        backgroundColor: '#D5DDE5',
        color: 'var(--color-foreground)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        transform: 'translateY(-3px) scale(1.02)'
      },
      active: {
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-foreground)',
        boxShadow: 'var(--shadow-inset-small)',
        transform: 'translateY(0.5px) scale(0.98)'
      }
    }
  };

  const buttonStyle = {
    ...sizeConfig[size],
    ...variantConfig[variant][buttonState],
    borderRadius: 'var(--radius-base)',
    fontWeight: '500',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    willChange: 'transform, box-shadow, background-color'
  };

  const handleMouseDown = () => {
    if (!disabled) setButtonState('active');
  };

  const handleMouseUp = () => {
    if (!disabled) setButtonState('hover');
  };

  const handleMouseEnter = () => {
    if (!disabled) setButtonState('hover');
  };

  const handleMouseLeave = () => {
    setButtonState('normal');
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {children}
    </button>
  );
}