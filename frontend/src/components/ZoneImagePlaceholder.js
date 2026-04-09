import React from 'react';

/**
 * ZoneImagePlaceholder - Deterministic gradient placeholder for zone images
 * Generates consistent colors based on zone ID (same ID = same color every time)
 *
 * Features:
 * - 6 vibrant industrial-themed gradients
 * - Deterministic: same zone ID always gets same color
 * - Fallback for missing images
 * - 16:9 aspect ratio (industrial zone standard)
 *
 * @param {number|string} zoneId - Zone ID for deterministic color mapping
 * @param {string} zoneName - Zone name to display as emoji/text overlay
 */
export default function ZoneImagePlaceholder({ zoneId, zoneName = '🏭' }) {
  // 6 industrial-themed gradients
  const gradients = [
    'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',   // Purple → Indigo
    'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',   // Pink → Red
    'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',   // Blue → Cyan
    'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',   // Green → Teal
    'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',   // Orange → Yellow
    'linear-gradient(135deg, #30CFD0 0%, #330867 100%)'    // Teal → Purple
  ];

  // Deterministic: use zone ID to pick gradient
  const gradientIndex = (parseInt(zoneId) || 0) % gradients.length;
  const selectedGradient = gradients[gradientIndex];

  const containerStyle = {
    width: '100%',
    aspectRatio: '16 / 9',
    background: selectedGradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  };

  const overlayStyle = {
    position: 'absolute',
    inset: '0',
    background: 'rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    zIndex: 1
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}>{zoneName}</div>
    </div>
  );
}
