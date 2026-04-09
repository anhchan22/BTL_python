import React from 'react';

/**
 * DashboardCard - Neumorphic card wrapper for dashboard sections
 * Groups related content (quick actions, contract list, etc.)
 *
 * Features:
 * - Neumorphic extruded shadow (raised appearance)
 * - Title with optional icon
 * - Optional action button in header
 * - Flexible content area
 * - Responsive padding (mobile vs desktop)
 * - Smooth transitions on hover (lift effect)
 *
 * @param {string} title - Card section title
 * @param {React.ReactNode} icon - Optional icon for title
 * @param {React.ReactNode} action - Optional action button/element for header
 * @param {React.ReactNode} children - Card content
 * @param {string} className - Additional Tailwind classes
 */
export default function DashboardCard({
  title,
  icon,
  action,
  children,
  className = ''
}) {
  return (
    <div className={`
      w-full
      bg-neu-bg
      rounded-neu-container
      shadow-neu-extruded
      hover:shadow-neu-extruded-hover
      hover:-translate-y-1
      transition-all
      duration-300
      ease-out
      p-6
      sm:p-8
      ${className}
    `}>
      {/* Header with title and optional action */}
      {title && (
        <div className="
          flex
          items-center
          justify-between
          mb-6
          pb-6
          border-b
          border-neu-muted
          border-opacity-20
        ">
          <div className="flex items-center gap-3">
            {icon && (
              <span className="
                text-2xl
                sm:text-3xl
              ">
                {icon}
              </span>
            )}
            <h2 className="
              text-xl
              sm:text-2xl
              font-bold
              font-display
              text-neu-fg
            ">
              {title}
            </h2>
          </div>

          {action && (
            <div className="ml-4">
              {action}
            </div>
          )}
        </div>
      )}

      {/* Content area */}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}
