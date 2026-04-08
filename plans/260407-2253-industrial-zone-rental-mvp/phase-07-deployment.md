---
phase: 7
title: Deployment (Optional)
duration: Days 29-30
priority: low
status: pending
dependencies: [phase-06]
---

# Phase 7: Deployment (Optional)

**Goal:** Deploy the application to cloud platforms for live demo access.

**Note:** This phase is OPTIONAL. Local demo is perfectly acceptable for academic projects. Only proceed if you have extra time or want to learn deployment.

**Dependencies:** Phase 6 complete (all features working, tested)

---

## Deployment Options

### Option A: Simple Deployment (Recommended for Beginners)

**Backend:** Railway or Render (Free tier)  
**Frontend:** Vercel or Netlify (Free tier)  
**Database:** PostgreSQL on Railway/Render

**Pros:** Free, easy setup, no DevOps knowledge needed  
**Cons:** Cold starts, limited resources

### Option B: Traditional Cloud (Advanced)

**Platform:** AWS, Google Cloud, or DigitalOcean  
**Cost:** $5-10/month  
**Complexity:** Higher (requires server management)

---

## Backend Deployment (Railway)

### Step 1: Prepare Django for Production

Update `backend/config/settings.py`:

```python
import os
from decouple import config

# Security
DEBUG = config('DEBUG', default=False, cast=bool)
SECRET_KEY = config('SECRET_KEY', default='django-insecure-change-this-in-production')

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

# Database
import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL', default='sqlite:///db.sqlite3'),
        conn_max_age=600
    )
}

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# CORS for production
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000'
).split(',')

# CSRF trusted origins
CSRF_TRUSTED_ORIGINS = config(
    'CSRF_TRUSTED_ORIGINS',
    default='http://localhost:8000'
).split(',')
```

### Step 2: Update Requirements

Add to `backend/requirements.txt`:

```txt
Django==5.0.1
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.1
django-cors-headers==4.3.1
python-decouple==3.8
python-dateutil==2.8.2
dj-database-url==2.1.0
psycopg2-binary==2.9.9
gunicorn==21.2.0
whitenoise==6.6.0
```

### Step 3: Add Whitenoise for Static Files

Update `config/settings.py`:

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add after SecurityMiddleware
    # ... rest of middleware
]

# Static files config
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

### Step 4: Create Procfile

Create `backend/Procfile`:

```
web: gunicorn config.wsgi --log-file -
```

### Step 5: Create runtime.txt

Create `backend/runtime.txt`:

```
python-3.11.7
```

### Step 6: Create .env.example

Create `backend/.env.example`:

```env
DEBUG=False
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@host:port/dbname
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
CSRF_TRUSTED_ORIGINS=https://yourdomain.com
```

### Step 7: Deploy to Railway

1. **Sign up:** https://railway.app (GitHub login)
2. **New Project** → Deploy from GitHub repo
3. **Add PostgreSQL** → Railway auto-provisions database
4. **Set Environment Variables:**
   ```
   DEBUG=False
   SECRET_KEY=<generate-strong-key>
   ALLOWED_HOSTS=your-app.railway.app
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   CSRF_TRUSTED_ORIGINS=https://your-app.railway.app
   ```
5. **Deploy** → Railway auto-detects Django
6. **Run migrations:**
   - Go to Railway dashboard
   - Open terminal
   - Run: `python manage.py migrate`
   - Run: `python manage.py seed_demo_data`

**Alternative: Render**

Similar process, deploy via GitHub, add PostgreSQL database, set environment variables.

---

## Frontend Deployment (Vercel)

### Step 1: Prepare React for Production

Update `frontend/.env.production`:

```env
REACT_APP_API_URL=https://your-backend.railway.app
```

Update `frontend/src/services/api.js`:

```javascript
const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Step 2: Remove Proxy (Production Only)

In production, remove proxy from `package.json` since frontend and backend are on different domains.

### Step 3: Deploy to Vercel

1. **Sign up:** https://vercel.com (GitHub login)
2. **Import Project** → Select your GitHub repo
3. **Configure:**
   - Framework: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. **Add Environment Variable:**
   - `REACT_APP_API_URL` = `https://your-backend.railway.app`
5. **Deploy** → Vercel builds and deploys automatically

**Alternative: Netlify**

Similar process, drag & drop `build` folder or connect GitHub repo.

---

## Database Migration (SQLite → PostgreSQL)

### Step 1: Export Data (Optional)

If you have local data to migrate:

```bash
cd backend
python manage.py dumpdata > data.json
```

### Step 2: Setup PostgreSQL Locally (Test)

```bash
# Install PostgreSQL
# Update .env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Migrate
python manage.py migrate

# Import data
python manage.py loaddata data.json
```

### Step 3: Deploy to Production

Railway/Render automatically provision PostgreSQL. Just run migrations via dashboard terminal.

---

## Post-Deployment Checklist

### Backend ✅
- [ ] Django admin accessible at `/admin/`
- [ ] API endpoints returning data (test with Postman)
- [ ] Database migrations applied
- [ ] Demo data seeded
- [ ] CORS configured correctly
- [ ] Static files serving correctly

### Frontend ✅
- [ ] Website loads without errors
- [ ] Can login with demo credentials
- [ ] API calls working (check Network tab)
- [ ] All pages accessible
- [ ] Responsive design working
- [ ] No console errors

### Integration ✅
- [ ] Frontend can call backend API
- [ ] Authentication flow works
- [ ] CRUD operations functional
- [ ] File uploads work (if applicable)

---

## Common Deployment Issues

### Issue 1: CORS Errors

**Symptom:** Frontend can't call backend API  
**Solution:**
- Add frontend domain to `CORS_ALLOWED_ORIGINS` in Django settings
- Restart backend server
- Clear browser cache

### Issue 2: Static Files Not Loading

**Symptom:** CSS/JS 404 errors  
**Solution:**
```bash
python manage.py collectstatic --noinput
```
Ensure Whitenoise configured correctly.

### Issue 3: Database Connection Error

**Symptom:** `OperationalError: could not connect to server`  
**Solution:**
- Verify `DATABASE_URL` in environment variables
- Check PostgreSQL database is running
- Test connection string locally

### Issue 4: SECRET_KEY Error

**Symptom:** `ImproperlyConfigured: SECRET_KEY`  
**Solution:**
- Generate strong secret key:
  ```python
  from django.core.management.utils import get_random_secret_key
  print(get_random_secret_key())
  ```
- Add to environment variables

### Issue 5: Build Fails

**Symptom:** Vercel/Railway build errors  
**Solution:**
- Check Node.js/Python version compatibility
- Verify all dependencies in requirements.txt/package.json
- Check build logs for specific errors

---

## Monitoring & Maintenance

### Logs

**Railway:** View logs in dashboard  
**Vercel:** View deployment logs in dashboard

### Performance

- Monitor cold start times
- Check database query performance
- Optimize slow API endpoints

### Updates

```bash
# Update dependencies
pip install --upgrade -r requirements.txt
npm update

# Deploy
git push origin main  # Auto-deploys on Railway/Vercel
```

---

## Cost Estimation

### Free Tier Limits

**Railway:**
- $5 free credit/month
- ~500 hours/month uptime
- Limited to 512MB RAM

**Render:**
- Free tier available
- Sleeps after inactivity
- 750 hours/month free

**Vercel:**
- 100GB bandwidth/month
- Unlimited deployments

### Paid Plans (if needed)

- Railway: $5/month for more resources
- Render: $7/month for always-on
- Vercel: Free for personal projects

---

## Alternative: Local Demo with ngrok

If deployment too complex, use ngrok for temporary public URL:

```bash
# Install ngrok
npm install -g ngrok

# Expose backend
ngrok http 8000

# Expose frontend
ngrok http 3000
```

Share ngrok URLs for demo. **Note:** URLs change on restart.

---

## Documentation

### Update README with Deployment Info

```markdown
## Live Demo

- **Frontend:** https://your-app.vercel.app
- **Backend API:** https://your-api.railway.app
- **Admin Panel:** https://your-api.railway.app/admin/

## Demo Credentials

- Admin: `admin` / `admin123`
- Tenant: `tenant1` / `tenant123`

## Deployment

This project is deployed using:
- Frontend: Vercel (React)
- Backend: Railway (Django + PostgreSQL)

To deploy your own instance:
1. Fork this repository
2. Follow deployment steps in Phase 7 documentation
3. Configure environment variables
```

---

## Success Criteria

Phase 7 complete when:

1. ✅ Backend deployed and accessible
2. ✅ Frontend deployed and accessible
3. ✅ Database setup and migrated
4. ✅ Demo data available
5. ✅ All features working in production
6. ✅ HTTPS enabled
7. ✅ CORS configured correctly
8. ✅ Documentation updated with URLs
9. ✅ Demo credentials working
10. ✅ Suitable for presentation

---

## Final Notes

### If Deployment Takes Too Long

**Remember:** Local demo is PERFECTLY ACCEPTABLE for academic projects. Deployment is a bonus, not a requirement.

### Focus on What Matters

For grading, these matter more:
- ✅ Working features
- ✅ Clean code
- ✅ Proper architecture
- ✅ Good documentation
- ✅ Successful live demo

Deployment is impressive but optional.

### Presentation Day

Whether deployed or local:
1. Have backup plan (video recording)
2. Test demo flow beforehand
3. Prepare demo accounts
4. Know your features inside out
5. Be ready to explain architecture

---

## Conclusion

**Congratulations!** 🎉

If you've completed all phases (or even just 1-6), you now have:
- ✅ Full-stack Python + React application
- ✅ RESTful API with JWT authentication
- ✅ Role-based access control
- ✅ Database design with relationships
- ✅ Modern frontend with Material-UI
- ✅ Working MVP for academic presentation

**Remember:** The goal was to learn and build something functional. If it works, demos well, and meets requirements - you've succeeded! 🚀
