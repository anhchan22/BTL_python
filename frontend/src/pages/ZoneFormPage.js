import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zoneService } from '../services/zoneService';
import DashboardCard from '../components/DashboardCard';
import NeuButton from '../components/NeuButton';

export default function ZoneFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    total_area: '',
    available_area: '',
    price_per_sqm: '',
    description: '',
    amenities: '',
    is_available: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadZone();
    }
  }, [id]);

  const loadZone = async () => {
    try {
      const data = await zoneService.getZone(id);
      setFormData(data);
    } catch (err) {
      setSubmitError('Failed to load zone');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitError('');
    setLoading(true);

    try {
      if (isEdit) {
        await zoneService.updateZone(id, formData);
      } else {
        await zoneService.createZone(formData);
      }
      navigate('/zones');
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setSubmitError('Failed to save zone');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this zone?')) {
      try {
        await zoneService.deleteZone(id);
        navigate('/zones');
      } catch (err) {
        setSubmitError('Failed to delete zone');
      }
    }
  };

  // ===== STYLE DEFINITIONS =====

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: 'var(--color-background)',
    padding: 'clamp(1rem, 2vw, 2rem)'
  };

  const maxWidthWrapperStyle = {
    maxWidth: '80rem',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  const backButtonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-base)',
    border: 'none',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-foreground)',
    fontWeight: '500',
    fontSize: '0.875rem',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-inset)',
    transition: 'all 300ms ease-out',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const titleStyle = {
    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
    fontWeight: '700',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    color: 'var(--color-foreground)',
    marginBottom: '0.5rem'
  };

  const errorBoxStyle = {
    backgroundColor: '#FEE2E2',
    borderLeft: '4px solid #EF4444',
    padding: '1.5rem',
    borderRadius: 'var(--radius-base)',
    marginBottom: '2rem',
    color: '#7F1D1D',
    fontSize: '0.875rem',
    fontWeight: '500'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: 'var(--radius-base)',
    border: '1px solid var(--color-muted)',
    borderOpacity: '0.2',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-foreground)',
    fontFamily: '"DM Sans", sans-serif',
    fontSize: '0.95rem',
    boxShadow: 'var(--shadow-inset)',
    transition: 'all 300ms ease-out'
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'var(--color-foreground)',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const requiredStyle = {
    color: '#EF4444',
    fontSize: '1rem'
  };

  const fieldWrapperStyle = {
    display: 'flex',
    flexDirection: 'column'
  };

  const gridRowStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  };

  const checkboxContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 'var(--radius-base)',
    marginTop: '1rem',
    cursor: 'pointer'
  };

  const checkboxStyle = {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: 'var(--color-accent)'
  };

  const buttonContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '2rem'
  };

  const submitButtonStyle = {
    padding: '1rem 1.5rem',
    borderRadius: 'var(--radius-base)',
    border: 'none',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-extruded)',
    transition: 'all 300ms ease-out',
    fontFamily: '"DM Sans", sans-serif'
  };

  const deleteButtonStyle = {
    padding: '1rem 1.5rem',
    borderRadius: 'var(--radius-base)',
    border: 'none',
    backgroundColor: '#FEE2E2',
    color: '#7F1D1D',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-inset)',
    transition: 'all 300ms ease-out',
    fontFamily: '"DM Sans", sans-serif'
  };

  const errorTextStyle = {
    fontSize: '0.75rem',
    color: '#EF4444',
    marginTop: '0.25rem',
    fontWeight: '500'
  };

  return (
    <div style={containerStyle}>
      <div style={maxWidthWrapperStyle}>
        {/* Back Button */}
        <button
          style={backButtonStyle}
          onClick={() => navigate('/zones')}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = 'var(--shadow-inset-deep)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'var(--shadow-inset)';
          }}
        >
          ← Back to Zones
        </button>

        {/* Header */}
        <h1 style={titleStyle}>
          {isEdit ? '✏️ Edit Industrial Zone' : '➕ Add New Industrial Zone'}
        </h1>

        {/* Error Alert */}
        {submitError && <div style={errorBoxStyle}>{submitError}</div>}

        {/* Form Card */}
        <DashboardCard title={isEdit ? 'Zone Details' : 'Zone Information'} icon="🏭">
          <form style={formStyle} onSubmit={handleSubmit}>
            {/* Basic Info Row */}
            <div style={gridRowStyle}>
              <div style={fieldWrapperStyle}>
                <label style={labelStyle}>
                  Zone Name <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Industrial Zone A"
                  style={{ ...inputStyle, borderColor: errors.name ? '#EF4444' : 'var(--color-muted)' }}
                  required
                />
                {errors.name && <div style={errorTextStyle}>{errors.name[0]}</div>}
              </div>

              <div style={fieldWrapperStyle}>
                <label style={labelStyle}>
                  Location <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., District 1, Ho Chi Minh City"
                  style={{ ...inputStyle, borderColor: errors.location ? '#EF4444' : 'var(--color-muted)' }}
                  required
                />
                {errors.location && <div style={errorTextStyle}>{errors.location[0]}</div>}
              </div>
            </div>

            {/* Area & Price Row */}
            <div style={gridRowStyle}>
              <div style={fieldWrapperStyle}>
                <label style={labelStyle}>
                  Total Area (m²) <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="number"
                  name="total_area"
                  value={formData.total_area}
                  onChange={handleChange}
                  placeholder="5000"
                  style={{ ...inputStyle, borderColor: errors.total_area ? '#EF4444' : 'var(--color-muted)' }}
                  required
                />
                {errors.total_area && <div style={errorTextStyle}>{errors.total_area[0]}</div>}
              </div>

              <div style={fieldWrapperStyle}>
                <label style={labelStyle}>
                  Available Area (m²) <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="number"
                  name="available_area"
                  value={formData.available_area}
                  onChange={handleChange}
                  placeholder="3000"
                  style={{ ...inputStyle, borderColor: errors.available_area ? '#EF4444' : 'var(--color-muted)' }}
                  required
                />
                {errors.available_area && <div style={errorTextStyle}>{errors.available_area[0]}</div>}
              </div>

              <div style={fieldWrapperStyle}>
                <label style={labelStyle}>
                  Price per m²/month (USD) <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="number"
                  name="price_per_sqm"
                  value={formData.price_per_sqm}
                  onChange={handleChange}
                  placeholder="25"
                  style={{ ...inputStyle, borderColor: errors.price_per_sqm ? '#EF4444' : 'var(--color-muted)' }}
                  required
                />
                {errors.price_per_sqm && <div style={errorTextStyle}>{errors.price_per_sqm[0]}</div>}
              </div>
            </div>

            {/* Description */}
            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>
                Description <span style={requiredStyle}>*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the zone, its features, and advantages..."
                style={{
                  ...inputStyle,
                  minHeight: '120px',
                  resize: 'vertical',
                  borderColor: errors.description ? '#EF4444' : 'var(--color-muted)'
                }}
                required
              />
              {errors.description && <div style={errorTextStyle}>{errors.description[0]}</div>}
            </div>

            {/* Amenities */}
            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>Amenities</label>
              <textarea
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                placeholder="List amenities separated by lines (e.g., Security 24/7, Parking, Loading dock...)"
                style={{
                  ...inputStyle,
                  minHeight: '90px',
                  resize: 'vertical',
                  borderColor: errors.amenities ? '#EF4444' : 'var(--color-muted)'
                }}
              />
              {errors.amenities && <div style={errorTextStyle}>{errors.amenities[0]}</div>}
            </div>

            {/* Availability Checkbox */}
            <label style={checkboxContainerStyle}>
              <input
                type="checkbox"
                name="is_available"
                checked={formData.is_available}
                onChange={handleChange}
                style={checkboxStyle}
              />
              <span style={{ color: 'var(--color-foreground)', fontWeight: '500' }}>Available for Rent</span>
            </label>

            {/* Action Buttons */}
            <div style={buttonContainerStyle}>
              <button
                type="submit"
                style={submitButtonStyle}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = 'var(--color-accent-light)';
                    e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--color-accent)';
                  e.target.style.boxShadow = 'var(--shadow-extruded)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {loading ? '⏳ Saving...' : (isEdit ? '✓ Update Zone' : '✓ Create Zone')}
              </button>

              {isEdit && (
                <button
                  type="button"
                  style={deleteButtonStyle}
                  onClick={handleDelete}
                  disabled={loading}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = '#FECACA';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#FEE2E2';
                  }}
                >
                  🗑️ Delete Zone
                </button>
              )}
            </div>
          </form>
        </DashboardCard>

        {/* Info Box */}
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderLeft: '4px solid #3B82F6',
          borderRadius: 'var(--radius-base)',
          color: 'var(--color-foreground)',
          fontSize: '0.9rem',
          lineHeight: '1.6'
        }}>
          <strong>💡 Tip:</strong> Fill in all required fields marked with an asterisk (*). You can upload multiple images for the zone from the zone detail page after creating it.
        </div>
      </div>
    </div>
  );
}
