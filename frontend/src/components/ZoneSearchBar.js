import React from 'react';

/**
 * ZoneSearchBar - Neumorphic search and filter controls for zones
 * Includes search input, sort dropdown, and filter checkbox
 *
 * Features:
 * - Search by name or location
 * - Sort options (name, price, area)
 * - Filter by availability
 * - Admin-only "Add Zone" button
 * - Inline styles with CSS variables
 *
 * @param {string} searchTerm - Current search term
 * @param {function} onSearchChange - Callback for search input
 * @param {string} sortBy - Current sort field (name, price, area)
 * @param {function} onSortChange - Callback for sort dropdown
 * @param {boolean} filterAvailable - Filter by available zones
 * @param {function} onFilterChange - Callback for filter checkbox
 * @param {boolean} isAdmin - Whether user is admin
 * @param {function} onAddZone - Callback for Add Zone button
 */
export default function ZoneSearchBar({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  filterAvailable,
  onFilterChange,
  isAdmin,
  onAddZone
}) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem'
  };

  const topRowStyle = {
    display: 'flex',
    gap: 'clamp(0.5rem, 2vw, 1rem)',
    alignItems: 'center',
    flexWrap: 'wrap'
  };

  const searchInputStyle = {
    flex: 1,
    minWidth: '200px',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-base)',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-foreground)',
    border: 'none',
    fontFamily: '"DM Sans", sans-serif',
    fontSize: '1rem',
    boxShadow: 'var(--shadow-inset)',
    transition: 'all 300ms ease-out',
    outline: 'none'
  };

  const selectStyle = {
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-base)',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-foreground)',
    border: 'none',
    fontFamily: '"DM Sans", sans-serif',
    fontSize: '0.875rem',
    boxShadow: 'var(--shadow-inset)',
    transition: 'all 300ms ease-out',
    cursor: 'pointer',
    outline: 'none'
  };

  const addZoneButtonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: 'var(--radius-base)',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    border: 'none',
    fontFamily: '"DM Sans", sans-serif',
    fontWeight: '600',
    fontSize: '0.875rem',
    boxShadow: 'var(--shadow-extruded)',
    transition: 'all 300ms ease-out',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  };

  const filterRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const filterLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    userSelect: 'none',
    color: 'var(--color-foreground)',
    fontSize: '0.875rem',
    fontWeight: '500'
  };

  const checkboxStyle = {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: 'var(--color-accent)'
  };

  return (
    <div style={containerStyle}>
      {/* Search and Sort Row */}
      <div style={topRowStyle}>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={searchInputStyle}
          onFocus={(e) => {
            e.target.style.boxShadow = 'var(--shadow-inset-deep)';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'var(--shadow-inset)';
          }}
        />

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          style={selectStyle}
          onFocus={(e) => {
            e.target.style.boxShadow = 'var(--shadow-inset-deep)';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'var(--shadow-inset)';
          }}
        >
          <option value="name">Sort by: Name</option>
          <option value="price">Sort by: Price</option>
          <option value="area">Sort by: Area</option>
        </select>

        {/* Add Zone Button (Admin Only) */}
        {isAdmin && (
          <button
            style={addZoneButtonStyle}
            onClick={onAddZone}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-accent-light)';
              e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--color-accent)';
              e.target.style.boxShadow = 'var(--shadow-extruded)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ➕ Add Zone
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div style={filterRowStyle}>
        <label style={filterLabelStyle}>
          <input
            type="checkbox"
            checked={filterAvailable}
            onChange={(e) => onFilterChange(e.target.checked)}
            style={checkboxStyle}
          />
          Show available zones only
        </label>
      </div>
    </div>
  );
}
