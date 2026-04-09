import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zoneService } from '../services/zoneService';
import * as imageService from '../services/imageService';
import DashboardCard from '../components/DashboardCard';

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
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imageError, setImageError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const loadZone = useCallback(async () => {
    try {
      const data = await zoneService.getZone(id);
      setFormData(data);
      // Store existing images with full URL
      if (data.images && data.images.length > 0) {
        const existingImgs = data.images.map(img => ({
          id: img.id,
          image: img.image,
          url: img.image.startsWith('http')
            ? img.image
            : `http://127.0.0.1:8000${img.image}`,
          alt_text: img.alt_text,
          display_order: img.display_order,
          isExisting: true
        }));
        setExistingImages(existingImgs);
      }
    } catch (err) {
      setSubmitError('Failed to load zone');
    }
  }, [id]);

  useEffect(() => {
    if (isEdit) {
      loadZone();
    }
  }, [id, isEdit, loadZone]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview.url && preview.url.startsWith('blob:')) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [imagePreviews]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImageError('');

    // Calculate total images (existing + new selected + newly added)
    const totalImages = existingImages.length + selectedImages.length + files.length;

    // Validate image count - max 6 total
    if (totalImages > 6) {
      const remaining = 6 - (existingImages.length + selectedImages.length);
      setImageError(`Maximum 6 images allowed. You have ${existingImages.length + selectedImages.length} images and can add ${Math.max(0, remaining)} more.`);
      return;
    }

    // Validate each file
    const validFiles = [];
    files.forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setImageError(`${file.name} is not a valid image file`);
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageError(`${file.name} is too large (max 5MB)`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length === 0) return;

    // Create previews - use Promise.all to wait for all FileReaders
    let completedReaders = 0;
    const newPreviews = [];

    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews[index] = {
          file,
          url: reader.result,
          name: file.name,
          isExisting: false
        };
        completedReaders++;

        // Once all readers complete, update state
        if (completedReaders === validFiles.length) {
          setSelectedImages([...selectedImages, ...validFiles]);
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    // Revoke object URL if it's a blob (new image)
    if (imagePreviews[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[index].url);
    }

    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    setImageError('');
  };

  const handleRemoveExistingImage = async (imageId) => {
    try {
      setLoading(true);
      // Delete from backend
      await imageService.deleteImage(id, imageId);
      // Remove from state
      setExistingImages(existingImages.filter(img => img.id !== imageId));
      setImageError('');
    } catch (err) {
      console.error('Failed to delete image:', err);
      setImageError('Failed to delete image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitError('');
    setImageError('');
    setLoading(true);

    // Validate total images (existing + new)
    const totalImages = existingImages.length + selectedImages.length;

    // For new zones: must have at least 1 image
    if (!isEdit && totalImages === 0) {
      setImageError('Please select at least 1 image (minimum 1, maximum 6)');
      setLoading(false);
      return;
    }

    // For existing zones: must have at least 1 image total
    if (isEdit && totalImages === 0) {
      setImageError('Zone must have at least 1 image');
      setLoading(false);
      return;
    }

    // Max 6 images
    if (totalImages > 6) {
      setImageError('Maximum 6 images allowed');
      setLoading(false);
      return;
    }

    try {
      let zoneId = id;

      // Create or update zone
      if (isEdit) {
        await zoneService.updateZone(id, formData);
      } else {
        const response = await zoneService.createZone(formData);
        zoneId = response.id;
      }

      // Upload ONLY new images (not existing ones)
      if (selectedImages.length > 0 && zoneId) {
        for (let i = 0; i < selectedImages.length; i++) {
          const file = selectedImages[i];
          try {
            // Create FormData for multipart file upload
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);
            uploadFormData.append('alt_text', `Zone image ${existingImages.length + i + 1}`);
            uploadFormData.append('display_order', existingImages.length + i);

            await imageService.addImage(zoneId, uploadFormData);
          } catch (err) {
            console.error(`Failed to upload image ${i + 1}:`, err);
          }
        }
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

  // ===== IMAGE UPLOAD STYLES =====

  const imageUploadContainerStyle = {
    padding: '2rem',
    backgroundColor: 'rgba(108, 99, 255, 0.08)',
    borderRadius: 'var(--radius-base)',
    border: '2px dashed rgba(108, 99, 255, 0.3)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 300ms ease-out',
    marginTop: '1rem'
  };

  const imageUploadLabelStyle = {
    display: 'block',
    cursor: 'pointer',
    color: 'var(--color-foreground)',
    fontWeight: '600'
  };

  const imageCountStyle = {
    fontSize: '0.875rem',
    color: 'var(--color-muted)',
    marginTop: '0.5rem',
    marginBottom: '1rem'
  };

  const imageBrowseButtonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-base)',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    marginTop: '1rem',
    boxShadow: 'var(--shadow-extruded)',
    transition: 'all 300ms ease-out'
  };

  const imagePreviewGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '1rem',
    marginTop: '1.5rem'
  };

  const imagePreviewItemStyle = {
    position: 'relative',
    borderRadius: 'var(--radius-base)',
    overflow: 'hidden',
    aspectRatio: '1 / 1',
    boxShadow: 'var(--shadow-extruded-small)',
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  };

  const previewImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const removeButtonStyle = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#EF4444',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    fontWeight: 'bold',
    transition: 'all 200ms ease-out'
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

            {/* IMAGE UPLOAD SECTION */}
            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>
                Zone Images <span style={requiredStyle}>*</span> (1-6 images)
              </label>

              <div
                style={imageUploadContainerStyle}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.backgroundColor = 'rgba(108, 99, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.6)';
                }}
                onDragLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(108, 99, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.3)';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.backgroundColor = 'rgba(108, 99, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.3)';
                  handleImageSelect({ target: { files: e.dataTransfer.files } });
                }}
              >
                <label style={imageUploadLabelStyle}>
                  📸 Drop images here or click to browse
                  <div style={imageCountStyle}>
                    {existingImages.length + selectedImages.length}/6 images total ({existingImages.length} existing, {selectedImages.length} new)
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                  />
                </label>
                <button
                  type="button"
                  style={imageBrowseButtonStyle}
                  onClick={(e) => {
                    e.preventDefault();
                    e.currentTarget.parentElement.querySelector('input[type="file"]').click();
                  }}
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
                  Browse Files
                </button>
              </div>

              {imageError && <div style={errorTextStyle}>{imageError}</div>}

              {/* Image Preview Grid - Show both existing and new images */}
              {(existingImages.length > 0 || imagePreviews.length > 0) && (
                <div style={imagePreviewGridStyle}>
                  {/* Existing Images */}
                  {existingImages.map((image) => (
                    <div
                      key={`existing-${image.id}`}
                      style={imagePreviewItemStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = 'var(--shadow-extruded-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'var(--shadow-extruded-small)';
                      }}
                    >
                      <img
                        src={image.url}
                        alt={image.alt_text || 'Zone image'}
                        style={previewImageStyle}
                      />
                      <button
                        type="button"
                        style={removeButtonStyle}
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveExistingImage(image.id);
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.15)';
                          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
                        }}
                        title="Delete image from zone"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* New Images */}
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={`new-${index}`}
                      style={imagePreviewItemStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = 'var(--shadow-extruded-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'var(--shadow-extruded-small)';
                      }}
                    >
                      <img
                        src={preview.url}
                        alt={preview.name}
                        style={previewImageStyle}
                      />
                      <button
                        type="button"
                        style={removeButtonStyle}
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveImage(index);
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.15)';
                          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
                        }}
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                disabled={loading || (existingImages.length + selectedImages.length === 0)}
                onMouseEnter={(e) => {
                  if (!loading && existingImages.length + selectedImages.length > 0) {
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
          <strong>💡 Tip:</strong> Upload 1-6 images for your zone. Drag and drop files or click "Browse Files" to select images. You can preview and remove images before submitting.
        </div>
      </div>
    </div>
  );
}
