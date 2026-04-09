import React from 'react';

/**
 * AuthCard - Neumorphic card wrapper for authentication forms
 * Replaces MUI Paper + Container with native HTML + Tailwind
 *
 * Features:
 * - Neumorphic extruded shadow (raised appearance)
 * - Responsive padding (1.5rem mobile, 2rem desktop)
 * - Rounded corners with design token radius-container (32px)
 * - Smooth transitions on hover (lift effect)
 * - Size variants: sm (24rem), md (28rem), lg (48rem)
 *
 * @param {React.ReactNode} children - Form content
 * @param {string} size - Card width: 'sm', 'md', 'lg' (default: 'md')
 * @param {string} className - Additional Tailwind classes
 */
export default function AuthCard({ children, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'max-w-sm',      // 24rem for LoginPage
    md: 'max-w-md',      // 28rem default
    lg: 'max-w-2xl'      // 42rem for RegisterPage with 8 fields
  };

  return (
    <div className={`
      w-full ${sizeClasses[size]} mx-auto
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
