# Implementation Plan: Notification Badge, Multi-Image Upload, Image Gallery

**Status:** Planning | **Priority:** High | **Estimated Duration:** 4-6 hours

## Overview

This plan covers three interconnected UI feature implementations for the Industrial Zone Rental system:
1. **Notification Badge with Polling** in Navbar.js - Real-time unread count display
2. **Multi-Image Upload** in ZoneFormPage.js - Support for up to 6 zone images
3. **Image Gallery Enhancement** in ZoneDetailPage.js - Use real API images in carousel

## Key Constraints

- ✅ 100% inline React styles (NO Tailwind, NO MUI)
- ✅ CSS variables for all colors/shadows (from globals.css)
- ✅ Neumorphism design system consistency
- ✅ Pure JavaScript, no TypeScript
- ✅ Preserve all existing API integration logic
- ✅ No external UI component libraries

## Technical Approach

### 1. Notification Badge with Polling (Navbar.js)

**Functionality:**
- Display unread notification count on user profile button
- 30-second polling interval to fetch unread count
- Badge only visible if count > 0
- "Popping out" neumorphic animation

**Implementation Details:**
- Add state hook for unread count
- Use useEffect with setInterval for polling
- Create REST endpoint call: `GET /notifications/unread-count/`
- Style badge with inline neumorphic popup style
- Animate on count change

**Code Location:**
- File: `frontend/src/components/Navbar.js`
- Affected lines: After line 8 (state), before render return (~50 new lines)

**API Integration:**
- Endpoint: `GET /api/notifications/unread-count/`
- Response format: `{ "unread_count": 3 }`
- Poll interval: 30 seconds
- Cleanup: Clear interval on unmount

---

### 2. Multi-Image Upload (ZoneFormPage.js)

**Functionality:**
- File input accepting up to 6 images (jpg, png, webp)
- Preview grid showing selected image thumbnails
- Display total selected image count
- Remove individual images before submission
- Validation: 0 < images ≤ 6 before form submission
- Modal/preview on thumbnail click (optional enhancement)

**Implementation Details:**
- Add images state: `[{ file, preview }, ...]`
- Implement file input change handler with validation
- Generate object URLs for preview display
- Grid layout: max 6 columns
- Submit: use FormData multipart to attach images
- Inline neumorphic styling for upload UI

**Code Location:**
- File: `frontend/src/pages/ZoneFormPage.js`
- Affected lines: 
  - State: line 12-21 (add images state)
  - Handlers: after line 47 (add file handlers)
  - Form: after Amenities section (~120 new lines)
  - Submit: update line 49-70 (FormData multipart)

**API Integration:**
- On form submit: wrap formData with images
- Endpoint: `POST /api/zones/` or `PUT /api/zones/{id}/` (multipart/form-data)
- Backend should accept: `images[]` field with multiple files
- Response includes: `images` array with uploaded image URLs

---

### 3. Image Gallery Enhancement (ZoneDetailPage.js)

**Functionality:**
- Map backend `zone.images` array to gallery carousel
- Use real images from API response
- Maintain existing navigation and thumbnail functionality
- Handle empty image array gracefully (show placeholder)

**Implementation Details:**
- No code changes needed if backend already returns images array
- Verify ImageGallery.js receives and processes `zone.images` correctly
- Images array format expected: `[{ id, url }, ...]`
- Ensure carousel works with 0-6 images

**Code Location:**
- File: `frontend/src/components/ImageGallery.js` (verify only, minimal changes)
- File: `frontend/src/pages/ZoneDetailPage.js` (verify integration line 256)
- Backend API response structure critical

---

## Implementation Steps

### Phase 1: Backend API Preparation (if needed)
- [ ] Add `/notifications/unread-count/` endpoint
- [ ] Ensure `/zones/` accepts multipart image upload
- [ ] Verify `/zones/{id}/` returns `images` array

### Phase 2: Notification Badge Implementation
1. [ ] Add notification polling state and useEffect
2. [ ] Create notification fetch function
3. [ ] Style badge with neumorphic design
4. [ ] Implement "pop out" animation
5. [ ] Test 30-second polling

### Phase 3: Multi-Image Upload Implementation
1. [ ] Add image state management
2. [ ] Create file input handler with validation
3. [ ] Implement preview grid layout
4. [ ] Add remove image functionality
5. [ ] Update form submission with FormData
6. [ ] Test file validation (0 < images ≤ 6)

### Phase 4: Gallery Integration Verification
1. [ ] Verify ImageGallery receives images array
2. [ ] Test carousel with multiple images
3. [ ] Test placeholder fallback with 0 images
4. [ ] Verify thumbnail grid functionality

### Phase 5: Testing & Refinement
1. [ ] Unit test notification polling
2. [ ] Test image upload validation
3. [ ] Test gallery carousel navigation
4. [ ] Responsive design testing (mobile)
5. [ ] Accessibility testing (keyboard nav)

---

## Code Examples

### Example 1: Notification Badge Hook

```javascript
// In Navbar.js after line 8
const [unreadCount, setUnreadCount] = React.useState(0);
const [pollInterval, setPollInterval] = React.useState(null);

React.useEffect(() => {
  // Fetch unread count immediately
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/notifications/unread-count/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unread_count || 0);
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  // Fetch immediately on mount
  fetchUnreadCount();

  // Set up polling interval (30 seconds)
  const interval = setInterval(fetchUnreadCount, 30000);
  setPollInterval(interval);

  // Cleanup on unmount
  return () => {
    if (interval) {
      clearInterval(interval);
    }
  };
}, []);
```

### Example 2: Notification Badge Component

```javascript
// Add notification badge element in user menu (around line 295)
{unreadCount > 0 && (
  <div
    style={{
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      backgroundColor: '#EF4444',
      color: 'white',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.7rem',
      fontWeight: '700',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.5), ' +
                 '-4px -4px 8px rgba(255, 255, 255, 0.3)',
      animation: 'badgePopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      zIndex: 20
    }}
  >
    {unreadCount > 99 ? '99+' : unreadCount}
  </div>
)}

// Add animation to globals.css or inline style
<style>{`
  @keyframes badgePopIn {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`}</style>
```

### Example 3: Multi-Image Upload State & Handlers

```javascript
// In ZoneFormPage.js after line 24
const [selectedImages, setSelectedImages] = React.useState([]);
const [imageError, setImageError] = React.useState('');

// Add after handleChange function
const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  
  // Validation
  if (selectedImages.length + files.length > 6) {
    setImageError('Maximum 6 images allowed');
    return;
  }

  if (files.length === 0) {
    setImageError('');
    return;
  }

  // Validate file types
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const invalidFiles = files.filter(f => !validTypes.includes(f.type));
  
  if (invalidFiles.length > 0) {
    setImageError('Only JPG, PNG, and WebP images are supported');
    return;
  }

  // Validate file sizes (max 5MB each)
  const toolargeFiles = files.filter(f => f.size > 5 * 1024 * 1024);
  if (toolargeFiles.length > 0) {
    setImageError('Images must be smaller than 5MB');
    return;
  }

  // Create previews and add to state
  const newImages = files.map(file => ({
    file,
    preview: URL.createObjectURL(file)
  }));

  setSelectedImages([...selectedImages, ...newImages]);
  setImageError('');
  e.target.value = ''; // Reset input
};

const handleRemoveImage = (index) => {
  const newImages = selectedImages.filter((_, i) => i !== index);
  // Revoke object URL to free memory
  URL.revokeObjectURL(selectedImages[index].preview);
  setSelectedImages(newImages);
};

// Cleanup on unmount
React.useEffect(() => {
  return () => {
    selectedImages.forEach(img => {
      URL.revokeObjectURL(img.preview);
    });
  };
}, []);
```

### Example 4: Multi-Image Upload UI

```javascript
// Add after Amenities section (around line 391)
{/* Image Upload Section */}
<div style={fieldWrapperStyle}>
  <label style={labelStyle}>Zone Images (Optional)</label>
  <div style={{
    border: '2px dashed var(--color-muted)',
    borderRadius: 'var(--radius-base)',
    padding: '2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 300ms ease-out',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }}>
    <input
      type="file"
      multiple
      accept="image/jpeg,image/png,image/webp"
      onChange={handleImageChange}
      style={{ display: 'none' }}
      id="imageUpload"
      disabled={selectedImages.length >= 6}
    />
    <label 
      htmlFor="imageUpload"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: selectedImages.length >= 6 ? 'not-allowed' : 'pointer',
        opacity: selectedImages.length >= 6 ? 0.6 : 1
      }}
    >
      <span style={{ fontSize: '2rem' }}>📸</span>
      <span style={{ fontWeight: '600' }}>
        Click to upload images or drag & drop
      </span>
      <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
        JPG, PNG, or WebP (Max 5MB each) • Up to 6 images
      </span>
    </label>
  </div>

  {imageError && (
    <div style={errorTextStyle}>{imageError}</div>
  )}

  {selectedImages.length > 0 && (
    <div style={{
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderRadius: 'var(--radius-inner)'
    }}>
      <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
        Selected Images: {selectedImages.length}/6
      </div>
      
      {/* Image Preview Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: '0.75rem'
      }}>
        {selectedImages.map((img, index) => (
          <div key={index} style={{
            position: 'relative',
            aspectRatio: '1',
            borderRadius: 'var(--radius-inner)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-inset)',
            cursor: 'pointer',
            transition: 'all 300ms ease-out'
          }}>
            <img
              src={img.preview}
              alt={`Preview ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            
            {/* Remove Button */}
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                color: 'white',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                transition: 'all 200ms ease-out'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
              }}
              title="Remove image"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
```

### Example 5: Updated Form Submission

```javascript
// Update handleSubmit function (around line 49)
const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});
  setSubmitError('');
  
  // Validate images
  if (selectedImages.length === 0) {
    setImageError('At least one image is required');
    return;
  }
  
  setLoading(true);

  try {
    const submitData = new FormData();
    
    // Add form fields
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    // Add images
    selectedImages.forEach((img, index) => {
      submitData.append(`images`, img.file);
    });

    if (isEdit) {
      await zoneService.updateZone(id, submitData);
    } else {
      await zoneService.createZone(submitData);
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
```

### Example 6: Image Gallery Verification

```javascript
// ImageGallery.js - Already handles images array correctly
// Just verify the images prop format in ZoneDetailPage.js:
// Line 256: <ImageGallery images={zone.images} zoneId={zone.id} zoneName={zone.name} />

// Expected zone object from API:
// {
//   id: 1,
//   name: "Industrial Zone A",
//   location: "District 1, HCMC",
//   images: [
//     { id: 1, url: "https://..../image1.jpg" },
//     { id: 2, url: "https://..../image2.jpg" },
//     ...
//   ],
//   ...
// }
```

---

## Testing Checklist

### Notification Badge Tests
- [ ] Badge appears on navbar when unread_count > 0
- [ ] Badge hides when unread_count = 0
- [ ] Polling fetches every 30 seconds (monitor network tab)
- [ ] Badge count updates when unread messages received
- [ ] Animation triggers on count change (pop in effect)
- [ ] Cleanup: interval clears on component unmount
- [ ] Display format: shows "99+" for counts > 99
- [ ] Mobile: badge position correct on smaller screens

### Image Upload Tests
- [ ] File input accepts only jpg/png/webp
- [ ] Preview generates for each selected image
- [ ] Grid displays max 6 thumbnails
- [ ] Remove button deletes image from preview
- [ ] Counter updates: "Selected Images: X/6"
- [ ] Error message shown for:
  - More than 6 images selected
  - File types not jpg/png/webp
  - File size > 5MB
- [ ] Submit validation: requires 0 < images ≤ 6
- [ ] FormData correctly sends files multipart
- [ ] After upload, user redirected to zones list
- [ ] Images persist on zone detail page after upload
- [ ] Edit zone: existing images shown in gallery
- [ ] Mobile: drag & drop works on mobile (if supported)

### Image Gallery Tests
- [ ] Gallery displays images from API response
- [ ] Carousel navigation works with multiple images
- [ ] Thumbnail grid shows all images
- [ ] Image counter updates during navigation
- [ ] Placeholder shows when no images available
- [ ] Images load correctly from backend URLs
- [ ] Responsive: gallery adapts to screen size
- [ ] Keyboard navigation works (arrow keys, Enter)
- [ ] Mobile: touch gestures work (swipe)

### Accessibility Tests
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] ARIA labels on buttons and inputs
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader announces badge count changes
- [ ] Error messages announced by screen readers

### Performance Tests
- [ ] Notification polling doesn't block UI
- [ ] Image preview generation doesn't lag
- [ ] Gallery carousel smooth scrolling/navigation
- [ ] Memory cleanup: object URLs revoked after removal
- [ ] No memory leaks on component unmount
- [ ] Bundle size impact minimal (< 10KB gzip)

---

## API Requirements Checklist

### Backend API Endpoints Needed
- [ ] `GET /api/notifications/unread-count/` → Returns `{ "unread_count": N }`
- [ ] `POST /api/zones/` → Accept multipart form with images[]
- [ ] `PUT /api/zones/{id}/` → Accept multipart form with images[]
- [ ] `GET /api/zones/{id}/` → Return zone with `images` array

### Expected Image Array Format
```json
{
  "id": 1,
  "images": [
    {
      "id": 1,
      "url": "https://api.example.com/media/zones/1/image1.jpg"
    },
    {
      "id": 2,
      "url": "https://api.example.com/media/zones/1/image2.jpg"
    }
  ]
}
```

---

## Design System Compliance

All implementations follow **Neumorphism Design System** from `globals.css`:

### Color Palette Used
- **Badge**: `#EF4444` (error/notification red)
- **Backgrounds**: `var(--color-background)` (#E0E5EC)
- **Text**: `var(--color-foreground)` (#3D4852)
- **Accent**: `var(--color-accent)` (#6C63FF)

### Shadow Styles Used
- **Extruded (Raised)**: `var(--shadow-extruded)` - buttons, cards
- **Inset (Pressed)**: `var(--shadow-inset)` - input wells, thumbnails
- **Inset Deep**: `var(--shadow-inset-deep)` - deep carved elements

### Border Radius Used
- **Container**: `var(--radius-container)` (32px) - cards
- **Base**: `var(--radius-base)` (16px) - buttons, thumbnails
- **Inner**: `var(--radius-inner)` (12px) - small elements

### Animations Used
- **Pop In**: cubic-bezier(0.34, 1.56, 0.64, 1) - notification badge
- **Smooth Transitions**: 300ms ease-out - all hover states

---

## Files to Modify

| File | Changes | Lines | Priority |
|------|---------|-------|----------|
| `Navbar.js` | Add notification polling, badge UI | +50 | High |
| `ZoneFormPage.js` | Add image upload, state, handlers | +120 | High |
| `ImageGallery.js` | Verify integration (no changes) | 0 | Info |
| `ZoneDetailPage.js` | Verify integration (no changes) | 0 | Info |
| `globals.css` | Add badge animation (optional) | +15 | Low |

---

## Success Criteria

- ✅ Notification badge displays unread count, updates every 30s
- ✅ Multi-image upload validates 0 < images ≤ 6 before submit
- ✅ Image gallery displays real images from API response
- ✅ All inline styles use CSS variables from design system
- ✅ No external UI libraries (Tailwind, MUI)
- ✅ 100% functionality without TypeScript
- ✅ Preserve all existing API logic
- ✅ Neumorphic design consistency throughout
- ✅ Mobile responsive (tested on 320px - 1920px)
- ✅ Accessibility compliant (keyboard nav, ARIA labels)

---

## Implementation Order

1. **Phase 1:** Verify backend API endpoints ready
2. **Phase 2:** Implement notification polling (Navbar.js)
3. **Phase 3:** Implement image upload (ZoneFormPage.js)
4. **Phase 4:** Verify gallery integration (ImageGallery.js)
5. **Phase 5:** Test & refine across all features
6. **Phase 6:** Deploy to staging & QA testing

**Total Estimated Time:** 4-6 hours (including testing)

---

## Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| API endpoint missing | Verify endpoints exist before coding |
| File upload security | Validate types/sizes on frontend + backend |
| Memory leaks (object URLs) | Explicit cleanup on unmount + removal |
| Performance (polling) | Use 30s interval, abort on unmount |
| Browser compatibility | Test on Chrome, Firefox, Safari, Edge |
| Mobile responsiveness | Test on iPhone, Android devices |

---

## Notes

- **Polling Optimization:** Consider using WebSocket/Server-Sent Events in future for real-time updates
- **Image Optimization:** Backend should compress/resize images to reasonable dimensions
- **Drag & Drop:** Can be added as enhancement using HTML5 drag-drop API
- **Image Cropping:** Can be added as enhancement with canvas/crop library
- **Batch Operations:** Future: Allow editing all images for a zone from detail page

