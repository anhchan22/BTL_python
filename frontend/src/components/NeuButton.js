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
 * @param {string} className - Additional Tailwind classes
 */
export default function NeuButton({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  type = 'button',
  disabled = false,
  onClick,
  className = ''
}) {
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-base'
  };

  const variantClasses = {
    primary: `
      bg-neu-accent
      text-white
      hover:bg-neu-accent-light
      active:bg-neu-accent
      shadow-neu-extruded
      hover:shadow-neu-extruded-hover
      active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),_inset_-2px_-2px_4px_rgba(255,255,255,0.3)]
    `,
    secondary: `
      bg-neu-bg
      text-neu-fg
      hover:bg-[#D5DDE5]
      active:bg-neu-bg
      shadow-neu-extruded
      hover:shadow-neu-extruded-hover
      active:shadow-neu-inset-small
    `
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-neu-base
        font-medium
        border-0
        cursor-pointer
        inline-flex
        items-center
        justify-center
        min-h-[44px]

        transition-all
        duration-300
        ease-out

        hover:-translate-y-[1px]
        active:translate-y-[0.5px]

        focus:outline-none
        focus-visible:shadow-[
          var(--shadow-extruded),
          0_0_0_2px_var(--color-background),
          0_0_0_4px_var(--color-accent)
        ]

        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:transform-none

        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
