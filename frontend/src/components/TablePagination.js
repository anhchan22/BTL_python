import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * TablePagination - Neumorphic pagination control for tables
 * Shows previous/next buttons and page numbers
 *
 * @param {number} currentPage - Current active page
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Callback when page changes
 */
export default function TablePagination({ currentPage, totalPages, onPageChange }) {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '2rem 0',
    flexWrap: 'wrap'
  };

  const buttonStyle = (isActive, isDisabled) => ({
    padding: '0.65rem 0.875rem',
    borderRadius: 'var(--radius-base)',
    border: 'none',
    backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-background)',
    color: isActive ? 'white' : 'var(--color-foreground)',
    fontWeight: isActive ? '600' : '500',
    fontSize: '0.875rem',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    boxShadow: isActive
      ? '0 20px 25px -5px rgba(108, 99, 255, 0.2), 0 10px 10px -5px rgba(108, 99, 255, 0.1)'
      : 'var(--shadow-inset)',
    transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform, box-shadow, background-color'
  });

  const infoStyle = {
    fontSize: '0.875rem',
    color: 'var(--color-foreground)',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div style={containerStyle}>
      {/* Previous Button */}
      <button
        style={buttonStyle(false, currentPage === 1)}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        onMouseEnter={(e) => {
          if (currentPage > 1) {
            e.target.style.boxShadow = '0 20px 25px -5px rgba(108, 99, 255, 0.2), 0 10px 10px -5px rgba(108, 99, 255, 0.1)';
            e.target.style.transform = 'translateY(-3px) scale(1.02)';
            e.target.style.backgroundColor = 'rgba(108, 99, 255, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.boxShadow = 'var(--shadow-inset)';
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.backgroundColor = 'var(--color-background)';
        }}
        title="Previous page"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} strokeWidth={2} style={{ marginRight: '0.3rem', display: 'inline' }} />
        Prev
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, idx) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${idx}`} style={infoStyle}>
              ...
            </span>
          );
        }
        return (
          <button
            key={page}
            style={buttonStyle(page === currentPage, false)}
            onClick={() => onPageChange(page)}
            onMouseEnter={(e) => {
              if (page !== currentPage) {
                e.target.style.boxShadow = '0 20px 25px -5px rgba(108, 99, 255, 0.2), 0 10px 10px -5px rgba(108, 99, 255, 0.1)';
                e.target.style.transform = 'translateY(-3px) scale(1.02)';
                e.target.style.backgroundColor = 'rgba(108, 99, 255, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (page !== currentPage) {
                e.target.style.boxShadow = 'var(--shadow-inset)';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.backgroundColor = 'var(--color-background)';
              }
            }}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        style={buttonStyle(false, currentPage === totalPages)}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        onMouseEnter={(e) => {
          if (currentPage < totalPages) {
            e.target.style.boxShadow = '0 20px 25px -5px rgba(108, 99, 255, 0.2), 0 10px 10px -5px rgba(108, 99, 255, 0.1)';
            e.target.style.transform = 'translateY(-3px) scale(1.02)';
            e.target.style.backgroundColor = 'rgba(108, 99, 255, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.boxShadow = 'var(--shadow-inset)';
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.backgroundColor = 'var(--color-background)';
        }}
        title="Next page"
        aria-label="Next page"
      >
        Next
        <ChevronRight size={18} strokeWidth={2} style={{ marginLeft: '0.3rem', display: 'inline' }} />
      </button>

      {/* Page Info */}
      <span style={infoStyle}>
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
