# Phase 1: Currency Patterns & VNĐ Formatting Strategy

## Overview
Complete audit of all price/currency displays across the application. Maps current USD formatting to Vietnamese Đồng (VNĐ) with implementation guidelines.

**Scope**: Backend calculations, API responses, frontend display  
**Current Currency**: USD (Intl.NumberFormat 'en-US')  
**Target Currency**: VNĐ (Vietnamese Đồng)  
**Decimal Places**: 0 (VNĐ doesn't use decimals)  

---

## Current Currency Implementation

### Formatter Function (Multiple locations)
```javascript
// Current implementation in multiple files:
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price || 0);
};
```

### Current Output Examples
- Input: `1000` → Output: `$1,000`
- Input: `25.5` → Output: `$26`
- Input: `0` → Output: `$0`

---

## Vietnamese Đồng (VNĐ) Formatting

### VNĐ Characteristics
- **Currency Code**: VND
- **Symbol**: ₫ (or "đ" in text)
- **Placement**: After number (1.000.000₫)
- **Decimals**: 0 (no fractional đồng)
- **Thousand Separator**: Period (.) in Vietnam
- **Decimal Separator**: Comma (,) in Vietnam

### Target Output Examples
- `1000` → `1.000 ₫` or `1.000đ`
- `1000000` → `1.000.000 ₫`
- `25` → `25 ₫`
- `0` → `0 ₫`

### VNĐ Formatter Function
```javascript
const formatPriceVND = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price || 0);
};

// Output: "1.000.000 ₫"
```

---

## Currency Usage Audit

### Zone-Related Prices

| # | Location | Current Pattern | Field Name | Database Type | Example Value | Usage |
|---|---|---|---|---|---|---|
| 1 | ZoneCard | `{formatPrice(zone.price_per_sqm)}/m²/mo` | price_per_sqm | Decimal | 25 | Display per m² monthly rate |
| 2 | ZoneDetailPage | `{formatPrice(zone.price_per_sqm)}` | price_per_sqm | Decimal | 25 | Spec display |
| 3 | ZoneFormPage | Input field | price_per_sqm | Decimal | 25 | User input for zone creation |
| 4 | RentalRequestFormPage | Cost calculation | estimated_monthly_cost | Decimal | 75000 | Display monthly rental cost |
| 5 | RentalRequestFormPage | Cost calculation | total_cost | Decimal | 900000 | Total cost for rental period |

### Rental Request Prices

| # | Location | Current Pattern | Field Name | Database Type | Example Value | Usage |
|---|---|---|---|---|---|---|
| 6 | RentalRequestListPage | Table column | estimated_monthly_cost | Decimal | 75000 | Monthly cost in table |
| 7 | RentalRequestDetailPage | Detail card | estimated_monthly_cost | Decimal | 75000 | Monthly cost display |
| 8 | RentalRequestDetailPage | Detail card | total_cost | Decimal | 900000 | Total cost display |

### Contract Prices

| # | Location | Current Pattern | Field Name | Database Type | Example Value | Usage |
|---|---|---|---|---|---|---|
| 9 | ContractListPage | Table column | monthly_rent | Decimal | 75000 | Monthly rent in table |
| 10 | ContractDetailPage | Detail card | monthly_rent | Decimal | 75000 | Monthly rent display |
| 11 | ContractDetailPage | Detail card | total_value | Decimal | 900000 | Contract total value |

---

## Price Calculation Audit

### RentalRequestFormPage
```javascript
const calculateCost = () => {
  if (zone && formData.requested_area) {
    const monthlyCost = formData.requested_area * zone.price_per_sqm;
    const totalCost = monthlyCost * (formData.rental_duration || 1);
    return { monthlyCost, totalCost };
  }
  return { monthlyCost: 0, totalCost: 0 };
};

// Current display:
// Monthly Cost: $75,000
// Total Cost (12 months): $900,000

// Target display:
// Monthly Cost: 75.000.000 ₫
// Total Cost (12 months): 900.000.000 ₫
```

### Price per m² Calculation
- Current: `25 USD/m²/month`
- Display: `$25/m²/mo`
- Target: `25.000 ₫/m²/tháng` (or simplified: `25.000₫/m²/tháng`)

### Area × Price Calculation
- Area (m²) × Price per m²/month = Monthly Cost
- Monthly Cost × Rental Duration (months) = Total Cost
- These calculations work the same in USD or VNĐ

---

## Implementation Strategy

### Step 1: Create Utility Function
Create a single `formatPrice` utility that supports both currencies:

```javascript
// src/utils/formatPrice.js
export const formatPrice = (price, currency = 'VND') => {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0);
  }
  
  // USD fallback (for admin reference or if needed)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price || 0);
};

// Usage:
// formatPrice(1000) → "1.000 ₫"
// formatPrice(1000, 'USD') → "$1,000"
```

### Step 2: Update All Components
Replace inline formatPrice functions with centralized utility:

```javascript
// Before (inline)
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price || 0);
};

// After (imported)
import { formatPrice } from '../utils/formatPrice';

// Usage remains the same
{formatPrice(zone.price_per_sqm)}
```

### Step 3: Update Display Patterns
Adjust text to show Vietnamese units:

```javascript
// Before:
<span>{formatPrice(monthlyCost)}</span>

// After:
<span>{formatPrice(monthlyCost)}/tháng</span>

// For area-based:
// Before: $25/m²/mo
// After: 25.000₫/m²/tháng
```

---

## Files Requiring Currency Updates

### Core Formatting
- [ ] Create: `src/utils/formatPrice.js` (new centralized formatter)

### Pages
- [ ] ZoneCard.js - Price display format
- [ ] ZoneDetailPage.js - Price display format
- [ ] ZoneFormPage.js - Input validation, placeholder
- [ ] RentalRequestFormPage.js - Cost calculation display
- [ ] RentalRequestListPage.js - Table price column
- [ ] RentalRequestDetailPage.js - Price cards
- [ ] ContractListPage.js - Table price columns
- [ ] ContractDetailPage.js - Price cards

### Summary
Total files to update: **8 files**

---

## Currency Conversion Reference

For documentation purposes (not implemented in UI):

| Amount (USD) | Amount (VNĐ) | Note |
|---|---|---|
| $1 | 23,000-25,000₫ | Approximate 2026 rate |
| $25 | 575,000-625,000₫ | Per m² monthly |
| $1,000 | 23,000,000₫ | Monthly rent example |
| $100,000 | 2.3 billion₫ | Large contract |

**Note**: Actual conversion rates fluctuate. For this project, assume 1 USD = 23,000-25,000 VNĐ.

---

## Display Context Examples

### Zone Card
```
Current:
Total Area: 5000 m²
Available: 3000 m²
Price: $25/m²/mo

Target:
Total Area: 5.000 m²
Available: 3.000 m²
Price: 25.000₫/m²/tháng
```

### Rental Request Form
```
Current:
Monthly Cost: $75,000
Total Cost (12 months): $900,000

Target:
Monthly Cost: 75.000.000₫
Total Cost (12 tháng): 900.000.000₫
```

### Contract Detail
```
Current:
Monthly Rent: $75,000
Total Value: $900,000

Target:
Monthly Rent: 75.000.000₫
Total Value: 900.000.000₫
```

---

## Special Cases & Edge Conditions

### Case 1: Very Small Areas
- Input: 0.5 m²
- Calculation: 0.5 × 25,000 = 12,500₫
- Display: `12.500₫`
- Note: Round to nearest 1,000₫ to avoid decimals

### Case 2: Zero Values
- Input: 0
- Output: `0₫`
- Display location: Empty state, unused zones

### Case 3: Large Contracts
- Input: 10,000,000₫
- Output: `10.000.000₫`
- Note: Verify spacing in display (especially in tables)

---

## Testing Checklist

### Number Formatting
- [ ] Single digit: `5` → `5₫`
- [ ] Hundreds: `500` → `500₫`
- [ ] Thousands: `5,000` → `5.000₫`
- [ ] Millions: `1,000,000` → `1.000.000₫`
- [ ] Large: `10,000,000` → `10.000.000₫`

### Display Context
- [ ] ZoneCard price display
- [ ] Table column prices (check alignment)
- [ ] Form input fields (accept numbers)
- [ ] Cost calculation results
- [ ] Contract total values

### Edge Cases
- [ ] Zero values display correctly
- [ ] Decimal values round appropriately
- [ ] Negative values (if applicable) display correctly
- [ ] Very large numbers don't overflow

---

## Localization Considerations

### Vietnamese Number Format
- **Thousand Separator**: Period (`.`)
- **Decimal Separator**: Comma (`,`)
- **Currency Position**: After number with space
- **Example**: `1.000.000 ₫` not `₫ 1.000.000`

### Intl.NumberFormat Locale
- Locale: `'vi-VN'` (Vietnamese - Vietnam)
- Ensures proper formatting automatically
- No manual number manipulation needed

### Alternative Display (If needed)
```javascript
// Abbreviated format for tables
const formatPriceShort = (price) => {
  if (price >= 1000000) {
    return (price / 1000000).toFixed(1) + 'M₫'; // 1.0M₫
  } else if (price >= 1000) {
    return (price / 1000).toFixed(0) + 'K₫'; // 500K₫
  }
  return price + '₫';
};

// Output examples:
// 25.000 → "25K₫"
// 75.000.000 → "75M₫"
```

---

## Backend Coordination

### API Response Format
- **Format**: Numbers (no currency symbols)
- **Unit**: Đồng (VNĐ)
- **Decimals**: 0 (rounded to nearest VNĐ)
- **Example**: `{ "price_per_sqm": 25000, "monthly_rent": 75000000 }`

### Database Fields
- **Type**: DECIMAL or BIGINT (to avoid floating-point errors)
- **Unit**: VNĐ (for Vietnamese projects)
- **Min Value**: 0
- **Max Value**: Reasonable business limit

### Validation Rules
- Prices must be >= 0
- Prices should be whole numbers (no decimals)
- Validate max reasonable price based on business logic

---

## Unresolved Questions

1. **Currency Symbol**: Use `₫` or `đ` or `VND`?
   - Recommendation: `₫` (Unicode symbol) for consistency with Intl.NumberFormat output

2. **Area Units**: Should `m²` be internationalized?
   - Recommendation: Keep as-is (technical term, universal)

3. **Price per m² display**: `25.000₫/m²/tháng` or `25K₫/m²/month`?
   - Recommendation: Full format `25.000₫/m²/tháng` for clarity

4. **Small amount abbreviation**: Show `10₫` or `10.000₫` for very small values?
   - Recommendation: Always use proper formatting (`10₫`)

5. **Backend currency change**: When will API migrate from USD to VNĐ?
   - Recommendation: Coordinate with backend team during Phase 2
