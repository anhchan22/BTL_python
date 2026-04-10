import React from 'react';
import { getStatusVN } from '../utils/vietnamese-translations';

/**
 * StatusBadge - Neumorphic status badge component
 * Displays semantic status colors with inset shadow styling
 * Translates status to Vietnamese
 *
 * Statuses:
 * - PENDING / CHỜ DUYỆT (grey/muted)
 * - APPROVED / ĐÃ PHÊ DUYỆT (teal/success)
 * - REJECTED / ĐÃ TỪ CHỐI (red/error)
 * - CANCELLED / ĐÃ HỦY (grey)
 * - ACTIVE / HOẠT ĐỘNG (teal)
 * - EXPIRED / HẾT HẠN (amber/warning)
 * - TERMINATED / ĐÃ CHẤM DỨT (red)
 *
 * @param {string} status - Status text to display
 * @param {string} type - Type: 'rental' or 'contract' (for color mapping)
 */
export default function StatusBadge({ status, type = 'rental' }) {
  const getRentalStatusColor = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'PENDING':
      case 'CHỜ DUYỆT':
        return { bg: 'rgba(107, 114, 128, 0.2)', text: '#4B5563' };
      case 'APPROVED':
      case 'ĐÃ PHÊ DUYỆT':
        return { bg: 'rgba(56, 178, 172, 0.2)', text: 'var(--color-accent-secondary)' };
      case 'REJECTED':
      case 'ĐÃ TỪ CHỐI':
        return { bg: 'rgba(239, 68, 68, 0.2)', text: '#DC2626' };
      case 'CANCELLED':
      case 'ĐÃ HỦY':
        return { bg: 'rgba(107, 114, 128, 0.2)', text: '#6B7280' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.2)', text: '#6B7280' };
    }
  };

  const getContractStatusColor = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'ACTIVE':
      case 'HOẠT ĐỘNG':
        return { bg: 'rgba(56, 178, 172, 0.2)', text: 'var(--color-accent-secondary)' };
      case 'EXPIRED':
      case 'HẾT HẠN':
        return { bg: 'rgba(251, 191, 36, 0.2)', text: '#D97706' };
      case 'TERMINATED':
      case 'ĐÃ CHẤM DỨT':
        return { bg: 'rgba(239, 68, 68, 0.2)', text: '#DC2626' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.2)', text: '#6B7280' };
    }
  };

  const colors = type === 'contract' ? getContractStatusColor(status) : getRentalStatusColor(status);
  const vietnameseStatus = getStatusVN(status);

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

  return <span style={badgeStyle}>{vietnameseStatus}</span>;
}
