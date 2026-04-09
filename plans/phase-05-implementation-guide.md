# Phase 5 Implementation Guide: Code Patterns & Templates

**Document Version:** 1.0  
**Last Updated:** 2026-04-09  
**Purpose:** Detailed code patterns, templates, and examples for implementing Neumorphic table components

---

## 📐 Component 1: NeuTable.js - Reusable Table Wrapper

### Full Component Template

```javascript
import React, { useState, useRef } from 'react';

/**
 * NeuTable - Reusable Neumorphic table component with pagination
 * 
 * Features:
 * - Pure HTML table with inline Neumorphic styles
 * - Automatic pagination (configurable rows per page)
 * - Responsive column visibility
 * - Row hover effects
 * - Search/filter integration
 * 
 * @component
 */
export default function NeuTable({
  columns = [],              // Column definitions
  rows = [],                 // Data rows
  pageSize = 10,             // Rows per page
  onRowClick = null,         // Optional row click handler
  emptyMessage = 'No data found',
  loading = false,
  currentPage = 1,           // Controlled page number
  onPageChange = () => {},   // Pagination callback
}) {
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const tableRef = useRef(null);

  // Responsive breakpoints
  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 640;
  const isTabletView = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Filter visible columns based on viewport
  const visibleColumns = columns.filter(col => {
    if (isMobileView && col.mobileVisible === false) return false;
    if (isTabletView && col.tabletVisible === false) return false;
    return col.visible !== false;
  });

  // Pagination logic
  const totalPages = Math.ceil(rows.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const paginatedRows = rows.slice(startIdx, endIdx);

  // Styles
  const tableWrapperStyle = {
    width: '100%',
    borderRadius: 'var(--radius-base)',
    boxShadow: 'var(--shadow-extruded)',
    backgroundColor: 'var(--color-background)',
    overflowX: isMobileView ? 'auto' : 'visible',
    WebkitOverflowScrolling: 'touch',
    marginBottom: '20px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'var(--color-background)',
    minWidth: isMobileView ? '800px' : 'auto'
  };

  const headerRowStyle = {
    borderBottom: 'none',
    backgroundColor: 'var(--color-background)'
  };

  const getHeaderCellStyle = (column) => ({
    padding: '16px 12px',
    textAlign: column.align || 'left',
    width: column.width || 'auto',
    fontWeight: '600',
    color: 'var(--color-foreground)',
    fontSize: '0.9rem',
    fontFamily: 'DM Sans, sans-serif',
    backgroundColor: 'var(--color-background)',
    borderRadius: column === visibleColumns[visibleColumns.length - 1] 
      ? '0 var(--radius-inner) 0 0' 
      : 'var(--radius-inner)',
    boxShadow: 'var(--shadow-extruded-small)',
    transition: 'all var(--duration-default) var(--easing-default)'
  });

  const getDataRowStyle = (rowId) => ({
    backgroundColor: hoveredRowId === rowId 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'transparent',
    transform: hoveredRowId === rowId ? 'translateY(-1px)' : 'translateY(0)',
    boxShadow: hoveredRowId === rowId 
      ? 'var(--shadow-extruded-small)' 
      : 'none',
    transition: 'all var(--duration-default) var(--easing-default)',
    cursor: onRowClick ? 'pointer' : 'default',
    borderBottom: '1px solid rgba(163, 177, 198, 0.2)'
  });

  const getDataCellStyle = (column) => ({
    padding: '14px 12px',
    textAlign: column.align || 'left',
    width: column.width || 'auto',
    color: 'var(--color-foreground)',
    fontSize: isMobileView ? '0.85rem' : '0.95rem',
    fontFamily: 'DM Sans, sans-serif',
    backgroundColor: 'transparent',
    borderBottom: 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  });

  const emptyStateStyle = {
    padding: '40px 20px',
    textAlign: 'center',
    color: 'var(--color-muted)',
    fontSize: '1rem',
    fontFamily: 'DM Sans, sans-serif'
  };

  // Loading skeleton (optional)
  if (loading) {
    return (
      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead style={headerRowStyle}>
            <tr>
              {visibleColumns.map((col) => (
                <th key={col.id} style={getHeaderCellStyle(col)}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, idx) => (
              <tr key={`skeleton-${idx}`} style={getDataRowStyle(null)}>
                {visibleColumns.map((col) => (
                  <td key={col.id} style={getDataCellStyle(col)}>
                    <div style={{
                      height: '16px',
                      backgroundColor: 'rgba(163, 177, 198, 0.2)',
                      borderRadius: '4px',
                      animation: 'pulse 2s infinite'
                    }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Empty state
  if (rows.length === 0) {
    return (
      <div style={tableWrapperStyle}>
        <div style={emptyStateStyle}>
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Table Container */}
      <div style={tableWrapperStyle} ref={tableRef}>
        <table style={tableStyle}>
          <thead style={headerRowStyle}>
            <tr>
              {visibleColumns.map((col) => (
                <th key={col.id} style={getHeaderCellStyle(col)}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row) => (
              <tr
                key={row.id}
                style={getDataRowStyle(row.id)}
                onMouseEnter={() => setHoveredRowId(row.id)}
                onMouseLeave={() => setHoveredRowId(null)}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {visibleColumns.map((col) => (
                  <td key={`${row.id}-${col.id}`} style={getDataCellStyle(col)}>
                    {col.renderCell ? col.renderCell(row) : row[col.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalCount={rows.length}
          pageSize={pageSize}
        />
      )}
    </div>
  );
}
```

### Column Configuration Example

```javascript
const rentalRequestColumns = [
  {
    id: 'id',
    label: 'Request ID',
    width: '100px',
    align: 'left',
    mobileVisible: true,
    tabletVisible: true,
    renderCell: (row) => `#${row.id}`
  },
  {
    id: 'tenant_info',
    label: 'Tenant',
    width: '120px',
    align: 'left',
    mobileVisible: false,
    tabletVisible: true,
    renderCell: (row) => row.tenant_info?.username || 'Unknown',
    visible: isAdmin // Conditional visibility
  },
  {
    id: 'zone_info',
    label: 'Zone',
    width: '100px',
    align: 'left',
    renderCell: (row) => row.zone_info?.name || '-'
  },
  {
    id: 'requested_area',
    label: 'Area (m²)',
    width: '80px',
    align: 'right',
    renderCell: (row) => row.requested_area
  },
  {
    id: 'rental_duration',
    label: 'Duration',
    width: '80px',
    align: 'right',
    mobileVisible: false,
    renderCell: (row) => `${row.rental_duration} mo.`
  },
  {
    id: 'estimated_monthly_cost',
    label: 'Monthly Cost',
    width: '120px',
    align: 'right',
    renderCell: (row) => formatPrice(row.estimated_monthly_cost)
  },
  {
    id: 'status',
    label: 'Status',
    width: '100px',
    align: 'center',
    renderCell: (row) => <StatusBadge status={row.status} statusType="rental" />
  },
  {
    id: 'requested_at',
    label: 'Requested',
    width: '120px',
    align: 'left',
    mobileVisible: false,
    tabletVisible: false,
    renderCell: (row) => new Date(row.requested_at).toLocaleDateString()
  },
  {
    id: 'actions',
    label: 'Actions',
    width: '80px',
    align: 'center',
    renderCell: (row) => (
      <button onClick={() => navigate(`/rentals/${row.id}`)}>
        View
      </button>
    )
  }
];
```

---

## 🎨 Component 2: StatusBadge.js - Status Indicator

### Full Component Template

```javascript
import React from 'react';

/**
 * StatusBadge - Neumorphic status indicator with semantic colors
 * 
 * Supports two status types:
 * - rental: PENDING, APPROVED, REJECTED, CANCELLED
 * - contract: ACTIVE, EXPIRED, TERMINATED
 * 
 * @component
 */
export default function StatusBadge({ 
  status = 'PENDING',
  statusType = 'rental',
  size = 'small'
}) {
  // Status color mapping
  const statusColorMap = {
    rental: {
      PENDING: { bg: 'var(--color-muted)', text: 'white' },
      APPROVED: { bg: 'var(--color-accent-secondary)', text: 'white' },
      REJECTED: { bg: '#E74C3C', text: 'white' },
      CANCELLED: { bg: '#95A5A6', text: 'white' }
    },
    contract: {
      ACTIVE: { bg: 'var(--color-accent-secondary)', text: 'white' },
      EXPIRED: { bg: 'var(--color-muted)', text: 'white' },
      TERMINATED: { bg: '#E74C3C', text: 'white' }
    }
  };

  const colors = statusColorMap[statusType] || statusColorMap.rental;
  const { bg, text } = colors[status] || { bg: '#95A5A6', text: 'white' };

  // Size variants
  const sizeConfig = {
    small: {
      padding: '6px 12px',
      fontSize: '0.75rem',
      borderRadius: '6px'
    },
    medium: {
      padding: '8px 16px',
      fontSize: '0.875rem',
      borderRadius: '8px'
    }
  };

  const config = sizeConfig[size] || sizeConfig.small;

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: config.padding,
    fontSize: config.fontSize,
    fontWeight: '600',
    fontFamily: 'DM Sans, sans-serif',
    color: text,
    backgroundColor: bg,
    borderRadius: config.borderRadius,
    boxShadow: 'var(--shadow-inset-small)',
    whiteSpace: 'nowrap',
    transition: 'all var(--duration-default) var(--easing-default)',
    border: `1px solid rgba(${hexToRgb(bg)}, 0.3)`,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  return (
    <span style={badgeStyle} title={`Status: ${status}`}>
      {status}
    </span>
  );
}

// Helper function: convert hex to RGB (for dynamic borders)
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
}
```

### Usage Examples

```javascript
// In RentalRequestListPage
<StatusBadge status={request.status} statusType="rental" size="small" />

// In ContractListPage
<StatusBadge status={contract.status} statusType="contract" size="small" />

// Custom size
<StatusBadge status="ACTIVE" statusType="contract" size="medium" />
```

---

## 📄 Component 3: TablePagination.js - Pagination Control

### Full Component Template

```javascript
import React from 'react';

/**
 * TablePagination - Neumorphic pagination with prev/next and page numbers
 * 
 * Features:
 * - Previous/Next navigation buttons
 * - Page number buttons with current page highlight
 * - Responsive number display (hide intermediate on mobile)
 * - Page info display (Page X of Y)
 * 
 * @component
 */
export default function TablePagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  pageSize = 10,
  totalCount = 0
}) {
  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 640;
  const isTabletView = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Calculate which page numbers to show
  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // On mobile: show current, -1, +1
    if (isMobileView) {
      const pages = [currentPage];
      if (currentPage > 1) pages.unshift(currentPage - 1);
      if (currentPage < totalPages) pages.push(currentPage + 1);
      return pages;
    }

    // On tablet/desktop: show more context
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  // Styles
  const paginationStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '24px',
    flexWrap: 'wrap'
  };

  const buttonBaseStyle = {
    padding: '8px 12px',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-foreground)',
    border: 'none',
    borderRadius: 'var(--radius-inner)',
    fontSize: '0.875rem',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all var(--duration-default) var(--easing-default)',
    boxShadow: 'var(--shadow-extruded-small)',
    minWidth: '36px',
    minHeight: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const getButtonStyle = (isActive, isDisabled) => ({
    ...buttonBaseStyle,
    backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-background)',
    color: isActive ? 'white' : 'var(--color-foreground)',
    opacity: isDisabled ? 0.5 : 1,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transform: isDisabled ? 'none' : 'none',
    ...(isActive && {
      boxShadow: 'var(--shadow-inset-small)'
    })
  });

  const infoStyle = {
    fontSize: '0.875rem',
    color: 'var(--color-muted)',
    fontFamily: 'DM Sans, sans-serif',
    marginLeft: '16px',
    whiteSpace: 'nowrap'
  };

  const handlePageClick = (page) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div style={paginationStyle}>
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        style={getButtonStyle(false, currentPage === 1)}
        title="Previous page"
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {/* Page Numbers */}
      {visiblePages.map((page, idx) => {
        if (page === '...') {
          return (
            <span key={`dots-${idx}`} style={infoStyle}>
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            style={getButtonStyle(page === currentPage, false)}
            title={`Go to page ${page}`}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        style={getButtonStyle(false, currentPage === totalPages)}
        title="Next page"
        aria-label="Next page"
      >
        Next →
      </button>

      {/* Page Info */}
      <div style={infoStyle}>
        Page {currentPage} of {totalPages}
        {totalCount > 0 && ` (${totalCount} total)`}
      </div>
    </div>
  );
}
```

---

## 🔧 Component 4: Refactored RentalRequestListPage.js

### Full Component Implementation

```javascript
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { rentalService } from '../services/rentalService';
import NeuTable from '../components/NeuTable';
import StatusBadge from '../components/StatusBadge';

export default function RentalRequestListPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const tableRef = useRef(null);
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await rentalService.getAllRequests();
      const requestList = Array.isArray(data) ? data : (data.results || []);
      setRequests(requestList);
      setError('');
    } catch (err) {
      setError('Failed to load rental requests. Please try again.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter requests based on search query
  const filteredRequests = requests.filter(request => {
    const searchLower = searchQuery.toLowerCase();
    return (
      request.id.toString().includes(searchLower) ||
      request.zone_info?.name?.toLowerCase().includes(searchLower) ||
      request.status?.toLowerCase().includes(searchLower) ||
      request.tenant_info?.username?.toLowerCase().includes(searchLower)
    );
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Column configuration
  const columns = [
    {
      id: 'id',
      label: 'Request ID',
      width: '100px',
      align: 'left',
      mobileVisible: true,
      tabletVisible: true,
      renderCell: (row) => `#${row.id}`
    },
    ...(isAdmin() ? [{
      id: 'tenant_info',
      label: 'Tenant',
      width: '120px',
      align: 'left',
      mobileVisible: false,
      tabletVisible: true,
      renderCell: (row) => row.tenant_info?.username || 'Unknown'
    }] : []),
    {
      id: 'zone_info',
      label: 'Zone',
      width: '100px',
      align: 'left',
      renderCell: (row) => row.zone_info?.name || '-'
    },
    {
      id: 'requested_area',
      label: 'Area (m²)',
      width: '100px',
      align: 'right',
      renderCell: (row) => row.requested_area
    },
    {
      id: 'rental_duration',
      label: 'Duration',
      width: '100px',
      align: 'right',
      mobileVisible: false,
      renderCell: (row) => `${row.rental_duration} months`
    },
    {
      id: 'estimated_monthly_cost',
      label: 'Monthly Cost',
      width: '140px',
      align: 'right',
      renderCell: (row) => formatPrice(row.estimated_monthly_cost)
    },
    {
      id: 'status',
      label: 'Status',
      width: '110px',
      align: 'center',
      renderCell: (row) => (
        <StatusBadge 
          status={row.status} 
          statusType="rental" 
          size="small"
        />
      )
    },
    {
      id: 'requested_at',
      label: 'Requested',
      width: '130px',
      align: 'left',
      mobileVisible: false,
      tabletVisible: false,
      renderCell: (row) => new Date(row.requested_at).toLocaleDateString('vi-VN')
    },
    {
      id: 'actions',
      label: 'Actions',
      width: '80px',
      align: 'center',
      renderCell: (row) => (
        <button
          onClick={() => navigate(`/rentals/${row.id}`)}
          style={{
            padding: '6px 12px',
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-accent)',
            border: 'none',
            borderRadius: 'var(--radius-inner)',
            fontSize: '0.85rem',
            fontWeight: '600',
            fontFamily: 'DM Sans, sans-serif',
            cursor: 'pointer',
            transition: 'all var(--duration-default) var(--easing-default)',
            boxShadow: 'var(--shadow-extruded-small)',
            minHeight: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = 'var(--shadow-extruded)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'var(--shadow-extruded-small)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          View
        </button>
      )
    }
  ];

  // Page styles
  const pageContainerStyle = {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: 'var(--color-background)',
    padding: '24px',
    fontFamily: 'DM Sans, sans-serif'
  };

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerStyle = {
    marginBottom: '24px'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    color: 'var(--color-foreground)',
    marginBottom: '8px',
    letterSpacing: '-0.02em'
  };

  const subtitleStyle = {
    fontSize: '0.95rem',
    color: 'var(--color-muted)',
    fontWeight: '400'
  };

  const controlsStyle = {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    alignItems: 'center'
  };

  const searchBarStyle = {
    flex: 1,
    minWidth: '200px',
    padding: '12px 16px',
    backgroundColor: 'var(--color-background)',
    border: 'none',
    borderRadius: 'var(--radius-base)',
    fontSize: '0.95rem',
    fontFamily: 'DM Sans, sans-serif',
    color: 'var(--color-foreground)',
    boxShadow: 'var(--shadow-inset)',
    transition: 'all var(--duration-default) var(--easing-default)'
  };

  const errorStyle = {
    padding: '16px',
    backgroundColor: '#FADBD8',
    color: '#C0392B',
    borderRadius: 'var(--radius-base)',
    marginBottom: '24px',
    fontSize: '0.95rem',
    fontFamily: 'DM Sans, sans-serif',
    boxShadow: 'var(--shadow-extruded-small)'
  };

  const loadingStyle = {
    padding: '40px 20px',
    textAlign: 'center',
    color: 'var(--color-muted)',
    fontSize: '1rem',
    fontFamily: 'DM Sans, sans-serif'
  };

  const emptyStateStyle = {
    padding: '60px 20px',
    textAlign: 'center',
    color: 'var(--color-muted)',
    fontSize: '1rem'
  };

  return (
    <div style={pageContainerStyle}>
      <div style={contentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            {isAdmin() ? 'All Rental Requests' : 'My Rental Requests'}
          </h1>
          <p style={subtitleStyle}>
            {isAdmin() 
              ? 'Manage and review all rental requests' 
              : 'View your submitted rental requests'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={errorStyle} role="alert">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div style={controlsStyle}>
          <input
            type="text"
            placeholder="Search by ID, zone, status..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            style={searchBarStyle}
            aria-label="Search rental requests"
          />
        </div>

        {/* Table or Loading/Empty State */}
        {loading ? (
          <div style={loadingStyle}>
            Loading rental requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div style={emptyStateStyle}>
            {searchQuery 
              ? `No requests match "${searchQuery}"` 
              : 'No rental requests found'}
          </div>
        ) : (
          <div ref={tableRef}>
            <NeuTable
              columns={columns}
              rows={filteredRequests}
              pageSize={10}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              emptyMessage="No rental requests found"
              loading={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🏢 Component 5: Refactored ContractListPage.js

### Full Component Implementation

```javascript
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { contractService } from '../services/contractService';
import NeuTable from '../components/NeuTable';
import StatusBadge from '../components/StatusBadge';

export default function ContractListPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const tableRef = useRef(null);
  
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState(0); // 0: All, 1: Active Only

  useEffect(() => {
    loadContracts();
  }, [filterTab]);

  const loadContracts = async () => {
    setLoading(true);
    setCurrentPage(1); // Reset page on filter change
    try {
      let data;
      if (filterTab === 0) {
        data = await contractService.getAllContracts();
      } else {
        data = isAdmin()
          ? await contractService.getAllActiveContracts()
          : await contractService.getMyActiveContracts();
      }
      
      const contractList = Array.isArray(data) ? data : (data.results || []);
      setContracts(contractList);
      setError('');
    } catch (err) {
      setError('Failed to load contracts. Please try again.');
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter contracts based on search query
  const filteredContracts = contracts.filter(contract => {
    const searchLower = searchQuery.toLowerCase();
    return (
      contract.contract_number?.toLowerCase().includes(searchLower) ||
      contract.zone_info?.name?.toLowerCase().includes(searchLower) ||
      contract.status?.toLowerCase().includes(searchLower) ||
      contract.tenant_info?.username?.toLowerCase().includes(searchLower)
    );
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTabChange = (tabIndex) => {
    setFilterTab(tabIndex);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Column configuration
  const columns = [
    {
      id: 'contract_number',
      label: 'Contract #',
      width: '120px',
      align: 'left',
      mobileVisible: true,
      tabletVisible: true,
      renderCell: (row) => row.contract_number
    },
    ...(isAdmin() ? [{
      id: 'tenant_info',
      label: 'Tenant',
      width: '130px',
      align: 'left',
      mobileVisible: false,
      tabletVisible: true,
      renderCell: (row) => row.tenant_info?.username || 'Unknown'
    }] : []),
    {
      id: 'zone_info',
      label: 'Zone',
      width: '100px',
      align: 'left',
      renderCell: (row) => row.zone_info?.name || '-'
    },
    {
      id: 'area',
      label: 'Area (m²)',
      width: '100px',
      align: 'right',
      renderCell: (row) => row.area
    },
    {
      id: 'monthly_rent',
      label: 'Monthly Rent',
      width: '140px',
      align: 'right',
      renderCell: (row) => formatPrice(row.monthly_rent)
    },
    {
      id: 'start_date',
      label: 'Start Date',
      width: '130px',
      align: 'left',
      mobileVisible: false,
      tabletVisible: true,
      renderCell: (row) => new Date(row.start_date).toLocaleDateString('vi-VN')
    },
    {
      id: 'end_date',
      label: 'End Date',
      width: '130px',
      align: 'left',
      mobileVisible: false,
      tabletVisible: true,
      renderCell: (row) => new Date(row.end_date).toLocaleDateString('vi-VN')
    },
    {
      id: 'status',
      label: 'Status',
      width: '110px',
      align: 'center',
      renderCell: (row) => (
        <StatusBadge 
          status={row.status} 
          statusType="contract" 
          size="small"
        />
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      width: '80px',
      align: 'center',
      renderCell: (row) => (
        <button
          onClick={() => navigate(`/contracts/${row.id}`)}
          style={{
            padding: '6px 12px',
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-accent)',
            border: 'none',
            borderRadius: 'var(--radius-inner)',
            fontSize: '0.85rem',
            fontWeight: '600',
            fontFamily: 'DM Sans, sans-serif',
            cursor: 'pointer',
            transition: 'all var(--duration-default) var(--easing-default)',
            boxShadow: 'var(--shadow-extruded-small)',
            minHeight: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = 'var(--shadow-extruded)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'var(--shadow-extruded-small)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          View
        </button>
      )
    }
  ];

  // Page styles
  const pageContainerStyle = {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: 'var(--color-background)',
    padding: '24px',
    fontFamily: 'DM Sans, sans-serif'
  };

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerStyle = {
    marginBottom: '24px'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    color: 'var(--color-foreground)',
    marginBottom: '8px',
    letterSpacing: '-0.02em'
  };

  const subtitleStyle = {
    fontSize: '0.95rem',
    color: 'var(--color-muted)',
    fontWeight: '400'
  };

  const tabsContainerStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    alignItems: 'center'
  };

  const getTabButtonStyle = (isActive) => ({
    padding: '10px 20px',
    backgroundColor: 'var(--color-background)',
    color: isActive ? 'white' : 'var(--color-foreground)',
    border: 'none',
    borderRadius: 'var(--radius-base)',
    fontSize: '0.95rem',
    fontWeight: '600',
    fontFamily: 'DM Sans, sans-serif',
    cursor: 'pointer',
    transition: 'all var(--duration-default) var(--easing-default)',
    boxShadow: isActive 
      ? 'var(--shadow-inset)' 
      : 'var(--shadow-extruded-small)',
    backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-background)',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const controlsStyle = {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    alignItems: 'center'
  };

  const searchBarStyle = {
    flex: 1,
    minWidth: '200px',
    padding: '12px 16px',
    backgroundColor: 'var(--color-background)',
    border: 'none',
    borderRadius: 'var(--radius-base)',
    fontSize: '0.95rem',
    fontFamily: 'DM Sans, sans-serif',
    color: 'var(--color-foreground)',
    boxShadow: 'var(--shadow-inset)',
    transition: 'all var(--duration-default) var(--easing-default)'
  };

  const errorStyle = {
    padding: '16px',
    backgroundColor: '#FADBD8',
    color: '#C0392B',
    borderRadius: 'var(--radius-base)',
    marginBottom: '24px',
    fontSize: '0.95rem',
    fontFamily: 'DM Sans, sans-serif',
    boxShadow: 'var(--shadow-extruded-small)'
  };

  const loadingStyle = {
    padding: '40px 20px',
    textAlign: 'center',
    color: 'var(--color-muted)',
    fontSize: '1rem',
    fontFamily: 'DM Sans, sans-serif'
  };

  const emptyStateStyle = {
    padding: '60px 20px',
    textAlign: 'center',
    color: 'var(--color-muted)',
    fontSize: '1rem'
  };

  return (
    <div style={pageContainerStyle}>
      <div style={contentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            {isAdmin() ? 'All Contracts' : 'My Contracts'}
          </h1>
          <p style={subtitleStyle}>
            {isAdmin()
              ? 'View and manage all rental contracts'
              : 'View your active rental contracts'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={errorStyle} role="alert">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div style={tabsContainerStyle}>
          <button
            onClick={() => handleTabChange(0)}
            style={getTabButtonStyle(filterTab === 0)}
            aria-label="View all contracts"
            aria-pressed={filterTab === 0}
          >
            All Contracts
          </button>
          <button
            onClick={() => handleTabChange(1)}
            style={getTabButtonStyle(filterTab === 1)}
            aria-label="View active contracts only"
            aria-pressed={filterTab === 1}
          >
            Active Only
          </button>
        </div>

        {/* Search Bar */}
        <div style={controlsStyle}>
          <input
            type="text"
            placeholder="Search by contract #, zone, tenant, status..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={searchBarStyle}
            aria-label="Search contracts"
          />
        </div>

        {/* Table or Loading/Empty State */}
        {loading ? (
          <div style={loadingStyle}>
            Loading contracts...
          </div>
        ) : filteredContracts.length === 0 ? (
          <div style={emptyStateStyle}>
            {searchQuery 
              ? `No contracts match "${searchQuery}"` 
              : 'No contracts found'}
          </div>
        ) : (
          <div ref={tableRef}>
            <NeuTable
              columns={columns}
              rows={filteredContracts}
              pageSize={10}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              emptyMessage="No contracts found"
              loading={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🎯 Key Implementation Notes

### 1. Import Requirements
No new imports needed beyond React and existing services.

### 2. CSS Variables
All colors, shadows, and spacing reference `globals.css` variables—no hardcoding.

### 3. Responsive Logic
Use `window.innerWidth` checks with state/hooks to detect viewport changes.

### 4. Accessibility
- Use semantic HTML (`<table>`, not `<div>`)
- Add `aria-label`, `aria-pressed`, `role` attributes
- Keyboard navigation support (buttons, links)
- Focus visible states

### 5. Performance
- Pagination limits DOM nodes (10 rows at a time)
- Search filters client-side (no API calls on every keystroke)
- Memoization not needed for current data size

### 6. Mobile Optimization
- Responsive columns hide on mobile
- Touch-friendly button sizes (min 36px/44px)
- Horizontal scroll for table overflow
- Larger text sizes on small screens

---

## ✅ Testing Checklist

After implementation, verify:

- [ ] No console errors or warnings
- [ ] Table displays on desktop, tablet, mobile
- [ ] Pagination works correctly
- [ ] Search filters real-time
- [ ] Status badges show correct colors
- [ ] Row hover effects work
- [ ] Navigation to detail pages works
- [ ] Admin/tenant views differ correctly
- [ ] Tabs filter contracts correctly
- [ ] Error states display properly
- [ ] Loading states display properly
- [ ] Empty state displays properly
- [ ] All dates formatted correctly (vi-VN locale)
- [ ] All prices formatted correctly (VND currency)
- [ ] Column visibility responsive per design
- [ ] Touch interactions work on mobile
