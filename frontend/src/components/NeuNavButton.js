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
 * @param {string} className - Additional Tailwind classes
 */
export default function NeuNavButton({
  label,
  icon,
  onClick,
  disabled = false,
  className = ''
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full
        bg-neu-bg
        text-neu-fg
        rounded-neu-base
        shadow-neu-extruded
        hover:shadow-neu-extruded-hover
        hover:-translate-y-1
        active:shadow-neu-inset-small
        active:translate-y-0.5
        transition-all
        duration-300
        ease-out
        px-4
        py-6
        sm:py-8
        border-0
        cursor-pointer
        flex
        flex-col
        items-center
        justify-center
        gap-3

        focus:outline-none
        focus-visible:shadow-[
          var(--shadow-extruded),
          0_0_0_2px_var(--color-background),
          0_0_0_4px_var(--color-accent)
        ]

        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:transform-none

        ${className}
      `}
    >
      {/* Icon */}
      {icon && (
        <span className="text-3xl">
          {icon}
        </span>
      )}

      {/* Label */}
      <span className="
        text-sm
        sm:text-base
        font-semibold
        text-center
        leading-tight
      ">
        {label}
      </span>
    </button>
  );
}
