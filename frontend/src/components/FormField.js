import React from 'react';

/**
 * FormField - Neumorphic input wrapper with label and error message
 * Replaces MUI TextField with native HTML input + custom styling
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
  return (
    <div className="mb-4">
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="
            block
            text-sm
            font-medium
            text-neu-fg
            mb-2
          "
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input */}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full
          px-4
          py-3
          rounded-neu-base
          bg-neu-bg
          text-neu-fg
          placeholder-neu-muted
          border-0
          shadow-neu-inset-deep
          font-sans
          text-base
          transition-all
          duration-300
          ease-out

          focus:outline-none
          focus:shadow-[
            inset_10px_10px_20px_rgb(163,177,198,0.7),
            inset_-10px_-10px_20px_rgba(255,255,255,0.6),
            0_0_0_2px_var(--color-background),
            0_0_0_4px_var(--color-accent)
          ]

          disabled:opacity-50
          disabled:cursor-not-allowed

          ${error ? 'shadow-[inset_10px_10px_20px_rgb(163,177,198,0.7),_inset_-10px_-10px_20px_rgba(255,255,255,0.6),_0_0_0_2px_var(--color-background),_0_0_0_4px_#EF4444]' : ''}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />

      {/* Error Message */}
      {error && (
        <p
          id={`${name}-error`}
          className="
            text-sm
            text-red-500
            font-medium
            mt-1
          "
        >
          {error}
        </p>
      )}
    </div>
  );
}
