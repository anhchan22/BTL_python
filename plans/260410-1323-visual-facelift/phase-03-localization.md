# Phase 3: Localization
## Vietnamese Translation & Currency Formatting

**Priority**: HIGH - Core feature requirement  
**Estimated Duration**: 8-10 hours  
**Status**: Pending (blocked by Phase 1)  
**Owner**: Frontend/Localization Agent  

---

## Overview

Transform all English UI text to Vietnamese and implement professional currency formatting:

1. **Complete Text Translation** - All visible UI text → Vietnamese
2. **Currency Formatting** - USD ($) → Vietnamese Đồng (₫) with proper format
3. **Date/Time Localization** - Timestamps respecting Vietnamese locale
4. **Form Placeholders** - All input hints translated
5. **Status Labels** - All status badges translated
6. **Error Messages** - All feedback messages translated

**Key Constraint**: NO logic changes - only text replacement via component props or CSS content.

---

## Context Links

- Phase 1 Reference: `phase-01-analysis-and-setup.md`
- Translation Matrix: `phase-01-analysis-and-setup.md#text-categories`
- Component Files: `../../frontend/src/components/`
- Page Files: `../../frontend/src/pages/`

---

## Requirements

### Functional Requirements
1. **Text Coverage**: 100% of visible English → Vietnamese
2. **Currency Format**: "$5,000" → "5.000.000₫" (Vietnamese number format)
3. **Consistency**: Same term always translates same way (use map)
4. **Localization Context**: Preserve technical terms (API, JWT, etc.)
5. **Form Labels**: All input labels, placeholders, hints translated
6. **Status Badges**: All status text translated (Pending, Approved, etc.)
7. **Error Messages**: All validation and error messages translated

### Non-Functional Requirements
1. **Readability**: Vietnamese text flows naturally (no literal word-for-word)
2. **Consistency**: Use professional business Vietnamese
3. **No Breaking Changes**: All component props/methods unchanged
4. **Maintainability**: Translation map centralized for future updates
5. **Performance**: No additional bundle size (static translations only)

---

## Architecture & Technical Approach

### Translation Strategy

Two approaches available - choose one per Phase 1 findings:

#### Option A: Inline Text Replacement (RECOMMENDED)
- Replace hardcoded English strings directly in components
- Pros: Simple, minimal overhead, no runtime translation
- Cons: Strings scattered throughout codebase
- Use when: Text strings in specific components only

#### Option B: Centralized Translation Map
- Create `localization/vietnamese.json` mapping English → Vietnamese
- Import and use throughout components
- Pros: Centralized, easy to maintain, support future i18n
- Cons: Slight runtime overhead (negligible)
- Use when: Scale up to multiple languages later

**Recommendation**: Use **Option A for hardcoded strings** (direct replacement) + **Option B for dynamic content** (use translation map for status badges, etc.)

### Implementation Pattern

```javascript
// Option A: Direct replacement
<button>تسجيل الدخول</button>  // Vietnamese: Đăng Nhập

// Option B: Translation map + component
import translations from '../localization/vietnamese.json';

<span>{translations.status.pending}</span>  // "Chờ Xử Lý"
```

### Currency Formatting Strategy

```javascript
// Before: $5,000.00
// After: 5.000.000₫ (Vietnamese format)

function formatVietnamPrice(usdAmount) {
  // Convert USD to VND (1 USD ≈ 25,000 VND)
  const vndAmount = usdAmount * 25000;
  
  // Format: 5.000.000₫ (with dots as thousand separators)
  return vndAmount.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

// Or via Intl.NumberFormat:
new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND'
}).format(125000000);  // "125.000.000 ₫"
```

---

## Files to Modify

### Translation Map Files (Create New)

**`frontend/src/localization/vietnamese.json`** (NEW)
```json
{
  "navigation": {
    "login": "Đăng Nhập",
    "register": "Đăng Ký",
    "logout": "Đăng Xuất",
    "dashboard": "Bảng Điều Khiển",
    "zones": "Khu Công Nghiệp",
    "requests": "Yêu Cầu Cho Thuê",
    "contracts": "Hợp Đồng",
    "profile": "Hồ Sơ"
  },
  "buttons": {
    "submit": "Gửi",
    "cancel": "Hủy",
    "save": "Lưu",
    "delete": "Xóa",
    "edit": "Chỉnh Sửa",
    "approve": "Phê Duyệt",
    "reject": "Từ Chối",
    "view": "Xem",
    "back": "Quay Lại"
  },
  "forms": {
    "email": "Email",
    "username": "Tên Người Dùng",
    "password": "Mật Khẩu",
    "confirmPassword": "Xác Nhận Mật Khẩu",
    "fullName": "Tên Đầy Đủ",
    "phone": "Số Điện Thoại",
    "area": "Diện Tích",
    "duration": "Thời Hạn (Tháng)",
    "location": "Địa Điểm",
    "zoneName": "Tên Khu Công Nghiệp"
  },
  "status": {
    "pending": "Chờ Xử Lý",
    "approved": "Được Phê Duyệt",
    "rejected": "Từ Chối",
    "active": "Hoạt Động",
    "inactive": "Không Hoạt Động",
    "completed": "Hoàn Thành",
    "draft": "Nháp",
    "published": "Đã Công Bố"
  },
  "messages": {
    "loading": "Đang Tải...",
    "error": "Đã Xảy Ra Lỗi",
    "success": "Thành Công",
    "confirm": "Bạn Có Chắc Chắn?",
    "fillAllFields": "Vui Lòng Điền Tất Cả Các Trường"
  }
}
```

### Component Files to Modify

**Pages** (8 total):
- `frontend/src/pages/LoginPage.js` - All text
- `frontend/src/pages/RegisterPage.js` - All text
- `frontend/src/pages/DashboardPage.js` - Labels, headers
- `frontend/src/pages/ZoneListPage.js` - Search, headers
- `frontend/src/pages/ZoneDetailPage.js` - Details, buttons
- `frontend/src/pages/RentalRequestDetailPage.js` - Status, buttons
- `frontend/src/pages/ContractListPage.js` - Headers, status
- `frontend/src/pages/ProfilePage.js` - Labels, profile text

**Components** (8 total):
- `frontend/src/components/Navbar.js` - Menu items, logout
- `frontend/src/components/NeuButton.js` - Button labels (if hardcoded)
- `frontend/src/components/StatusBadge.js` - Status text
- `frontend/src/components/AuthCard.js` - Card labels
- `frontend/src/components/FormField.js` - Label rendering
- `frontend/src/components/TablePagination.js` - Pagination text
- `frontend/src/components/ZoneCard.js` - Card labels
- `frontend/src/components/ZoneImagePlaceholder.js` - Placeholder text

### Utility Files to Create

**`frontend/src/utils/currencyFormatter.js`** (NEW)
```javascript
/**
 * Format USD amount to Vietnamese Đồng (VND)
 * @param {number} usdAmount - Amount in USD
 * @param {number} exchangeRate - USD to VND rate (default: 25000)
 * @returns {string} Formatted VND string
 */
export function formatToVND(usdAmount, exchangeRate = 25000) {
  if (!usdAmount && usdAmount !== 0) return '0₫';
  
  const vndAmount = Math.round(usdAmount * exchangeRate);
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true
  }).format(vndAmount);
}

/**
 * Format date to Vietnamese locale
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDateVN(date) {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}
```

---

## Implementation Steps

### Step 1: Create Translation Map (1 hour)

**Create `frontend/src/localization/vietnamese.json`**:
- Map all text from Phase 1 audit
- Organize by category (navigation, buttons, forms, status, messages)
- Include all status labels, error messages, placeholders
- Ensure consistency (same English term = same Vietnamese translation)

### Step 2: Create Currency Formatter (1 hour)

**Create `frontend/src/utils/currencyFormatter.js`**:
- Implement `formatToVND(amount)` function
- Handle edge cases (null, zero, undefined)
- Use `Intl.NumberFormat` for Vietnamese locale
- Export for use in all price-display components

### Step 3: Translate LoginPage (1.5 hours)

**Modify `frontend/src/pages/LoginPage.js`**:
- Replace all hardcoded English text:
  - "Login" → "Đăng Nhập"
  - "Register" → "Đăng Ký"
  - "Username" → "Tên Người Dùng"
  - "Password" → "Mật Khẩu"
  - "Invalid credentials" → "Thông tin không hợp lệ"
  - "Login successful" → "Đăng nhập thành công"

- Example transformation:
```javascript
// Before
<h1>Industrial Zone Rental</h1>
<input placeholder="Username" />
<button>Login</button>

// After
<h1>Nền Tảng Cho Thuê Khu Công Nghiệp</h1>
<input placeholder="Tên Người Dùng" />
<button>Đăng Nhập</button>
```

### Step 4: Translate RegisterPage (1.5 hours)

**Modify `frontend/src/pages/RegisterPage.js`**:
- Translate all form labels
- Translate button text
- Translate validation messages
- Translate role selection (Admin → Quản Trị Viên, Tenant → Khách Hàng)

### Step 5: Translate DashboardPage (1.5 hours)

**Modify `frontend/src/pages/DashboardPage.js`**:
- Translate section headers
- Translate table headers
- Translate status labels using translation map
- Translate button labels
- Example: "Pending Approvals" → "Chờ Phê Duyệt"

### Step 6: Translate ZoneListPage (1 hour)

**Modify `frontend/src/pages/ZoneListPage.js`**:
- Translate search placeholder
- Translate filter labels
- Translate headers ("Available Zones" → "Các Khu Công Nghiệp Khả Dụng")
- Translate sort options

### Step 7: Translate ZoneDetailPage (1 hour)

**Modify `frontend/src/pages/ZoneDetailPage.js`**:
- Translate detail labels (Area → Diện Tích, Price → Giá)
- Translate button text
- Apply currency formatter to prices
- Translate image gallery captions

### Step 8: Translate Rental Request Pages (1.5 hours)

**Modify `frontend/src/pages/RentalRequestDetailPage.js`**:
- Translate status labels using translation map
- Translate section headers
- Translate button actions
- Translate approval/rejection messages

### Step 9: Translate Contract Pages (1 hour)

**Modify `frontend/src/pages/ContractListPage.js` and `ContractDetailPage.js`**:
- Translate contract headers
- Translate status labels
- Apply currency formatter to rent amounts
- Translate dates using `formatDateVN()`

### Step 10: Translate Components (2 hours)

**StatusBadge.js**:
```javascript
const statusMap = {
  'pending': 'Chờ Xử Lý',
  'approved': 'Được Phê Duyệt',
  'rejected': 'Từ Chối',
  'active': 'Hoạt Động'
};
```

**Navbar.js**:
- Translate menu items
- Translate logout text
- Translate notifications label

**ZoneCard.js**:
- Translate card labels
- Apply currency formatter to prices
- Translate "View Details" → "Xem Chi Tiết"

**FormField.js**:
- Translate labels if hardcoded
- Translate error messages

### Step 11: Apply Currency Formatter (2 hours)

**Update all price displays**:

```javascript
// Before
<span>${zone.price_per_sqm}</span>

// After
import { formatToVND } from '../utils/currencyFormatter';
<span>{formatToVND(zone.price_per_sqm)}</span>
```

**Components/Pages to update**:
- ZoneCard.js - Zone price per sqm
- ZoneDetailPage.js - All prices
- RentalRequestDetailPage.js - Estimated rent
- ContractDetailPage.js - Monthly rent, total
- ContractListPage.js - Rent column

### Step 12: Translate Remaining UI (1 hour)

**Navbar.js, Footer.js, ProfilePage.js**:
- Translate profile labels
- Translate footer text
- Translate notification badge text
- Translate any remaining hardcoded strings

---

## Translation Reference Guide

### Common Business Terms (Vietnamese)
| English | Vietnamese | Context |
|---------|-----------|---------|
| Zone | Khu Công Nghiệp | Location/property |
| Rental Request | Yêu Cầu Cho Thuê | Business transaction |
| Contract | Hợp Đồng | Legal document |
| Tenant | Khách Hàng / Người Thuê | User role |
| Admin | Quản Trị Viên | System role |
| Approve | Phê Duyệt | Workflow action |
| Reject | Từ Chối | Workflow action |
| Area | Diện Tích | Measurement |
| Price | Giá / Giá Thuê | Cost |
| Duration | Thời Hạn | Time period |

### Status Labels (Complete Map)
| English | Vietnamese |
|---------|-----------|
| Pending | Chờ Xử Lý |
| Approved | Được Phê Duyệt |
| Rejected | Từ Chối |
| Active | Hoạt Động |
| Completed | Hoàn Thành |
| Draft | Nháp |
| Archived | Lưu Trữ |

### Button Actions (Complete Map)
| English | Vietnamese |
|---------|-----------|
| Submit | Gửi |
| Save | Lưu |
| Cancel | Hủy |
| Delete | Xóa |
| Edit | Chỉnh Sửa |
| View | Xem |
| Approve | Phê Duyệt |
| Reject | Từ Chối |
| Create | Tạo |
| Search | Tìm Kiếm |

---

## Todo Checklist

- [ ] Create `localization/vietnamese.json` with complete translation map
- [ ] Create `utils/currencyFormatter.js` with VND formatting function
- [ ] Translate LoginPage.js (title, labels, buttons, errors)
- [ ] Translate RegisterPage.js (form labels, role text)
- [ ] Translate DashboardPage.js (headers, table content)
- [ ] Translate ZoneListPage.js (search, filters, headers)
- [ ] Translate ZoneDetailPage.js (labels, prices)
- [ ] Translate RentalRequestDetailPage.js (status, headers)
- [ ] Translate ContractListPage.js (headers, status)
- [ ] Translate ContractDetailPage.js (details, amounts)
- [ ] Update StatusBadge.js with status translations
- [ ] Update Navbar.js (menu, logout, notifications)
- [ ] Update ZoneCard.js (labels, prices)
- [ ] Update FormField.js (labels, errors)
- [ ] Update ProfilePage.js (section titles, labels)
- [ ] Update Footer.js (company info, contact labels)
- [ ] Apply formatToVND to all price displays (10+ locations)
- [ ] Apply formatDateVN to all date displays (5+ locations)
- [ ] Test Vietnamese character rendering
- [ ] Test currency formatting edge cases (0, null, large numbers)
- [ ] Verify no translation inconsistencies
- [ ] QA review of all translations with native speaker

---

## Success Criteria

✅ **Translation Coverage**
- 100% of visible English text translated
- All status labels use translation map
- All form labels translated
- All button text translated
- All error messages translated

✅ **Currency Formatting**
- All prices display as "X.XXX.XXX₫" format
- No USD ($) symbols visible
- Vietnamese locale number formatting applied
- Edge cases handled (0, null, decimals)

✅ **Quality**
- Native speaker review completed
- Business terminology accurate
- No literal translations (context-aware)
- Consistent terminology throughout

✅ **Technical**
- No console errors from translation map
- Currency formatter works in all components
- Date formatter uses Vietnamese locale
- No performance regression
- Locale-specific formatting correct

✅ **Testing**
- All translations visible and readable
- Currency amounts correct (verify math)
- Date formatting matches Vietnamese convention
- Mobile view text wraps properly
- No truncated text

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Translation errors | Medium | High | Native speaker review + QA |
| Currency math wrong | Low | High | Test with known values |
| Inconsistent terminology | Medium | Medium | Use translation map consistently |
| Text truncation | Low | Medium | Test all locales for width |
| Character encoding issues | Low | Medium | Verify UTF-8 in all files |
| Locale formatting mismatch | Low | Medium | Test Intl.NumberFormat output |

---

## Security Considerations

- Vietnamese text is public UI - no security risk
- Currency amounts are calculated server-side - format only client-side
- No new API calls - translation is static
- No sensitive data in translation files

---

## Next Steps & Dependencies

### Upon Completion:
1. **QA Review**: Have Vietnamese speaker verify all translations
2. **Currency Validation**: Verify exchange rates and formatting
3. **Testing**: Test on real data from backend API
4. **Approval**: Sign-off before Phase 4 begins

### Handoff to Phase 4:
- Confirm all text translated (ready for icon replacement)
- Provide translation map for any icon-related text
- Validate currency display before icon implementation

### Handoff to Phase 5:
- Inform component refinement of text changes
- Share currency formatter location for reuse
- Document any text-related styling needs

---

**Phase Status**: Ready to Begin (after Phase 1 completion)  
**Estimated Start**: Day 2, Afternoon  
**Estimated Completion**: Day 3, Afternoon
