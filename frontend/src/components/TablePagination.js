import React from 'react';

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
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--radius-base)',
    border: 'none',
    backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-background)',
    color: isActive ? 'white' : 'var(--color-foreground)',
    fontWeight: isActive ? '600' : '500',
    fontSize: '0.875rem',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    boxShadow: isActive ? 'var(--shadow-extruded)' : 'var(--shadow-inset)',
    transition: 'all 300ms ease-out'
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
            e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
            e.target.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.boxShadow = 'var(--shadow-inset)';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        ← Prev
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
                e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (page !== currentPage) {
                e.target.style.boxShadow = 'var(--shadow-inset)';
                e.target.style.transform = 'translateY(0)';
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
            e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
            e.target.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.boxShadow = 'var(--shadow-inset)';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        Next →
      </button>

      {/* Page Info */}
      <span style={infoStyle}>
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
