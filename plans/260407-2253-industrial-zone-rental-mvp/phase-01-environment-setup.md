---
phase: 1
title: Environment Setup
duration: Days 1-3
priority: critical
status: pending
dependencies: []
---

# Phase 1: Environment Setup

**Goal:** Setup complete development environment for both backend and frontend, with "Hello World" API endpoint working.

## Prerequisites

- Python 3.10+ installed
- Node.js 18+ installed
- Git installed
- VS Code or preferred IDE
- Terminal/Command Prompt access

## Backend Setup (Django)

### Step 1: Create Backend Directory & Virtual Environment

```bash
# Create backend directory
mkdir backend
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Step 2: Install Django Dependencies

Create `requirements.txt`:

```txt
Django==5.0.1
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.1
django-cors-headers==4.3.1
python-decouple==3.8
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### Step 3: Create Django Project

```bash
# Create Django project named 'config'
django-admin startproject config .

# Create 'api' app for REST API endpoints
python manage.py startapp api
```

### Step 4: Configure Django Settings

Edit `config/settings.py`:

```python
# Add to INSTALLED_APPS
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    
    # Local apps
    'api',
]

# Add CORS middleware (MUST be at top of MIDDLEWARE)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this first
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS Configuration (for React on port 3000)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# JWT Settings (optional customization)
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
```

### Step 5: Create Hello World API Endpoint

Edit `api/views.py`:

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])  # No auth required for test
def hello_world(request):
    return Response({
        'message': 'Hello World from Django REST Framework!',
        'status': 'success'
    })
```

Create `api/urls.py`:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello_world, name='hello-world'),
]
```

Edit `config/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
```

### Step 6: Run Migrations & Start Server

```bash
# Run initial migrations
python manage.py migrate

# Create superuser (for Django admin)
python manage.py createsuperuser
# Username: admin
# Email: admin@example.com
# Password: admin123 (or your choice)

# Start development server
python manage.py runserver
```

**Test:** Open `http://localhost:8000/api/hello/` → Should see JSON response

**Django Admin:** Open `http://localhost:8000/admin/` → Login with superuser

---

## Frontend Setup (React)

### Step 1: Create React App

```bash
# Go back to project root
cd ..

# Create React app
npx create-react-app frontend

cd frontend
```

### Step 2: Install Dependencies

```bash
# Install Material-UI and dependencies
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# Install Axios for API calls
npm install axios

# Install React Router
npm install react-router-dom
```

Update `package.json` to add proxy for API calls:

```json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "proxy": "http://localhost:8000",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@mui/material": "^5.15.0",
    "@mui/icons-material": "^5.15.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "axios": "^1.6.0"
  }
}
```

### Step 3: Create API Service

Create `src/services/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Test endpoint
export const testConnection = async () => {
  const response = await api.get('/hello/');
  return response.data;
};

export default api;
```

### Step 4: Test API Integration

Edit `src/App.js`:

```javascript
import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Box, CircularProgress } from '@mui/material';
import { testConnection } from './services/api';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTestAPI = async () => {
    setLoading(true);
    try {
      const data = await testConnection();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error connecting to API: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box textAlign="center">
        <Typography variant="h3" gutterBottom>
          Industrial Zone Rental System
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Django + React Integration Test
        </Typography>
        
        <Button 
          variant="contained" 
          onClick={handleTestAPI}
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Test API Connection'}
        </Button>

        {message && (
          <Typography variant="body1" sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default App;
```

### Step 5: Start React Development Server

```bash
npm start
```

**Test:** Open `http://localhost:3000/` → Click "Test API Connection" → Should show success message

---

## Project Structure Verification

After Phase 1, your structure should look like:

```
ChoThueKhuCongNghiep/
├── backend/
│   ├── venv/                 # Virtual environment
│   ├── config/               # Django project settings
│   │   ├── __init__.py
│   │   ├── settings.py      # ✅ CORS, DRF configured
│   │   ├── urls.py          # ✅ API routes included
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── api/                  # DRF app
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── views.py         # ✅ Hello World endpoint
│   │   ├── urls.py          # ✅ API URL config
│   │   ├── admin.py
│   │   ├── apps.py
│   │   └── tests.py
│   ├── manage.py
│   ├── requirements.txt     # ✅ All dependencies listed
│   └── db.sqlite3           # ✅ Created after migrations
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js      # ✅ Axios service
│   │   ├── App.js          # ✅ Test component
│   │   └── index.js
│   ├── package.json        # ✅ Proxy configured
│   └── package-lock.json
│
└── .gitignore              # ✅ Create this (see below)
```

---

## Create .gitignore File

Create `.gitignore` in project root:

```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
*.egg-info/
db.sqlite3
*.log

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
build/
.DS_Store

# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db
```

---

## Testing Checklist

### Backend Tests ✅
- [ ] Django server runs without errors (`python manage.py runserver`)
- [ ] Can access Django admin at `http://localhost:8000/admin/`
- [ ] Can login to admin with superuser credentials
- [ ] API endpoint `http://localhost:8000/api/hello/` returns JSON
- [ ] No CORS errors in browser console

### Frontend Tests ✅
- [ ] React app starts without errors (`npm start`)
- [ ] Material-UI components render properly
- [ ] "Test API Connection" button works
- [ ] Success message displays after API call
- [ ] No console errors in browser DevTools

### Integration Tests ✅
- [ ] Both servers running simultaneously (Django on :8000, React on :3000)
- [ ] React can successfully call Django API
- [ ] CORS configured correctly (no CORS errors)
- [ ] Proxy working (API calls route through proxy)

---

## Common Issues & Solutions

### Issue 1: CORS Errors
**Symptom:** Browser console shows CORS policy error  
**Solution:** 
- Ensure `corsheaders` in `INSTALLED_APPS`
- Ensure `CorsMiddleware` is FIRST in `MIDDLEWARE`
- Verify `CORS_ALLOWED_ORIGINS` includes `http://localhost:3000`

### Issue 2: Module Not Found (Django)
**Symptom:** `ModuleNotFoundError: No module named 'rest_framework'`  
**Solution:**
- Activate virtual environment: `venv\Scripts\activate`
- Reinstall: `pip install -r requirements.txt`

### Issue 3: React Proxy Not Working
**Symptom:** 404 errors when calling `/api/hello/`  
**Solution:**
- Ensure `"proxy": "http://localhost:8000"` in `package.json`
- Restart React dev server (`npm start`)
- Use relative URLs in axios (`/api/hello/` not `http://localhost:8000/api/hello/`)

### Issue 4: Port Already in Use
**Symptom:** `Error: That port is already in use`  
**Solution:**
- Django: Change port `python manage.py runserver 8001`
- React: Set `PORT=3001` environment variable

---

## Success Criteria

Phase 1 is complete when:

1. ✅ Django server runs successfully
2. ✅ React app runs successfully
3. ✅ API endpoint responds with JSON
4. ✅ React can call Django API without CORS errors
5. ✅ Django admin panel accessible
6. ✅ All dependencies installed
7. ✅ `.gitignore` configured
8. ✅ Both servers can run simultaneously

---

## Next Phase

Once Phase 1 is verified complete:
- **Proceed to:** [Phase 2: Authentication System](./phase-02-authentication-system.md)
- **Estimated Time:** Start Phase 2 on Day 4

## Notes

- Keep both terminals open (one for Django, one for React)
- Django admin panel will be useful for testing models in later phases
- Save superuser credentials for later use
- Test API integration thoroughly before moving to Phase 2
