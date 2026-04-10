# Phase 1: Analysis & Setup
## Codebase Audit & Translation Map

**Priority**: CRITICAL - Foundation for all subsequent phases  
**Estimated Duration**: 4-6 hours  
**Status**: Ready to Start  
**Owner**: Auditor/Analyst Agent  

---

## Overview

Conduct comprehensive audit of the industrial zone rental platform frontend codebase to:
- Identify all English text for Vietnamese translation
- Map all icons (emoji, generic, or missing) requiring Phosphor/Lucide replacement
- Catalog all CSS that needs hover effect enhancement
- Document currency formatting locations
- Create reference spreadsheets for implementation phases

This phase produces **reference documents** that guide all subsequent work.

---

## Context Links

- Main Plan: `plan.md`
- README: `../../README.md`
- Neumorphism Design: `../../Neumorphism_Design.md`
- Frontend Structure: `../../frontend/src/`

---

## Requirements

### Functional Requirements
1. **Audit Completeness**: Map 100% of user-facing English text
2. **Icon Inventory**: Identify all emoji, generic, or missing icons
3. **CSS Catalog**: Document all button/card hover effects (current state)
4. **Currency Locations**: List all price display points
5. **Component Registry**: Create map of all pages and components

### Non-Functional Requirements
1. **Accuracy**: Must be 100% accurate for downstream phases
2. **Clarity**: Documents must be self-explanatory without code context
3. **Traceability**: Every text string traceable to source file and line
4. **Completeness**: Cover login through contract management flows

---

## Architecture & Technical Approach

### Audit Workflow
```
┌─────────────────────────────────────┐
│ 1. Scan frontend/src directory      │
│    (pages, components, contexts)    │
└────────────────┬────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│ 2. Extract text strings             │
│    (visible UI text only)           │
└────────────────┬────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│ 3. Identify icons & styling needs   │
│    (emoji, missing, poor UX)        │
└────────────────┬────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│ 4. Map CSS hover/transitions        │
│    (current state assessment)       │
└────────────────┬────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│ 5. Generate reference documents     │
│    (CSV, JSON, markdown tables)     │
└─────────────────────────────────────┘
```

### Document Types to Create

1. **Translation Matrix** (CSV)
   - File path | Component | English text | Vietnamese translation | Context
   
2. **Icon Inventory** (CSV)
   - File path | Component | Current icon | Type | Replacement icon | Rationale

3. **CSS Hover Effects Matrix** (CSV)
   - Component | Current hover effect | Priority (HIGH/MEDIUM/LOW) | Proposed enhancement

4. **Currency Display Map** (CSV)
   - File path | Context | Current format | Required format | Implementation approach

5. **Component Checklist** (Markdown table)
   - All pages and components with status of text/icon/CSS review

---

## Related Code Files

### Files to Analyze (READ ONLY)

**Pages** (8 total):
- `frontend/src/pages/LoginPage.js`
- `frontend/src/pages/RegisterPage.js`
- `frontend/src/pages/DashboardPage.js`
- `frontend/src/pages/ZoneListPage.js`
- `frontend/src/pages/ZoneDetailPage.js`
- `frontend/src/pages/RentalRequestDetailPage.js`
- `frontend/src/pages/ContractListPage.js`
- `frontend/src/pages/ContractDetailPage.js`
- `frontend/src/pages/ProfilePage.js`

**Components** (12+ total):
- `frontend/src/components/Navbar.js`
- `frontend/src/components/AuthCard.js`
- `frontend/src/components/FormField.js`
- `frontend/src/components/NeuButton.js`
- `frontend/src/components/ZoneCard.js`
- `frontend/src/components/ZoneImagePlaceholder.js`
- `frontend/src/components/ImageGallery.js`
- `frontend/src/components/StatusBadge.js`
- `frontend/src/components/TablePagination.js`
- `frontend/src/components/Loading.js`
- `frontend/src/components/DashboardCard.js`
- `frontend/src/components/StatBox.js`

**Styling**:
- `frontend/src/globals.css`
- `frontend/src/index.css`
- `frontend/src/App.css`

**Contexts & Services**:
- `frontend/src/contexts/AuthContext.js`
- `frontend/src/services/` (all service files)

---

## Implementation Steps

### Step 1: Codebase Scan (1-2 hours)
1. Use ripgrep to identify all English text strings in JSX/HTML
   - Search patterns: `>[\w\s]+<`, `placeholder="`, `title="`, etc.
2. Document file paths, line numbers, and exact text
3. Categorize by page/component for organization

### Step 2: Text Extraction (1-2 hours)
1. Create Translation Matrix spreadsheet
2. Extract unique text strings (remove duplicates)
3. Group by semantic category:
   - Navigation labels
   - Form labels & placeholders
   - Button text
   - Error messages
   - Confirmation messages
   - Table headers
   - Status labels
   - Success messages

### Step 3: Icon & Visual Audit (1 hour)
1. Scan for emoji usage (`👤`, `👑`, `📝`, etc.)
2. Identify missing or generic icon areas
3. Create Icon Inventory with replacement suggestions
4. Categorize by priority (essential vs nice-to-have)

### Step 4: CSS Hover Effects Review (1 hour)
1. Extract current hover effects from:
   - `globals.css` (base button/card styles)
   - Component inline styles (ZoneCard, NeuButton, etc.)
2. Identify weak or missing hover states
3. Document priority: HIGH (cards, buttons), MEDIUM (badges), LOW (text)

### Step 5: Currency Mapping (30 minutes)
1. Search for all price displays in components
2. Map current format (`$XXX`, `$X,XXX.XX`, etc.)
3. Document target format (`X.XXX.XXX₫`)
4. Identify where logic vs CSS formatting needed

### Step 6: Component Registry (1 hour)
1. Create comprehensive checklist of all components
2. Mark completion status as phases progress
3. Track dependencies between components
4. Document any special considerations per component

---

## Detailed Steps for Text Extraction

### Command Reference
```bash
# Find all text in JSX files
grep -r ">" frontend/src/pages/ | grep -v "import\|export\|//\|function\|return"

# Find button labels
grep -r "button\|<button" frontend/src/components/

# Find form labels
grep -r "label\|placeholder\|title" frontend/src/

# Find status text
grep -r "status\|pending\|approved\|rejected" frontend/src/
```

### Text Categories to Extract

**Navigation & Menu**
- Login, Register, Dashboard, Logout, Zones, Requests, Contracts, Profile
- Back, Next, Previous, Home, Settings

**Form Labels & Placeholders**
- Email, Username, Password, Confirm Password
- Area, Duration, Location, Zone Name
- Search, Filter, Sort

**Button Text**
- Submit, Cancel, Save, Delete, Approve, Reject, Edit, View
- Create Zone, Create Request, Download Contract

**Status Labels**
- Pending, Approved, Rejected, Active, Inactive, Completed
- Draft, Published, Archived

**Messages**
- Loading..., Error occurred, Success, Please fill all fields
- Are you sure?, Confirm deletion

**Table Headers**
- Zone Name, Area, Price, Status, Actions, Created Date

---

## Todo Checklist

- [ ] Create Google Sheet or CSV for Translation Matrix
- [ ] Scan all `.js` files in `frontend/src/pages/` for text
- [ ] Scan all `.js` files in `frontend/src/components/` for text
- [ ] Extract unique text strings (remove duplicates)
- [ ] Group text by semantic category
- [ ] Create Icon Inventory spreadsheet
- [ ] Identify all emoji usage in codebase
- [ ] Document current hover effects in CSS Hover Matrix
- [ ] Map all currency display locations
- [ ] Create Component Registry with checklist
- [ ] Validate all spreadsheets for accuracy
- [ ] Peer review audit results
- [ ] Generate final reference documents (CSV/JSON)

---

## Success Criteria

✅ **Completeness**
- 100% of visible English text identified
- All emoji and generic icons cataloged
- All hover effects documented
- All currency displays mapped

✅ **Accuracy**
- No duplicate entries in translation matrix
- File paths and line numbers correct
- Text strings exactly as they appear in code
- Icon categories accurate

✅ **Usability**
- Reference documents clear without code context
- Status column in component registry updated
- Dependencies noted between components
- Implementation prioritization clear

✅ **Documentation**
- All reference files saved to `plans/260410-1323-visual-facelift/reference/`
- File format standardized (CSV or JSON)
- Change log created for tracking updates
- Peer review completed

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Missing text strings | Medium | High | Multiple passes + grep validation |
| Inaccurate line numbers | Low | Medium | Manual spot-check after extraction |
| Duplicate entries | Medium | Low | Remove duplicates, validate uniqueness |
| Icon misclassification | Low | Medium | Category review before Phase 4 |
| Format inconsistency | Low | Low | Template-based spreadsheet creation |

---

## Security Considerations

- **No sensitive data in audit**: Only public UI text
- **No API key/credential exposure**: Services layer not in scope
- **Private data handling**: Avoid extracting placeholder/example data
- **Audit trail**: Keep git history of reference documents

---

## Next Steps & Dependencies

### Upon Completion of Phase 1:
1. **Peer Review**: 30-min walkthrough with team member
2. **Refinement**: Address feedback on reference documents
3. **Approval**: Sign-off before Phase 2 begins

### Phase 2 Handoff:
- Pass Translation Matrix to Phase 3 (Localization)
- Pass CSS Hover Matrix to Phase 2 (CSS Foundation)
- Pass Icon Inventory to Phase 4 (Iconography)
- Pass Component Registry to Phase 5 (Component Refinements)

### Documents to Generate (Outputs)
- `reference/translation-matrix.csv` - All text strings
- `reference/icon-inventory.csv` - Icon replacements
- `reference/css-hover-matrix.csv` - Hover effects
- `reference/currency-map.csv` - Price displays
- `reference/component-registry.md` - Full checklist
- `reference/audit-summary.md` - Executive summary

---

**Phase Status**: Ready to Begin  
**Estimated Start**: Immediately after plan approval  
**Estimated Completion**: Day 1, End of Business
