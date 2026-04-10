# Quick Reference Guide: Copy-Paste Implementation

**Use this guide for quick code insertion into your project.**

---

## 🎯 At a Glance

| Feature | File | Lines | Estimated Time |
|---------|------|-------|-----------------|
| Notification Badge | Navbar.js | +50 | 30 min |
| Image Upload | ZoneFormPage.js | +120 | 45 min |
| Gallery Integration | ImageGallery.js | +0 (verify) | 15 min |
| **Total** | | **+170** | **1.5 hours** |

---

## 📍 Navbar.js - Notification Badge

### Location: After line 8 (after `menuOpen` state)

```javascript
// ADD STATE
const [unreadCount, setUnreadCount] = React.useState(0);

// ADD POLLING EFFECT
React.useEffect(() => {
  if (!user) return;
  
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notifications/unread-count/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unread_count || 0);
      }
    } catch (err) {
      console.error('Notification fetch failed:', err);
    }
  };
  
  fetchUnreadCount();
  const interval = setInterval(fetchUnreadCount, 30000);
  return () => clearInterval(interval);
}, [user]);
```

### Location: Before user button (line 295)

```javascript
{/* NOTIFICATION BADGE - ADD BEFORE EXISTING USER BUTTON */}
{unreadCount > 0 && (
  <div style={{
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#EF4444',
    color: 'white',
    minWidth: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.65rem',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.5)',
    zIndex: 20,
    animation: 'notificationBadgePopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    paddingLeft: unreadCount > 99 ? 0 : '2px',
    paddingRight: unreadCount > 99 ? 0 : '2px'
  }}>
    {unreadCount > 99 ? '99+' : unreadCount}
  </div>
)}

{/* ADD ANIMATION CSS */}
<style>{`
  @keyframes notificationBadgePopIn {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); opacity: 1; }
  }
`}</style>
```

---

## 📍 ZoneFormPage.js - Image Upload

### Location: After line 24 (after `submitError` state)

```javascript
const [selectedImages, setSelectedImages] = React.useState([]);
const [imageError, setImageError] = React.useState('');

// CLEANUP EFFECT
React.useEffect(() => {
  return () => {
    selectedImages.forEach(img => {
      URL.revokeObjectURL(img.preview);
    });
  };
}, [selectedImages]);
```

### Location: After `handleChange` function (line ~47)

```javascript
const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;
  
  // Validation
  if (selectedImages.length + files.length > 6) {
    setImageError('Maximum 6 images allowed');
    return;
  }
  
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const invalid = files.filter(f => !validTypes.includes(f.type));
  if (invalid.length > 0) {
    setImageError('Only JPG, PNG, WebP supported');
    return;
  }
  
  const MAX_SIZE = 5 * 1024 * 1024;
  const tooLarge = files.filter(f => f.size > MAX_SIZE);
  if (tooLarge.length > 0) {
    setImageError('Max 5MB per image');
    return;
  }
  
  // Add images
  const newImages = files.map(file => ({
    file,
    preview: URL.createObjectURL(file),
    name: file.name,
    size: file.size
  }));
  
  setSelectedImages([...selectedImages, ...newImages]);
  setImageError('');
  e.target.value = '';
};

const handleRemoveImage = (index) => {
  URL.revokeObjectURL(selectedImages[index].preview);
  setSelectedImages(selectedImages.filter((_, i) => i !== index));
};
```

### Location: After Amenities section (line ~391)

```javascript
{/* IMAGE UPLOAD SECTION */}
<div style={fieldWrapperStyle}>
  <label style={labelStyle}>Zone Images (Optional)</label>
  
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
      display: 'block',
      border: '2px dashed var(--color-muted)',
      borderRadius: 'var(--radius-base)',
      padding: '2rem',
      textAlign: 'center',
      cursor: selectedImages.length >= 6 ? 'not-allowed' : 'pointer',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      opacity: selectedImages.length >= 6 ? 0.6 : 1,
      transition: 'all 300ms ease-out'
    }}
  >
    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
      Click to upload or drag & drop
    </div>
    <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
      JPG, PNG, WebP • Max 5MB • Up to 6 images
    </div>
  </label>
  
  {imageError && (
    <div style={{ ...errorTextStyle, marginTop: '0.5rem', color: '#EF4444' }}>
      ⚠️ {imageError}
    </div>
  )}
  
  {selectedImages.length > 0 && (
    <div style={{
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderRadius: 'var(--radius-base)'
    }}>
      <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
        Selected: {selectedImages.length}/6
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: '0.75rem'
      }}>
        {selectedImages.map((img, i) => (
          <div key={i} style={{
            position: 'relative',
            aspectRatio: '1',
            borderRadius: 'var(--radius-inner)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-inset)'
          }}>
            <img
              src={img.preview}
              alt={`Preview ${i}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(i)}
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#EF4444',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}
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

### Location: Replace `handleSubmit` function (line ~49)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});
  setSubmitError('');
  setLoading(true);

  try {
    const formDataToSend = new FormData();
    
    // Add zone fields
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    // Add images
    selectedImages.forEach(img => {
      formDataToSend.append('images', img.file);
    });
    
    if (isEdit) {
      await zoneService.updateZone(id, formDataToSend);
    } else {
      await zoneService.createZone(formDataToSend);
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

---

## 📍 ImageGallery.js - Verification (No Changes Needed)

### Verify This Exists (Line 256 in ZoneDetailPage.js)

```javascript
<ImageGallery images={zone.images} zoneId={zone.id} zoneName={zone.name} />
```

If `zone.images` is an array with `{id, url}` objects, you're done! ✅

---

## ✅ Testing Checklist

### Before Merging

```javascript
// Test Notification Polling
// 1. Open DevTools → Network tab
// 2. Look for requests to /api/notifications/unread-count/
// 3. Should see a request every 30 seconds
// 4. Check that badge count updates

// Test Image Upload
// 1. Navigate to /zones/new
// 2. Try uploading 7 images → Should show error
// 3. Try uploading 10MB file → Should show error
// 4. Upload 3 valid images
// 5. Submit form → Check network tab for multipart upload
// 6. Verify images appear in gallery on detail page

// Test Gallery
// 1. Go to zone detail page
// 2. Check images display in carousel
// 3. Click prev/next buttons
// 4. Click thumbnail grid items
// 5. Verify counter updates (e.g., "2 / 5")
// 6. Test on mobile (should be responsive)
```

---

## 🔧 API Requirements Checklist

Before implementing, verify these endpoints exist:

```bash
# Test notification endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/notifications/unread-count/
# Expected response: { "unread_count": 3 }

# Test zone creation with images
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Test Zone" \
  -F "location=District 1" \
  -F "total_area=5000" \
  -F "available_area=3000" \
  -F "price_per_sqm=25" \
  -F "description=Test" \
  -F "amenities=Test" \
  -F "is_available=true" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg" \
  http://localhost:8000/api/zones/
```

---

## 🚨 Common Mistakes to Avoid

### Notification Badge
- ❌ Don't use `setInterval` without cleanup in useEffect
- ❌ Don't fetch without Authorization header
- ✅ Always cleanup interval on component unmount

### Image Upload
- ❌ Don't forget to revoke object URLs (memory leaks)
- ❌ Don't use `input.files` directly in React (not reactive)
- ✅ Create preview with `URL.createObjectURL(file)`
- ✅ Cleanup in useEffect return function

### Gallery
- ❌ Don't pass images as prop if API returns null
- ❌ Don't forget to validate images array structure
- ✅ Always verify `Array.isArray(zone.images)`

---

## 📊 File Size Impact

| Feature | Lines Added | Est. Gzip |
|---------|------------|-----------|
| Notification | 50 | 1.5 KB |
| Image Upload | 120 | 3.5 KB |
| Gallery | 0 | 0 KB |
| **Total** | **170** | **~5 KB** |

---

## 🎨 CSS Variables Reference

```javascript
// Colors
var(--color-background)     // #E0E5EC
var(--color-foreground)     // #3D4852
var(--color-accent)         // #6C63FF
var(--color-muted)          // #6B7280

// Shadows
var(--shadow-extruded)      // Raised
var(--shadow-inset)         // Pressed
var(--shadow-inset-deep)    // Deep carved
var(--shadow-extruded-small) // Small icons

// Border Radius
var(--radius-base)          // 16px
var(--radius-inner)         // 12px
var(--radius-container)     // 32px
```

---

## 💡 Pro Tips

1. **Test in isolation first** - Test each feature separately before combining
2. **Use React DevTools** - Inspect state changes in real-time
3. **Monitor Network tab** - Watch API calls and response payloads
4. **Check console** - Look for errors or warnings
5. **Test on mobile** - Responsive design critical
6. **Clear localStorage** - If testing multiple accounts

---

## 🆘 If Something Breaks

```javascript
// Clear all local data
localStorage.clear();
location.reload();

// Check API endpoint
fetch('/api/notifications/unread-count/')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Check zone data structure
fetch('/api/zones/1/')
  .then(r => r.json())
  .then(zone => {
    console.log('Zone:', zone);
    console.log('Images:', zone.images);
  });

// Check FormData contents
const fd = new FormData();
fd.append('test', 'value');
for (let [k, v] of fd) console.log(k, v);
```

---

## 📞 Quick Help

| Issue | Solution |
|-------|----------|
| Badge doesn't appear | Check API endpoint, check token |
| Images don't upload | Check FormData, check API multipart support |
| Gallery shows blank | Check zone.images structure, check CORS |
| Memory leaks | Check cleanup in useEffect, URL.revokeObjectURL |

---

## 🎯 Success Indicators

✅ You're done when:

- [ ] Badge shows unread count
- [ ] Badge updates every 30s
- [ ] Can select 1-6 images
- [ ] Images show in preview grid
- [ ] Can remove images
- [ ] Form submits with images
- [ ] Gallery displays real images
- [ ] All responsive on mobile
- [ ] No console errors
- [ ] No memory leaks (DevTools check)

---

**Implementation Time: 1.5-2 hours**
**Difficulty Level: Intermediate**
**Dependencies: Node.js, React, Django REST API**

For detailed examples, see: `code-examples-*.js` files
