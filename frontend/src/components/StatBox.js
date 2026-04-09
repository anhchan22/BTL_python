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
 * @param {string} className - Additional Tailwind classes
 */
export default function StatBox({
  value,
  label,
  variant = 'default',
  icon,
  className = ''
}) {
  const variantClasses = {
    default: 'text-neu-accent',
    success: 'text-neu-accent-secondary',
    info: 'text-blue-500',
    warning: 'text-amber-500'
  };

  return (
    <div className={`
      w-full
      bg-neu-bg
      rounded-neu-base
      shadow-neu-extruded
      hover:shadow-neu-extruded-hover
      hover:-translate-y-1
      transition-all
      duration-300
      ease-out
      p-6
      flex
      flex-col
      items-center
      justify-center
      gap-2
      ${className}
    `}>
      {/* Icon (optional) */}
      {icon && (
        <div className={`
          text-3xl
          ${variantClasses[variant]}
        `}>
          {icon}
        </div>
      )}

      {/* Value - Large number */}
      <div className={`
        text-4xl
        sm:text-5xl
        font-bold
        font-display
        text-neu-fg
        leading-tight
      `}>
        {value}
      </div>

      {/* Label - Descriptive text */}
      <div className={`
        text-sm
        sm:text-base
        font-medium
        text-neu-muted
        text-center
      `}>
        {label}
      </div>
    </div>
  );
}
