# Phase 2 Quick Reference Guide

## Component Usage

### AuthCard Component
```jsx
import AuthCard from '../components/AuthCard';

<AuthCard>
  {/* Form content */}
</AuthCard>

// Props:
// - children (required): React.ReactNode
// - className (optional): string
```

### FormField Component
```jsx
import FormField from '../components/FormField';

<FormField
  label="Username"
  name="username"
  type="text"
  value={formData.username}
  onChange={handleChange}
  placeholder="Enter username"
  required
  error={errors.username ? errors.username[0] : ''}
/>

// Props:
// - label (required): string
// - name (required): string
// - value (required): string
// - onChange (required): function
// - type (optional): string = 'text'
// - placeholder (optional): string = ''
// - required (optional): boolean = false
// - error (optional): string = ''
// - disabled (optional): boolean = false
```

### NeuButton Component
```jsx
import NeuButton from '../components/NeuButton';

<NeuButton
  type="submit"
  variant="primary"
  size="large"
  fullWidth
  disabled={loading}
  onClick={handleClick}
>
  Click Me
</NeuButton>

// Props:
// - children (required): React.ReactNode
// - variant (optional): 'primary' | 'secondary' = 'primary'
// - size (optional): 'small' | 'medium' | 'large' = 'medium'
// - fullWidth (optional): boolean = false
// - type (optional): 'button' | 'submit' | 'reset' = 'button'
// - disabled (optional): boolean = false
// - onClick (optional): function
// - className (optional): string = ''
```

## Design Tokens Reference

### Colors (use in Tailwind classes)
```
bg-neu-bg              #E0E5EC (background)
text-neu-fg            #3D4852 (foreground)
text-neu-muted         #6B7280 (muted text)
text-neu-accent        #6C63FF (accent)
text-neu-accent-light  #8B84FF (accent light)
```

### Shadows (use in Tailwind classes)
```
shadow-neu-extruded        9px 9px (default raised)
shadow-neu-extruded-hover  12px 12px (lifted)
shadow-neu-inset-deep      10px inset (input wells)
shadow-neu-inset-small     3px inset (press states)
```

### Border Radius (use in Tailwind classes)
```
rounded-neu-container  32px (cards)
rounded-neu-base       16px (buttons, inputs)
rounded-neu-inner      12px (smaller)
```

## Form Pattern Examples

### Login Form
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthCard from '../components/AuthCard';
import FormField from '../components/FormField';
import NeuButton from '../components/NeuButton';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(formData.username, formData.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neu-bg px-4 py-8">
      <AuthCard>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-center text-neu-fg mb-2">
          Title
        </h1>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <NeuButton type="submit" variant="primary" size="large" fullWidth disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </NeuButton>
        </form>
      </AuthCard>
    </div>
  );
}
```

## Tailwind Classes Available

### Spacing
```
p-4 (1rem), p-6 (1.5rem), p-8 (2rem)
m-2, m-4, m-6, m-8
mb-2, mb-4, mb-6
mt-6, mt-8
px-4, py-3
```

### Typography
```
text-sm, text-base, text-lg
text-3xl, text-4xl
font-medium, font-semibold, font-bold, font-display
```

### Layout
```
flex, flex-col
items-center, justify-center
w-full, max-w-sm, mx-auto
min-h-screen
```

### States
```
hover:, active:, focus:, disabled:
transition-all, duration-300, ease-out
```

### Colors
```
bg-red-50, bg-blue-50
border-red-500, border-blue-500
text-red-700, text-blue-700
```

## Error Handling Pattern

### Server returns nested error objects
```javascript
// From register() API call
result.error = {
  username: ["Username already taken"],
  email: ["Invalid email format"],
  password: ["Too short"]
}

// Extract first error element
<FormField
  error={errors.username ? errors.username[0] : ''}
/>
```

## Accessibility Checklist

- ✅ Labels with htmlFor
- ✅ aria-invalid on error inputs
- ✅ aria-describedby linking errors
- ✅ Semantic HTML (form, input, button, fieldset)
- ✅ Tab order is logical
- ✅ Focus visible on all interactive
- ✅ Touch targets ≥ 44px
- ✅ Color contrast ≥ 4.5:1

## Common Issues & Solutions

### Input focus ring not showing
**Cause:** Browser default outline disabled
**Solution:** Focus ring provided by FormField component automatically

### Button not expanding to full width
**Use:** `fullWidth` prop on NeuButton
```jsx
<NeuButton fullWidth>Submit</NeuButton>
```

### Multiple form fields spacing
**Use:** `space-y-4` on form container
```jsx
<form className="space-y-4">
  <FormField ... />
  <FormField ... />
</form>
```

### Error message not showing
**Check:** Error prop passed correctly
```jsx
error={errors.fieldname ? errors.fieldname[0] : ''}
```

## Files Modified

- `frontend/src/components/AuthCard.js` - NEW
- `frontend/src/components/FormField.js` - NEW
- `frontend/src/components/NeuButton.js` - NEW
- `frontend/src/pages/LoginPage.js` - REFACTORED
- `frontend/src/pages/RegisterPage.js` - REFACTORED

## Next Steps for Phase 3

1. Create DashboardCard component (larger card)
2. Create DataTable component (neumorphic table)
3. Create NavItem component (navigation)
4. Create Badge component (status indicators)
5. Refactor dashboard pages
6. Update documentation

---

For full details, see: `plans/reports/phase2-implementation-260409-2015-auth-refactor.md`
