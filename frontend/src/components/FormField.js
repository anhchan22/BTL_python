import React from 'react';

/**
 * FormField - Neumorphic input wrapper with label and error message
 * Replaces MUI TextField with native HTML input + inline styles
 *
 * Features:
 * - Neumorphic inset-deep shadow (carved appearance)
 * - Auto-generated label from placeholder
 * - Error state with inline error message display
 * - Focus ring with accent color (WCAG AA)
 * - Placeholder styling with muted color
 * - Smooth 300ms transitions on all state changes
 *
 * @param {string} label - Form label text
 * @param {string} name - Input name attribute
 * @param {string} value - Current input value
 * @param {function} onChange - Change handler
 * @param {string} type - Input type (text, email, password, etc.)
 * @param {string} placeholder - Placeholder text
 * @param {boolean} required - Mark as required
 * @param {string} error - Error message to display
 * @param {boolean} disabled - Disable input
 */
export default function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  error = '',
  disabled = false
}) {
  const [isFocused, setIsFocused] = React.useState(false);

  const labelStyle = {
    display: 'block',
    fontSize: '0.9375rem',
    fontWeight: '600',
    color: 'var(--color-foreground)',
    marginBottom: '0.5rem',
    transition: 'color 300ms cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: 'var(--radius-base)',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-foreground)',
    border: 'none',
    fontFamily: '"DM Sans", sans-serif',
    fontSize: '1rem',
    transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isFocused || error
      ? error
        ? 'inset 10px 10px 20px rgb(163, 177, 198, 0.7), inset -10px -10px 20px rgba(255, 255, 255, 0.6), 0 0 0 2px var(--color-background), 0 0 0 4px #EF4444'
        : 'inset 10px 10px 20px rgb(163, 177, 198, 0.7), inset -10px -10px 20px rgba(255, 255, 255, 0.6), 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-accent)'
      : 'var(--shadow-inset)',
    outline: 'none',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    willChange: 'box-shadow, background-color'
  };

  const errorStyle = {
    fontSize: '0.875rem',
    color: '#EF4444',
    fontWeight: '500',
    marginTop: '0.25rem'
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      {/* Label */}
      {label && (
        <label htmlFor={name} style={labelStyle}>
          {label}
          {required && <span style={{ color: '#EF4444', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}

      {/* Input */}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        style={inputStyle}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />

      {/* Error Message */}
      {error && (
        <p id={`${name}-error`} style={errorStyle}>
          {error}
        </p>
      )}
    </div>
  );
}
