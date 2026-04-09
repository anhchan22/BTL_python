import React from 'react';

/**
 * StatusBadge - Neumorphic status badge component
 * Displays semantic status colors with inset shadow styling
 *
 * Statuses:
 * - PENDING (grey/muted)
 * - APPROVED (teal/success)
 * - REJECTED (red/error)
 * - CANCELLED (grey)
 * - ACTIVE (teal)
 * - EXPIRED (amber/warning)
 * - TERMINATED (red)
 *
 * @param {string} status - Status text to display
 * @param {string} type - Type: 'rental' or 'contract' (for color mapping)
 */
export default function StatusBadge({ status, type = 'rental' }) {
  const getRentalStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return { bg: 'rgba(107, 114, 128, 0.2)', text: '#4B5563' };
      case 'APPROVED':
        return { bg: 'rgba(56, 178, 172, 0.2)', text: 'var(--color-accent-secondary)' };
      case 'REJECTED':
        return { bg: 'rgba(239, 68, 68, 0.2)', text: '#DC2626' };
      case 'CANCELLED':
        return { bg: 'rgba(107, 114, 128, 0.2)', text: '#6B7280' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.2)', text: '#6B7280' };
    }
  };

  const getContractStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return { bg: 'rgba(56, 178, 172, 0.2)', text: 'var(--color-accent-secondary)' };
      case 'EXPIRED':
        return { bg: 'rgba(251, 191, 36, 0.2)', text: '#D97706' };
      case 'TERMINATED':
        return { bg: 'rgba(239, 68, 68, 0.2)', text: '#DC2626' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.2)', text: '#6B7280' };
    }
  };

  const colors = type === 'contract' ? getContractStatusColor(status) : getRentalStatusColor(status);

  const badgeStyle = {
    display: 'inline-block',
    padding: '0.375rem 0.75rem',
    borderRadius: '9999px',
    backgroundColor: colors.bg,
    color: colors.text,
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap'
  };

  return <span style={badgeStyle}>{status}</span>;
}
