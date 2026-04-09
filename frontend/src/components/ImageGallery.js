import React from 'react';
import ZoneImagePlaceholder from './ZoneImagePlaceholder';

export default function ImageGallery({ images, zoneId, zoneName }) {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  // Map backend image objects to display format
  // Backend returns: { id, image: "/media/zone_images/...", alt_text, display_order, created_at }
  // We need: { url, alt_text, ... }
  const mapImages = (imgs) => {
    if (!imgs || imgs.length === 0) return [];
    return imgs.map(img => ({
      id: img.id,
      url: img.image ? (img.image.startsWith('http') ? img.image : `http://127.0.0.1:8000${img.image}`) : null,
      alt_text: img.alt_text || `Zone image`,
      display_order: img.display_order
    }));
  };

  // Use images if available, otherwise show placeholder
  const mappedImages = mapImages(images);
  const hasImages = mappedImages && mappedImages.length > 0;
  const displayImages = hasImages ? mappedImages : [{ id: zoneId, url: null }];
  const currentImage = displayImages[selectedImageIndex];

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
    display: currentImage?.url ? 'block' : 'none'
  };

  const navButtonStyle = (position) => ({
    position: 'absolute',
    top: '50%',
    [position]: '1rem',
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
  });

  const thumbnailContainerStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(80px, 1fr))`,
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 'var(--radius-inner)'
  };

  const thumbnailStyle = (isActive) => ({
    aspectRatio: '1 / 1',
    borderRadius: 'var(--radius-inner)',
    cursor: 'pointer',
    border: 'none',
    padding: 0,
    overflow: 'hidden',
    boxShadow: isActive ? 'var(--shadow-inset-deep)' : 'var(--shadow-extruded-small)',
    opacity: isActive ? 1 : 0.65,
    transition: 'all 300ms ease-out',
    backgroundColor: 'var(--color-background)'
  });

  const thumbnailImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const imageCounterStyle = {
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
          <img
            src={currentImage.url}
            alt={`Zone ${selectedImageIndex + 1}`}
            style={mainImageStyle}
          />
        ) : (
          <ZoneImagePlaceholder zoneId={zoneId} zoneName={zoneName} />
        )}

        {/* Navigation Buttons */}
        {displayImages.length > 1 && (
          <>
            <button
              style={navButtonStyle('left')}
              onClick={goToPrevious}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
                e.target.style.transform = 'translateY(-50%) translateX(-4px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = 'var(--shadow-extruded)';
                e.target.style.transform = 'translateY(-50%) translateX(0)';
              }}
              title="Previous image"
              aria-label="Previous image"
            >
              ‹
            </button>

            <button
              style={navButtonStyle('right')}
              onClick={goToNext}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = 'var(--shadow-extruded-hover)';
                e.target.style.transform = 'translateY(-50%) translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = 'var(--shadow-extruded)';
                e.target.style.transform = 'translateY(-50%) translateX(0)';
              }}
              title="Next image"
              aria-label="Next image"
            >
              ›
            </button>

            {/* Image Counter */}
            <div style={imageCounterStyle}>
              {selectedImageIndex + 1} / {displayImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div style={thumbnailContainerStyle}>
          {displayImages.map((image, index) => (
            <button
              key={index}
              style={thumbnailStyle(index === selectedImageIndex)}
              onClick={() => selectImage(index)}
              onMouseEnter={(e) => {
                if (index !== selectedImageIndex) {
                  e.target.style.opacity = '0.85';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== selectedImageIndex) {
                  e.target.style.opacity = '0.65';
                }
              }}
              title={`Image ${index + 1}`}
              aria-label={`Select image ${index + 1}`}
            >
              {image.url ? (
                <img
                  src={image.url}
                  alt={`Zone thumbnail ${index + 1}`}
                  style={thumbnailImageStyle}
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
