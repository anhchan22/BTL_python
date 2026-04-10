/**
 * CODE EXAMPLES - Multi-Image Upload Implementation
 *
 * This file contains complete, production-ready code examples
 * for adding multi-image upload to ZoneFormPage.js
 */

// ============================================================================
// EXAMPLE 1: Image State Management
// Location: ZoneFormPage.js - Add after line 24 (after submitError state)
// ============================================================================

const [selectedImages, setSelectedImages] = React.useState([]);
const [imageError, setImageError] = React.useState('');
const [imageLoadingState, setImageLoadingState] = React.useState({}); // For preview loading states

// ============================================================================
// EXAMPLE 2: Image File Change Handler
// Location: ZoneFormPage.js - Add after handleChange function (line 47)
// ============================================================================

const handleImageChange = (e) => {
  const files = Array.from(e.target.files);

  // Guard: No files selected
  if (files.length === 0) {
    setImageError('');
    return;
  }

  // Validation 1: Check total image count (existing + new)
  const totalImages = selectedImages.length + files.length;
  if (totalImages > 6) {
    setImageError(`Cannot select ${files.length} images. Maximum 6 total (${selectedImages.length} already selected).`);
    return;
  }

  // Validation 2: Check file types
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const invalidFiles = files.filter(f => !validTypes.includes(f.type));

  if (invalidFiles.length > 0) {
    const invalidNames = invalidFiles.map(f => f.name).join(', ');
    setImageError(`Invalid file type(s): ${invalidNames}. Only JPG, PNG, and WebP are supported.`);
    return;
  }

  // Validation 3: Check file sizes (max 5MB each)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const tooLargeFiles = files.filter(f => f.size > MAX_FILE_SIZE);

  if (tooLargeFiles.length > 0) {
    const tooLargeNames = tooLargeFiles.map(f => f.name).join(', ');
    const fileSizesMB = tooLargeFiles.map(f => (f.size / (1024 * 1024)).toFixed(1)).join(', ');
    setImageError(`File size too large: ${tooLargeNames} (${fileSizesMB} MB). Maximum 5MB per image.`);
    return;
  }

  // Validation 4: Check for duplicate file names
  const fileNames = files.map(f => f.name);
  const selectedFileNames = selectedImages.map(img => img.file.name);
  const duplicates = fileNames.filter(name => selectedFileNames.includes(name));

  if (duplicates.length > 0) {
    setImageError(`Duplicate file(s): ${duplicates.join(', ')}. Remove the existing image first.`);
    return;
  }

  // All validations passed - create previews and add to state
  const newImages = files.map(file => ({
    file,
    preview: URL.createObjectURL(file),
    name: file.name,
    size: file.size
  }));

  setSelectedImages([...selectedImages, ...newImages]);
  setImageError('');

  // Reset input so the same file can be selected again
  e.target.value = '';
};

// ============================================================================
// EXAMPLE 3: Remove Image Handler
// Location: ZoneFormPage.js - Add after handleImageChange function
// ============================================================================

const handleRemoveImage = (index) => {
  // Create new array without the removed image
  const newImages = selectedImages.filter((_, i) => i !== index);

  // Revoke the object URL to free up memory
  URL.revokeObjectURL(selectedImages[index].preview);

  // Update state
  setSelectedImages(newImages);

  // Clear any error that might be shown
  if (imageError) {
    setImageError('');
  }

  console.log(`Removed image: ${selectedImages[index].name}`);
};

// ============================================================================
// EXAMPLE 4: Cleanup Object URLs on Component Unmount
// Location: ZoneFormPage.js - Add after existing useEffect (around line 30)
// ============================================================================

React.useEffect(() => {
  // Cleanup function - runs when component unmounts or on re-renders
  return () => {
    selectedImages.forEach((img) => {
      // Revoke object URL to free memory
      URL.revokeObjectURL(img.preview);
    });
  };
}, [selectedImages]);

// ============================================================================
// EXAMPLE 5: Image Upload UI Section
// Location: ZoneFormPage.js - Add after Amenities section (after line 391)
// This is a complete replacement for that section
// ============================================================================

{/* Image Upload Section */}
<div style={fieldWrapperStyle}>
  <label style={labelStyle}>
    Zone Images
    <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', fontWeight: '400', marginLeft: '0.5rem' }}>
      (Optional - up to 6 images)
    </span>
  </label>

  {/* File Input - Hidden, triggered by label click */}
  <input
    type="file"
    multiple
    accept="image/jpeg,image/png,image/webp"
    onChange={handleImageChange}
    style={{ display: 'none' }}
    id="zoneImageUpload"
    disabled={selectedImages.length >= 6}
    aria-label="Upload zone images"
  />

  {/* Upload Zone - Click to upload or drag & drop area */}
  <label
    htmlFor="zoneImageUpload"
    style={{
      display: 'block',
      border: '2px dashed var(--color-muted)',
      borderRadius: 'var(--radius-base)',
      padding: '2rem',
      textAlign: 'center',
      cursor: selectedImages.length >= 6 ? 'not-allowed' : 'pointer',
      transition: 'all 300ms ease-out',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      opacity: selectedImages.length >= 6 ? 0.6 : 1,
      position: 'relative'
    }}
    onDragOver={(e) => {
      e.preventDefault();
      e.stopPropagation();
      if (selectedImages.length < 6) {
        e.currentTarget.style.borderColor = 'var(--color-accent)';
        e.currentTarget.style.backgroundColor = 'rgba(108, 99, 255, 0.1)';
      }
    }}
    onDragLeave={(e) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.style.borderColor = 'var(--color-muted)';
      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    }}
    onDrop={(e) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.style.borderColor = 'var(--color-muted)';
      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';

      // Trigger file input with dropped files
      if (selectedImages.length < 6) {
        const droppedFiles = e.dataTransfer.files;
        handleImageChange({ target: { files: droppedFiles, value: '' } });
      }
    }}
    onMouseEnter={(e) => {
      if (selectedImages.length < 6) {
        e.currentTarget.style.borderColor = 'var(--color-accent)';
        e.currentTarget.style.backgroundColor = 'rgba(108, 99, 255, 0.1)';
      }
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--color-muted)';
      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    }}
  >
    {/* Upload Icon & Text */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', pointerEvents: 'none' }}>
      <span style={{ fontSize: '2.5rem' }}>📸</span>
      <span style={{ fontWeight: '600', color: 'var(--color-foreground)', fontSize: '0.95rem' }}>
        Click to upload images or drag & drop
      </span>
      <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
        Supported: JPG, PNG, WebP • Max 5MB per image • Up to 6 images total
      </span>
      {selectedImages.length > 0 && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: '600', marginTop: '0.5rem' }}>
          {6 - selectedImages.length} slot{6 - selectedImages.length !== 1 ? 's' : ''} remaining
        </span>
      )}
    </div>
  </label>

  {/* Error Message */}
  {imageError && (
    <div style={{
      ...errorTextStyle,
      backgroundColor: '#FEE2E2',
      padding: '0.75rem',
      borderRadius: 'var(--radius-inner)',
      marginTop: '0.5rem',
      borderLeft: '4px solid #EF4444'
    }}>
      ⚠️ {imageError}
    </div>
  )}

  {/* Selected Images Preview Grid */}
  {selectedImages.length > 0 && (
    <div style={{
      marginTop: '1.5rem',
      padding: '1.5rem',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderRadius: 'var(--radius-base)',
      border: '1px solid rgba(59, 130, 246, 0.2)'
    }}>
      {/* Header with count */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-foreground)' }}>
          📷 Selected Images: <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>{selectedImages.length}</span>/6
        </div>
        <button
          type="button"
          onClick={() => {
            selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
            setSelectedImages([]);
            setImageError('');
          }}
          style={{
            padding: '0.25rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#EF4444',
            backgroundColor: '#FEE2E2',
            border: 'none',
            borderRadius: 'var(--radius-inner)',
            cursor: 'pointer',
            transition: 'all 200ms ease-out'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#FECACA';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#FEE2E2';
          }}
        >
          Clear all
        </button>
      </div>

      {/* Image Preview Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '1rem'
      }}>
        {selectedImages.map((img, index) => (
          <div
            key={index}
            style={{
              position: 'relative',
              aspectRatio: '1 / 1',
              borderRadius: 'var(--radius-inner)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-inset)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transition: 'all 300ms ease-out',
              cursor: 'pointer',
              group: true
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-extruded)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-inset)';
            }}
          >
            {/* Image Preview */}
            <img
              src={img.preview}
              alt={`Preview ${index + 1}: ${img.name}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />

            {/* Image Info Overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 200ms ease-out',
                opacity: 0,
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                e.currentTarget.style.opacity = '0';
              }}
            >
              {/* File info */}
              <div style={{
                color: 'white',
                fontSize: '0.65rem',
                textAlign: 'center',
                padding: '0.5rem',
                lineHeight: '1.2'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  {(img.size / (1024 * 1024)).toFixed(1)} MB
                </div>
                <div style={{ fontSize: '0.6rem', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px' }}>
                  {img.name}
                </div>
              </div>
            </div>

            {/* Index Badge */}
            <div
              style={{
                position: 'absolute',
                top: '0.5rem',
                left: '0.5rem',
                backgroundColor: 'rgba(108, 99, 255, 0.9)',
                color: 'white',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: '700',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
              }}
            >
              {index + 1}
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                color: 'white',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                transition: 'all 200ms ease-out',
                fontWeight: '700'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(239, 68, 68, 0.4)';
              }}
              title={`Remove "${img.name}"`}
              aria-label={`Remove image ${index + 1}: ${img.name}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Info text */}
      <div style={{
        fontSize: '0.75rem',
        color: 'var(--color-muted)',
        marginTop: '1rem',
        fontStyle: 'italic'
      }}>
        💡 Images will be uploaded when you submit the form. Click the ✕ button to remove an image.
      </div>
    </div>
  )}
</div>

// ============================================================================
// EXAMPLE 6: Updated Form Submission Handler
// Location: ZoneFormPage.js - Replace handleSubmit function (lines 49-71)
// ============================================================================

const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});
  setSubmitError('');
  setImageError('');
  setLoading(true);

  try {
    // Create FormData for multipart upload
    const formDataToSend = new FormData();

    // Add zone fields
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    // Add selected images
    // Note: Backend should expect 'images' as repeated field name
    // Or use 'images[]' depending on backend implementation
    selectedImages.forEach((img, index) => {
      formDataToSend.append('images', img.file);
      // Or: formDataToSend.append(`images[${index}]`, img.file);
    });

    // Log FormData contents for debugging (optional)
    console.log('Submitting form with', selectedImages.length, 'images');

    if (isEdit) {
      // For PUT requests with images, some servers may require POST with method override
      // Check your backend implementation
      await zoneService.updateZone(id, formDataToSend);
    } else {
      await zoneService.createZone(formDataToSend);
    }

    // Success - navigate away
    navigate('/zones');
  } catch (err) {
    console.error('Form submission error:', err);

    if (err.response?.data) {
      // Handle backend validation errors
      const backendErrors = err.response.data;
      setErrors(backendErrors);

      // Check for image-specific errors
      if (backendErrors.images) {
        setImageError(
          Array.isArray(backendErrors.images)
            ? backendErrors.images.join(', ')
            : backendErrors.images
        );
      }
    } else {
      setSubmitError('Failed to save zone. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

// ============================================================================
// EXAMPLE 7: Enhanced - Image Validation Summary
// Shows validation feedback before submission
// ============================================================================

// Add this helper function
const getImageValidationStatus = () => {
  if (selectedImages.length === 0) {
    return {
      isValid: false,
      message: 'At least one image is recommended for better visibility',
      type: 'warning'
    };
  }

  if (selectedImages.length > 6) {
    return {
      isValid: false,
      message: `Too many images (${selectedImages.length}). Maximum 6 allowed.`,
      type: 'error'
    };
  }

  return {
    isValid: true,
    message: `${selectedImages.length} image${selectedImages.length !== 1 ? 's' : ''} selected - ready to upload`,
    type: 'success'
  };
};

// Add before submit button (around line 407)
{selectedImages.length > 0 && (
  <div style={{
    padding: '1rem',
    borderRadius: 'var(--radius-inner)',
    marginBottom: '1rem',
    ...(() => {
      const status = getImageValidationStatus();
      return {
        backgroundColor: status.type === 'success'
          ? 'rgba(34, 197, 94, 0.1)'
          : status.type === 'error'
          ? 'rgba(239, 68, 68, 0.1)'
          : 'rgba(59, 130, 246, 0.1)',
        borderLeft: `4px solid ${
          status.type === 'success'
            ? '#22C55E'
            : status.type === 'error'
            ? '#EF4444'
            : '#3B82F6'
        }`
      };
    })()
  }}>
    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-foreground)' }}>
      {getImageValidationStatus().message}
    </div>
  </div>
)}

// ============================================================================
// EXAMPLE 8: Testing & Debugging
// Console commands to test image upload
// ============================================================================

/*
// Run in browser console while testing the form:

// 1. Check selected images in state (use React DevTools)
console.log('Check Navbar > ZoneFormPage > selectedImages in state');

// 2. Simulate file selection
const input = document.getElementById('zoneImageUpload');
const files = new DataTransfer();
// Create test files...
input.files = files.files;
input.dispatchEvent(new Event('change', { bubbles: true }));

// 3. Check FormData contents before submit
const formData = new FormData();
formData.append('test', 'value');
for (let [key, value] of formData) {
  console.log(key, ':', value);
}

// 4. Monitor file upload size
const totalSize = selectedImages.reduce((sum, img) => sum + img.size, 0);
console.log('Total upload size:', (totalSize / (1024 * 1024)).toFixed(2), 'MB');
*/

// ============================================================================
// EXPECTED API INTEGRATION
// ============================================================================

/*
POST /api/zones/
Content-Type: multipart/form-data

Request Body (FormData):
  - name: "Industrial Zone A"
  - location: "District 1"
  - total_area: "5000"
  - available_area: "3000"
  - price_per_sqm: "25"
  - description: "Description..."
  - amenities: "Security..."
  - is_available: "true"
  - images: [File, File, File, ...]

Response (201 Created):
{
  "id": 1,
  "name": "Industrial Zone A",
  ...,
  "images": [
    { "id": 1, "url": "https://api.../media/zones/1/image1.jpg" },
    { "id": 2, "url": "https://api.../media/zones/1/image2.jpg" },
    ...
  ]
}
*/
