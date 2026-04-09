# Phase 6: Detail Pages - Implementation Brief

**Scope:** 3 detail pages (ZoneDetailPage, RentalRequestDetailPage, ContractDetailPage)  
**Time:** 4-5 hours  
**Status:** Planned, awaiting implementation

---

## PAGES TO REFACTOR

### 1. ZoneDetailPage
**Current:** Uses MUI (Container, Typography, Card, Button, Grid)  
**Features:** Zone details, image gallery, rental button, admin edit
**Refactor:** 
- Use DashboardCard wrapper
- Inline styles for all elements
- Image gallery pattern (similar to ZoneImagePlaceholder)
- Action buttons (View Map, Request Rental, Edit)
- Preserve API: zoneService.getZoneById()

### 2. RentalRequestDetailPage
**Current:** Uses MUI (Container, Card, Typography, Button, Chip)  
**Features:** Request details, status badge, approve/reject (admin), tenant info
**Refactor:**
- Use DashboardCard wrapper
- StatusBadge component for status
- Inline styles for form-like layout
- Action buttons (based on status + role)
- Preserve API: rentalService.getRentalRequestById()

### 3. ContractDetailPage
**Current:** Uses MUI (Container, Card, Typography, Button, Grid)  
**Features:** Contract details, dates, parties, terms, actions
**Refactor:**
- Use DashboardCard wrapper
- StatusBadge component for status
- Inline styles for tabular data
- Action buttons (renew, terminate, download)
- Preserve API: contractService.getContractById()

---

## IMPLEMENTATION PATTERN

Each detail page follows this structure:

```javascript
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import StatusBadge from '../components/StatusBadge';
import NeuButton from '../components/NeuButton';
import { serviceAPI } from '../services/serviceAPI';

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadData();
  }, [id]);
  
  const loadData = async () => {
    try {
      const result = await serviceAPI.getById(id);
      setData(result);
    } catch (err) {
      // error handling
    } finally {
      setLoading(false);
    }
  };
  
  // Define inline styles
  const containerStyle = { /* styles */ };
  const sectionStyle = { /* styles */ };
  
  return (
    <div style={containerStyle}>
      {loading && <LoadingState />}
      {data && <DetailContent data={data} />}
      {error && <ErrorState />}
    </div>
  );
}
```

---

## COMPONENT REUSE

- ✅ Use DashboardCard for sections
- ✅ Use StatusBadge for status display
- ✅ Use NeuButton for actions
- ✅ Follow inline-styles pattern from Phases 2-5
- ✅ Preserve all API calls and business logic

---

## TESTING CHECKLIST

- [ ] Page loads without MUI imports
- [ ] Data fetches correctly (check Network tab)
- [ ] All inline styles applied (colors, shadows)
- [ ] Status badges show correct colors
- [ ] Action buttons work (navigate, delete, etc.)
- [ ] Back/Edit/Return navigation works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] No className usage

---

## GIT COMMITS

```
# After Phase 6 complete:
git commit -m "feat(phase6): refactor zone/rental/contract detail pages

- Remove all MUI components (Container, Card, Typography, Button, Grid)
- Use inline styles + CSS variables throughout
- Create/update detail page layouts
- Preserve all API calls and navigation
- Add StatusBadge for status display
- Add NeuButton for all actions
- Responsive design (mobile/tablet/desktop)
- All tests passing"
```

---

**Ready for planner agent to create detailed Phase 6 plan.**
