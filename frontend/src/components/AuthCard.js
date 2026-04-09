import React from 'react';

/**
 * AuthCard - Neumorphic card wrapper for authentication forms
 * Replaces MUI Paper + Container with native HTML + Tailwind
 *
 * Features:
 * - Neumorphic extruded shadow (raised appearance)
 * - Responsive padding (1rem mobile, 2rem desktop)
 * - Rounded corners with design token radius-container (32px)
 * - Smooth transitions on hover (lift effect)
 *
 * @param {React.ReactNode} children - Form content
 * @param {string} className - Additional Tailwind classes
 */
export default function AuthCard({ children, className = '' }) {
  return (
    <div className={`
      w-full max-w-sm mx-auto
      bg-neu-bg
      rounded-neu-container
      shadow-neu-extruded
      hover:shadow-neu-extruded-hover
      hover:translate-y-[-2px]
      transition-all
      duration-300
      ease-out
      p-6
      sm:p-8
      ${className}
    `}>
      {children}
    </div>
  );
}
