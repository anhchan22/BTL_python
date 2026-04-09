# Industrial Zone Rental Platform

> A modern, full-stack web application for managing industrial zone rentals with real-time notifications and multi-image support.

![Status](https://img.shields.io/badge/status-complete-brightgreen)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![Django](https://img.shields.io/badge/Django-5.0-darkgreen)
![React](https://img.shields.io/badge/React-19-61dafb)
![License](https://img.shields.io/badge/license-proprietary-red)

---

## 📋 Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Key Features Deep Dive](#key-features-deep-dive)
- [Development Standards](#development-standards)
- [Team](#team)

---

## 🎯 Features

### Core Business Features
- **Industrial Zone Management**: Browse, search, and filter available industrial zones
- **Rental Request System**: Submit rental requests with customizable area and duration
- **Smart Approval Workflow**: Admin approval/rejection with automated contract generation
- **Contract Management**: View active and historical rental contracts
- **Real-time Notifications**: Instant alerts for request approvals, rejections, and updates

### Technical Highlights
- **Multi-Image Upload**: Support 1-6 images per zone with preview and management
- **Role-Based Access Control**: Separate ADMIN and TENANT interfaces with permission enforcement
- **Real-time Notifications**: Polling-based notification system with badge display
- **JWT Authentication**: Secure token-based authentication with refresh token support
- **Responsive UI**: Neumorphism design system with smooth transitions and hover effects
- **RESTful API**: Clean, well-documented API endpoints for all business operations

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    INDUSTRIAL ZONE RENTAL PLATFORM               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐              ┌──────────────────────┐ │
│  │  FRONTEND (React)    │              │  BACKEND (Django)    │ │
│  │  Port: 3000          │◄────HTTP────►│  Port: 8000          │ │
│  │                      │   REST API   │                      │ │
│  ├──────────────────────┤              ├──────────────────────┤ │
│  │ Components:          │              │ API Endpoints:       │ │
│  │ • Navbar             │              │ • /api/zones/        │ │
│  │ • Zone List/Detail   │              │ • /api/rentals/      │ │
│  │ • Rental Requests    │              │ • /api/contracts/    │ │
│  │ • Contracts          │              │ • /api/notifications/│ │
│  │ • Dashboard          │              │ • /api/auth/         │ │
│  │ • Admin Panel        │              │                      │ │
│  │                      │              │ Models:              │ │
│  │ State Management:    │              │ • User/Profile       │ │
│  │ • AuthContext        │              │ • IndustrialZone     │ │
│  │ • Local State        │              │ • ZoneImage          │ │
│  │ • Polling            │              │ • RentalRequest      │ │
│  │                      │              │ • Contract           │ │
│  │ Styling:             │              │ • Notification       │ │
│  │ • Inline CSS         │              │                      │ │
│  │ • CSS Variables      │              │ Database:            │ │
│  │ • Neumorphism        │              │ • SQLite (dev)       │ │
│  │                      │              │ • PostgreSQL (prod)  │ │
│  └──────────────────────┘              └──────────────────────┘ │
│          │                                      │                 │
│          └──────────────────┬───────────────────┘                 │
│                             │                                     │
│                    ┌────────▼────────┐                           │
│                    │  File Storage   │                           │
│                    │  Media/images/  │                           │
│                    └─────────────────┘                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

Data Flow:
1. User submits rental request → Request stored in DB
2. Admin approves request → Contract created + Notification sent
3. User polls notifications endpoint → Badge updates
4. User views zones → First image displayed from ZoneImage model
```

---

## 🛠 Tech Stack

### Backend
| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Django | 5.0.1 |
| API | Django REST Framework | 3.14.0 |
| Authentication | djangorestframework-simplejwt | 5.3.1 |
| CORS | django-cors-headers | 4.3.1 |
| Database | SQLite (dev) / PostgreSQL (prod) | Latest |
| Language | Python | 3.9+ |

### Frontend
| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2.4 |
| Routing | React Router DOM | 7.14.0 |
| HTTP Client | Axios | 1.14.0 |
| Language | JavaScript (ES6+) | - |
| Build Tool | React Scripts | 5.0.1 |

### Design System
- **Neumorphism**: Soft UI with elevation and depth
- **CSS Variables**: Dynamic theming support
- **Inline Styles**: Component-scoped styling for consistency
- **Responsive Design**: Mobile-first approach with CSS custom properties

---

## 📁 Project Structure

```
BTL_python/
├── backend/                          # Django REST API
│   ├── api/
│   │   ├── models.py                # Database models (User, Zone, RentalRequest, etc.)
│   │   ├── views.py                 # API viewsets & endpoints
│   │   ├── serializers.py           # Data serialization (request/response)
│   │   ├── urls.py                  # API route definitions
│   │   ├── admin.py                 # Django admin configuration
│   │   ├── permissions.py           # Custom permission classes
│   │   └── migrations/              # Database migration files
│   ├── config/
│   │   ├── settings.py              # Django settings (DB, CORS, AUTH)
│   │   ├── urls.py                  # Main URL router
│   │   ├── wsgi.py                  # WSGI application
│   │   └── asgi.py                  # ASGI application
│   ├── requirements.txt             # Python dependencies
│   ├── manage.py                    # Django CLI
│   └── media/                       # Uploaded zone images (FileField storage)
│
├── frontend/                         # React application
│   ├── public/
│   │   └── index.html               # HTML template
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.js         # User login & registration
│   │   │   ├── DashboardPage.js     # Main dashboard (contracts/requests)
│   │   │   ├── ZoneListPage.js      # Browse zones
│   │   │   ├── ZoneDetailPage.js    # Single zone details + images
│   │   │   ├── RentalRequestListPage.js  # View rental requests
│   │   │   ├── RentalRequestDetailPage.js # Request details & actions
│   │   │   ├── ContractListPage.js  # View contracts
│   │   │   ├── ZoneFormPage.js      # Admin: create/edit zones
│   │   │   └── ProfilePage.js       # User profile settings
│   │   ├── components/
│   │   │   ├── Navbar.js            # Navigation with notification badge
│   │   │   ├── ZoneCard.js          # Zone card with first image
│   │   │   ├── ImageGallery.js      # Multi-image display
│   │   │   ├── StatusBadge.js       # Status indicators
│   │   │   ├── TablePagination.js   # Table pagination controls
│   │   │   ├── ZoneImagePlaceholder.js # Fallback image gradient
│   │   │   └── (other components)
│   │   ├── contexts/
│   │   │   └── AuthContext.js       # Authentication state & logic
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance with interceptors
│   │   │   ├── authService.js       # Login/register/logout
│   │   │   ├── zoneService.js       # Zone CRUD & search
│   │   │   ├── rentalService.js     # Rental request operations
│   │   │   ├── contractService.js   # Contract queries
│   │   │   ├── notificationService.js # Notification polling
│   │   │   └── imageService.js      # Image upload & management
│   │   ├── App.js                   # Main component & routing
│   │   ├── index.css                # Global styles & CSS variables
│   │   └── index.js                 # React DOM render
│   ├── package.json                 # NPM dependencies
│   └── .env.example                 # Environment template
│
├── docs/                            # Project documentation
│   ├── project-overview-pdr.md
│   ├── system-architecture.md
│   ├── code-standards.md
│   ├── design-guidelines.md
│   └── deployment-guide.md
│
└── README.md                        # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Python** 3.9+ with pip
- **Node.js** 16+ with npm
- **PostgreSQL** or **SQLite** (SQLite for development)
- **Git** for version control

### Backend Setup

```bash
# Clone the repository
git clone <repository-url>
cd BTL_python/backend

# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (optional)
# Copy environment variables as needed

# Run migrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser

# Start development server
python manage.py runserver
# Server runs on http://127.0.0.1:8000
```

### Frontend Setup

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Create .env file (optional, if needed)
# REACT_APP_API_URL=http://127.0.0.1:8000

# Start development server
npm start
# App opens at http://localhost:3000
```

### First Steps
1. **Register Account**: Create TENANT or ADMIN account on login page
2. **Browse Zones**: View available industrial zones with images
3. **Submit Request**: Tenants can submit rental requests
4. **Admin Actions**: Admins can approve/reject requests (auto-creates contracts)
5. **Track Notifications**: Real-time badge shows updates

---

## 📡 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register/      # User registration
POST   /api/auth/login/         # User login (returns JWT tokens)
POST   /api/auth/logout/        # User logout
GET    /api/auth/me/            # Current user info
PATCH  /api/auth/profile/       # Update user profile
```

### Zone Management
```
GET    /api/zones/              # List zones (search, filter, paginate)
GET    /api/zones/{id}/         # Zone details + images
POST   /api/zones/              # Create zone (admin only)
PATCH  /api/zones/{id}/         # Update zone (admin only)
DELETE /api/zones/{id}/         # Delete zone (admin only)
```

### Zone Images
```
GET    /api/zones/{zone_id}/images/      # List zone images
POST   /api/zones/{zone_id}/images/      # Upload image (admin only)
DELETE /api/zones/{zone_id}/images/{id}/ # Delete image (admin only)
```

### Rental Requests
```
GET    /api/rentals/              # List requests (filtered by user role)
POST   /api/rentals/              # Create rental request (tenant)
GET    /api/rentals/{id}/         # Request details
POST   /api/rentals/{id}/approve/ # Approve (admin only)
POST   /api/rentals/{id}/reject/  # Reject (admin only)
POST   /api/rentals/{id}/cancel/  # Cancel (tenant, if pending)
```

### Contracts
```
GET    /api/contracts/            # List contracts (filtered by user role)
GET    /api/contracts/{id}/       # Contract details
GET    /api/contracts/my_active/  # Current user's active contracts
GET    /api/contracts/active/     # All active contracts (admin only)
```

### Notifications
```
GET    /api/notifications/                # List notifications
GET    /api/notifications/unread-count/   # Unread count
POST   /api/notifications/mark-as-read/   # Mark as read
POST   /api/notifications/{id}/mark_single/ # Mark single notification
```

---

## 🎨 Key Features Deep Dive

### 1. Multi-Image Upload System

**Backend (models.py)**
- `ZoneImage` model: ForeignKey to `IndustrialZone`
- ImageField for file storage in `/media/images/`
- Min 1, max 6 images per zone enforced at serializer level

**Frontend (ZoneFormPage.js)**
- Drag-and-drop image upload
- Local preview before submission
- Separate management for existing vs new images
- Individual delete buttons with confirmation
- Real-time validation for image count limits

**Data Flow**
```
User selects images → FileReader previews → FormData multipart upload
→ Django receives → ImageField saves to media → URL returned
→ Frontend stores in ZoneImage → Displayed on zone cards/detail
```

### 2. Real-time Notification System

**Backend (models.py & views.py)**
- `Notification` model: recipient, actor, verb, target_id, is_read, created_at
- NotificationViewSet with custom actions:
  - `/unread-count/` - Returns unread notification count
  - `/mark-as-read/` - Bulk or individual mark as read
  
**Frontend (Navbar.js & notificationService.js)**
- 30-second polling interval to `/api/notifications/unread-count/`
- Badge displays unread count (shows "99+" if >99)
- Auto-clears badge after 5 seconds on page visit
- Smooth pop animation when new notifications appear

**Notification Triggers**
```
Tenant creates rental request → Notification created for Admin
Admin approves request → Notification created for Tenant + Contract created
Admin rejects request → Notification created for Tenant
```

### 3. Role-Based Access Control

**User Roles**
- **ADMIN**: Full system access (zones, requests, users, contracts)
- **TENANT**: Limited access (own requests, view zones, own contracts)

**Permission Enforcement**
- Frontend conditionally renders UI based on `isAdmin()`
- Backend decorators enforce permissions at endpoint level
- API returns 403 FORBIDDEN for unauthorized actions
- Profile page shows role badge (👑 for admin, 👤 for tenant)

### 4. Neumorphism Design System

**CSS Variables** (globals.css)
```css
--color-background: #f0f2f5;
--color-foreground: #1a1a1a;
--color-accent: #6c63ff;
--shadow-extruded: 10px 10px 20px #d0d5dd, -10px -10px 20px #ffffff;
```

**Component Styling**
- All components use inline styles for scoping
- Hover states with smooth transitions
- Consistent border radius via `--radius-base` and `--radius-inner`
- Box shadows for depth and elevation

**Benefits**
- Soft, modern aesthetic
- Improved visual hierarchy
- Reduced cognitive load (UI feels tactile)
- Excellent for industrial/professional themes

### 5. Smart Approval Workflow

**Request Lifecycle**
```
PENDING → APPROVED (contract created) or REJECTED
         ↓
APPROVED → Active contract until end date
REJECTED → Tenant notified, can resubmit
```

**Admin Actions**
1. View pending requests in dashboard
2. Click "Approve" with optional admin note
3. System auto-creates contract with:
   - Start date: today
   - End date: today + rental_duration months
   - Monthly rent from request calculation
   - Status: ACTIVE

4. Tenant receives notification immediately
5. Contract appears in tenant's contract list

---

## 📚 Development Standards

### Code Organization
- **No TypeScript**: Pure JavaScript (ES6+) for simplicity
- **Functional Components**: React hooks (useState, useEffect, useCallback)
- **No MUI/Tailwind**: Inline styles + CSS variables for complete control
- **Service Layer**: Axios services abstract API calls
- **Context API**: AuthContext for global state management

### File Naming Convention
- **Components**: PascalCase (`ZoneCard.js`, `Navbar.js`)
- **Pages**: PascalCase ending in "Page" (`ZoneListPage.js`)
- **Services**: camelCase (`zoneService.js`, `notificationService.js`)
- **Utilities**: camelCase (`formatPrice.js`, `validateEmail.js`)

### Code Style
- **Indentation**: 2 spaces
- **Semicolons**: Always use
- **Comments**: For complex logic only
- **Props**: Validate at component level
- **State**: Lift state only when necessary

### API Service Pattern
```javascript
// services/zoneService.js
import api from './api';

export const zoneService = {
  getAllZones: async (params) => {
    const { data } = await api.get('/api/zones/', { params });
    return data;
  },
  
  getZoneById: async (id) => {
    const { data } = await api.get(`/api/zones/${id}/`);
    return data;
  }
};
```

### State Management Pattern
```javascript
// Use local state for component-level data
const [zones, setZones] = useState([]);
const [loading, setLoading] = useState(true);

// Use AuthContext for global auth state
const { user, isAdmin } = useAuth();

// Use effect for data fetching
useEffect(() => {
  loadData();
}, [dependencies]);
```

---

## 👥 Team

**Project Lead**: Anh Trần  
**Role**: Full-stack Developer

**Responsibilities**:
- Architecture design and system implementation
- Backend API development (Django REST Framework)
- Frontend implementation (React with Neumorphism design)
- Database design and optimization
- Documentation and code standards

**Contact**: trananh22052005@gmail.com

---

## 📄 License

This project is proprietary software. All rights reserved.

**Usage Restrictions**:
- Unauthorized copying, modification, or distribution is prohibited
- Contact project owner for licensing inquiries

---

## 🤝 Support & Contributions

For issues, questions, or feature requests:

1. Check existing documentation in `/docs` folder
2. Review API endpoints in this README
3. Check backend logs: `python manage.py runserver` (verbose mode)
4. Check frontend console: Open browser DevTools (F12)

---

## 🔗 Quick Links

- **Backend**: http://127.0.0.1:8000 (development)
- **Frontend**: http://localhost:3000 (development)
- **API Root**: http://127.0.0.1:8000/api/
- **Django Admin**: http://127.0.0.1:8000/admin/
- **API Documentation**: See [API Documentation](#-api-documentation) section

---

**Last Updated**: April 2026  
**Status**: Complete & Production Ready
