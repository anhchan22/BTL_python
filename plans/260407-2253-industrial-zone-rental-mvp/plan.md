---
title: Industrial Zone Rental Management System - Implementation Plan
created: 2026-04-07
status: pending
timeline: 1-2 months (7 phases)
experience_level: beginner
tech_stack: Django 5.x + DRF + JWT / React + Material-UI
scope: MVP (Auth, Zone CRUD, Rental Booking, Contract Tracking)
---

# Industrial Zone Rental Management System - Implementation Plan

## Overview

Academic Python project to build industrial zone rental management system with Django backend and React frontend.

**Priority:** Complete on time > Feature richness  
**Target:** Working MVP in 1-2 months for beginner developer

## Tech Stack

```
Frontend: React (CRA) + Material-UI + Axios + React Router
Backend:  Django 5.x + Django REST Framework + JWT Auth
Database: SQLite (dev) / PostgreSQL (optional prod)
```

## Core Features (MVP Scope)

1. ✅ **Authentication & Authorization** - JWT-based auth with Admin/Tenant roles
2. ✅ **Industrial Zone Management** - CRUD operations with search/filter
3. ✅ **Rental Booking System** - Request submission and admin approval workflow
4. ✅ **Contract Tracking** - Basic contract viewing (auto-generated on approval)

## Project Structure

```
ChoThueKhuCongNghiep/
├── backend/                    # Django project root
│   ├── manage.py
│   ├── config/                 # Django settings
│   ├── api/                    # Main DRF app
│   ├── requirements.txt
│   └── db.sqlite3
│
├── frontend/                   # React app root
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── contexts/
│   │   └── utils/
│   └── package.json
│
└── docs/                       # Documentation
```

## Implementation Phases

| Phase | Focus | Duration | Status |
|-------|-------|----------|--------|
| [Phase 1](./phase-01-environment-setup.md) | Environment Setup | Days 1-3 | ✅ Complete |
| [Phase 2](./phase-02-authentication-system.md) | Authentication System | Days 4-7 | ✅ Complete |
| [Phase 3](./phase-03-zone-management.md) | Industrial Zone Management | Days 8-12 | ✅ Complete |
| [Phase 4](./phase-04-rental-request-system.md) | Rental Request System | Days 13-18 | ✅ Complete |
| [Phase 5](./phase-05-contract-tracking.md) | Contract Tracking | Days 19-22 | ✅ Complete |
| [Phase 6](./phase-06-polish-and-testing.md) | Polish & Testing | Days 23-28 | 🔄 In Progress |
| [Phase 7](./phase-07-deployment.md) | Deployment (Optional) | Days 29-30 | ⏸️ Pending |

## Key Dependencies

- Phase 2 depends on Phase 1 (env setup)
- Phase 3 depends on Phase 2 (auth required for permissions)
- Phase 4 depends on Phase 3 (rentals need zones)
- Phase 5 depends on Phase 4 (contracts generated from approved rentals)
- Phase 6 depends on Phases 2-5 (polish all features)
- Phase 7 is optional (deployment)

## Success Criteria

### Functional
- User registration/login with role selection
- Admin CRUD for industrial zones
- Tenant view/search/filter zones
- Tenant submit rental requests
- Admin approve/reject requests
- Auto-generate contracts on approval
- View active contracts

### Non-Functional
- Clean Material-UI interface
- Responsive design
- Proper error handling
- Form validation (client + server)
- Secure JWT authentication
- No SQL injection (Django ORM)
- Organized, readable code

### Academic
- Python backend (OOP concepts)
- RESTful API design
- Proper database relationships
- React component architecture
- Git version control
- Live demo with test data

## Risk Mitigation

1. **Learning Curve** → Use Django admin panel, follow tutorials strictly
2. **Integration Issues** → Setup CORS early, test API before frontend
3. **Scope Creep** → Strictly follow MVP, document future enhancements separately
4. **Database Changes** → Finalize models before Phase 3
5. **Deployment** → Optional Phase 7, local demo acceptable

## Resources

- **Brainstorm Report:** `plans/reports/brainstormer-260407-2253-industrial-zone-rental-system.md`
- **Django Docs:** https://docs.djangoproject.com/
- **DRF Docs:** https://www.django-rest-framework.org/
- **Material-UI:** https://mui.com/
- **React Router:** https://reactrouter.com/

## Next Steps

1. Start with Phase 1: Environment Setup
2. Follow each phase sequentially
3. Test thoroughly after each phase
4. Use Django admin panel for backend testing
5. Ask Claude Code for implementation help per phase
