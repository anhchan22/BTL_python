/**
 * CODE EXAMPLES - Image Gallery Integration
 *
 * This file contains complete code examples for verifying and enhancing
 * the image gallery in ZoneDetailPage.js
 */

// ============================================================================
// EXAMPLE 1: Expected Zone API Response Structure
// Location: Backend API - GET /api/zones/{id}/
// What the frontend expects to receive
// ============================================================================

{
  "id": 1,
  "name": "Industrial Zone A",
  "location": "District 1, Ho Chi Minh City",
  "total_area": 5000,
  "available_area": 3000,
  "price_per_sqm": 25,
  "description": "A premium industrial zone with modern facilities...",
  "amenities": "24/7 Security\nParking\nLoading dock\nElectric backup",
  "is_available": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:45:00Z",
  "images": [
    {
      "id": 1,
      "url": "https://api.example.com/media/zones/1/image1_abc123.jpg",
      "uploaded_at": "2024-01-15T10:35:00Z"
    },
    {
      "id": 2,
      "url": "https://api.example.com/media/zones/1/image2_def456.jpg",
      "uploaded_at": "2024-01-15T10:36:00Z"
    },
    {
      "id": 3,
      "url": "https://api.example.com/media/zones/1/image3_ghi789.jpg",
      "uploaded_at": "2024-01-15T10:37:00Z"
    }
  ]
}

// ============================================================================
// EXAMPLE 2: Verification - Current ImageGallery Integration
// Location: ZoneDetailPage.js - Line 256 (no changes needed)
// Just verifying this is correct
// ============================================================================

// Current code in ZoneDetailPage.js:
<ImageGallery images={zone.images} zoneId={zone.id} zoneName={zone.name} />

// This is CORRECT if:
// 1. zone.images is an array: [{id, url}, ...]
// 2. zoneId is the zone's numeric ID
// 3. zoneName is the zone's name string
// 4. ImageGallery component handles empty images array

// ============================================================================
// EXAMPLE 3: Current ImageGallery Implementation
// Location: frontend/src/components/ImageGallery.js (Review - NO CHANGES)
// This shows how the gallery processes the images
// ============================================================================

// Current code handles:
// ✓ Multiple images with carousel navigation
// ✓ Thumbnail grid for quick selection
// ✓ Image counter (e.g., "2 / 5")
// ✓ Placeholder when no images available
// ✓ Responsive grid layout

// Expected images prop format:
// images = [
//   { id: 1, url: 'https://...' },
//   { id: 2, url: 'https://...' }
// ]

// The component will:
// 1. Display main image (large carousel)
// 2. Show navigation buttons if > 1 image
// 3. Show thumbnail grid if > 1 image
// 4. Show placeholder if 0 images
// 5. Show image counter if > 1 image

// ============================================================================
// EXAMPLE 4: Enhanced Gallery with Loading States
// Location: ZoneDetailPage.js - Optional enhancement around line 256
// Adds better UX during image loading
// ============================================================================

// Add this state after existing zone state (line 14)
const [imageLoadingStates, setImageLoadingStates] = React.useState({});

// Add this handler function after loadZone function
const handleImageLoad = (imageId) => {
  setImageLoadingStates(prev => ({
    ...prev,
    [imageId]: 'loaded'
  }));
};

const handleImageError = (imageId) => {
  setImageLoadingStates(prev => ({
    ...prev,
    [imageId]: 'error'
  }));
};

// Then pass to ImageGallery (enhanced version):
<ImageGallery
  images={zone.images}
  zoneId={zone.id}
  zoneName={zone.name}
  onImageLoad={handleImageLoad}
  onImageError={handleImageError}
  loadingStates={imageLoadingStates}
/>

// ============================================================================
// EXAMPLE 5: Enhanced ImageGallery Component
// Location: frontend/src/components/ImageGallery.js - Optional improvement
// Adds onImageLoad/onImageError callbacks and loading indicators
// ============================================================================

import React, { useState } from 'react';
import ZoneImagePlaceholder from './ZoneImagePlaceholder';

export default function ImageGallery({
  images,
  zoneId,
  zoneName,
  onImageLoad,
  onImageError,
  loadingStates = {}
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Use images if available, otherwise show placeholder
  const hasImages = images && images.length > 0;
  const displayImages = hasImages ? images : [{ id: zoneId, url: null }];
  const currentImage = displayImages[selectedImageIndex];
  const currentImageLoadingState = loadingStates[currentImage?.id];

  // ===== STYLE DEFINITIONS =====

  const galleryContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    borderRadius: 'var(--radius-base)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-extruded)',
    backgroundColor: 'var(--color-background)'
  };

  const mainImageContainerStyle = {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 'var(--radius-base)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const mainImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: currentImage?.url && currentImageLoadingState !== 'loading' ? 'block' : 'none',
    opacity: currentImageLoadingState === 'error' ? 0 : 1,
    transition: 'opacity 300ms ease-out'
  };

  const loadingIndicatorStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: currentImageLoadingState === 'loading' ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    animation: 'spin 1s linear infinite'
  };

  // ===== HANDLERS =====

  const goToPrevious = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const selectImage = (index) => {
    setSelectedImageIndex(index);
  };

  return (
    <div style={galleryContainerStyle}>
      {/* Main Image with Navigation */}
      <div style={mainImageContainerStyle}>
        {currentImage?.url ? (
          <>
            <img
              src={currentImage.url}
              alt={`Zone ${selectedImageIndex + 1}`}
              style={mainImageStyle}
              onLoad={() => onImageLoad?.(currentImage.id)}
              onError={() => onImageError?.(currentImage.id)}
            />

            {/* Loading Indicator */}
            {currentImageLoadingState === 'loading' && (
              <div style={loadingIndicatorStyle}>⏳</div>
            )}

            {/* Error State */}
            {currentImageLoadingState === 'error' && (
              <div style={{
                textAlign: 'center',
                color: 'var(--color-muted)',
                padding: '2rem'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❌</div>
                <div style={{ fontSize: '0.875rem' }}>
                  Failed to load image
                </div>
              </div>
            )}
          </>
        ) : (
          <ZoneImagePlaceholder zoneId={zoneId} zoneName={zoneName} />
        )}

        {/* Navigation Buttons */}
        {displayImages.length > 1 && (
          <>
            <button
              style={{
                position: 'absolute',
                top: '50%',
                left: '1rem',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
                fontSize: '1.5rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-extruded)',
                transition: 'all 300ms ease-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
              onClick={goToPrevious}
              title="Previous image"
              aria-label="Previous image"
            >
              ‹
            </button>

            <button
              style={{
                position: 'absolute',
                top: '50%',
                right: '1rem',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
                fontSize: '1.5rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-extruded)',
                transition: 'all 300ms ease-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
              onClick={goToNext}
              title="Next image"
              aria-label="Next image"
            >
              ›
            </button>

            {/* Image Counter */}
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-inner)',
                fontSize: '0.75rem',
                fontWeight: '600',
                backdropFilter: 'blur(4px)',
                zIndex: 5
              }}
            >
              {selectedImageIndex + 1} / {displayImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(80px, 1fr))`,
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-inner)'
        }}>
          {displayImages.map((image, index) => (
            <button
              key={index}
              style={{
                aspectRatio: '1 / 1',
                borderRadius: 'var(--radius-inner)',
                cursor: 'pointer',
                border: 'none',
                padding: 0,
                overflow: 'hidden',
                boxShadow: index === selectedImageIndex ? 'var(--shadow-inset-deep)' : 'var(--shadow-extruded-small)',
                opacity: index === selectedImageIndex ? 1 : 0.65,
                transition: 'all 300ms ease-out',
                backgroundColor: 'var(--color-background)'
              }}
              onClick={() => selectImage(index)}
              title={`Image ${index + 1}`}
              aria-label={`Select image ${index + 1}`}
            >
              {image.url ? (
                <img
                  src={image.url}
                  alt={`Zone thumbnail ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)'
                  }}
                >
                  🏭
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Image Gallery Error Handling
// Location: ZoneDetailPage.js - Enhanced error handling around loadZone
// ============================================================================

const loadZone = async () => {
  try {
    const data = await zoneService.getZone(id);

    // Validate images array exists and is an array
    if (!Array.isArray(data.images)) {
      console.warn('Images is not an array:', data.images);
      data.images = [];
    }

    // Validate each image has required fields
    data.images = data.images.filter(img => {
      if (!img.id || !img.url) {
        console.warn('Image missing required fields:', img);
        return false;
      }
      return true;
    });

    setZone(data);
  } catch (err) {
    console.error('Failed to load zone:', err);
    setError('Failed to load zone details. Please try again.');
  } finally {
    setLoading(false);
  }
};

// ============================================================================
// EXAMPLE 7: Image Gallery Testing
// Console commands to test the gallery
// ============================================================================

/*
// Run in browser console while viewing zone detail:

// 1. Check zone data structure
// Open React DevTools > ZoneDetailPage > zone state

// 2. Manually test images array
fetch('/api/zones/1/')
  .then(r => r.json())
  .then(zone => {
    console.log('Zone data:', zone);
    console.log('Images:', zone.images);
    console.log('Image count:', zone.images?.length || 0);
  });

// 3. Test individual image loading
const testImage = new Image();
testImage.onload = () => console.log('Image loaded successfully');
testImage.onerror = () => console.log('Failed to load image');
testImage.src = zone.images[0].url;

// 4. Monitor gallery re-renders
// Add console.log at start of ImageGallery component

// 5. Check thumbnail grid responsiveness
// Resize window and watch grid adjust
// Should show different number of columns on mobile
*/

// ============================================================================
// EXAMPLE 8: Responsive Gallery CSS
// Location: globals.css - Add for responsive image gallery
// ============================================================================

/*
Add to globals.css if not using inline styles:

@media (max-width: 768px) {
  [data-gallery-container] {
    gap: 0.75rem;
  }

  [data-gallery-thumbnail-grid] {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 0.5rem;
  }

  [data-gallery-nav-button] {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  [data-gallery-thumbnail-grid] {
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    gap: 0.375rem;
  }

  [data-gallery-nav-button] {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
}
*/

// ============================================================================
// EXAMPLE 9: Integration Checklist
// Verify all pieces are working together correctly
// ============================================================================

/*
INTEGRATION CHECKLIST:

Frontend:
✓ ZoneDetailPage.js line 256 passes zone.images to ImageGallery
✓ ImageGallery.js accepts images prop and handles array
✓ ImageGallery.js shows placeholder when images empty
✓ ImageGallery.js shows carousel when images exist
✓ Navigation buttons work (previous/next)
✓ Thumbnail grid selects images
✓ Image counter displays (e.g., "2 / 5")

Backend API:
✓ GET /api/zones/{id}/ returns zone object
✓ zone.images is an array: [{ id, url }, ...]
✓ image.url is a valid, absolute URL
✓ Images are accessible (CORS configured if needed)

Performance:
✓ Image URLs are optimized size/resolution
✓ No broken image links
✓ Loading times < 2 seconds per image
✓ Thumbnail loading lazy if possible

Responsive Design:
✓ Desktop (1920px): all images visible
✓ Tablet (768px): images scale appropriately
✓ Mobile (480px): thumbnail grid adjusts
✓ Touch navigation works on mobile
*/

// ============================================================================
// EXAMPLE 10: Advanced - Keyboard Navigation
// Location: ZoneDetailPage.js - Optional enhancement
// Add keyboard support for gallery navigation
// ============================================================================

// Add to ImageGallery component
React.useEffect(() => {
  const handleKeyPress = (e) => {
    if (displayImages.length <= 1) return;

    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [selectedImageIndex, displayImages.length]);

// Now users can navigate gallery with arrow keys:
// ← Previous image
// → Next image
