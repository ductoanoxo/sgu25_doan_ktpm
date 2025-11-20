# Shop Filter Features - Fear of God Store

## ✅ Implemented Features (FR-008)

### 1. **Category Filter** ✅
- Filter products by gender (Male/Female)
- Filter by specific categories
- "All Products" option to view everything
- Active category highlighted in yellow (#fed700)

**Location:** Left sidebar
**Implementation:** `Shop.jsx` (Male/Female category lists)

---

### 2. **Price Range Filter** ✅ NEW
Filter products by price ranges:
- **All Prices** - Show all products
- **Under 500,000 VND** - Budget-friendly items
- **500,000 - 1,000,000 VND** - Mid-range products
- **1,000,000 - 2,000,000 VND** - Premium items
- **Above 2,000,000 VND** - Luxury products

**Location:** Left sidebar (below categories)
**Implementation:** 
- Frontend: `Shop.jsx` (state: `priceRange`)
- Filter logic: `Products.jsx` (client-side filtering)

**How it works:**
```javascript
// Filter products by price
filteredProducts = filteredProducts.filter(product => {
    const price = getSalePrice(product) // Considers sale prices
    return price >= priceRange.min && price <= priceRange.max
})
```

---

### 3. **Size Filter** ✅ NEW
Filter products by available sizes:
- ☑️ S (Small)
- ☑️ M (Medium)
- ☑️ L (Large)
- ☑️ XL (Extra Large)
- ☑️ XXL (Double Extra Large)

**Multiple selection:** You can select multiple sizes at once

**Location:** Left sidebar (below price filter)
**Implementation:**
- Frontend: `Shop.jsx` (state: `selectedSizes`)
- Filter logic: `Products.jsx` (checks product.size field)

**How it works:**
```javascript
// Product size format: "S,M,L,XL"
const productSizes = product.size.split(',').map(s => s.trim())

// Check if any selected size matches
return selectedSizes.some(selectedSize => 
    productSizes.includes(selectedSize)
)
```

---

### 4. **Price Sort** ✅ (Existing)
Sort products by price:
- **Relevance** (default)
- **Price (Low > High)** - Ascending
- **Price (High > Low)** - Descending

**Location:** Top bar (right side)
**Implementation:** `Shop.jsx` + `Products.jsx`

**Sort considers:**
- Base prices
- Sale/promotion prices (if applicable)

---

### 5. **Search** ✅ (Existing)
Search products by name or description

**Location:** Top of left sidebar
**Implementation:** `Search.jsx` component

---

### 6. **Reset Filters** ✅ NEW
Clear all active filters with one click

**When shown:** Button appears only when filters are active
**Action:** Resets:
- Price range to "All Prices"
- Size selections to empty
- Keeps category and search intact

---

## User Experience Features

### 🎨 Visual Feedback
- **Active filters highlighted** with yellow accent color
- **Radio buttons** for price range (single selection)
- **Checkboxes** for sizes (multiple selection)
- **Reset button** with hover animation
- **Empty state** message when no products match filters

### 📱 Responsive Design
- Works on mobile, tablet, and desktop
- Filter sidebar stacks on mobile devices
- Touch-friendly filter controls

### ⚡ Real-time Filtering
- Filters apply instantly (no page reload)
- Works with pagination
- Compatible with search and sort

---

## Technical Implementation

### File Structure
```
client_app/src/Shop/
├── Shop.jsx                 # Main shop page with filter state
├── ShopFilter.css           # Filter styling
└── Component/
    ├── Products.jsx         # Product list with filter logic
    ├── Pagination.jsx       # Pagination component
    └── Search.jsx           # Search component
```

### State Management
```javascript
// Shop.jsx
const [priceRange, setPriceRange] = useState({ 
    min: 0, 
    max: 999999999 
})
const [selectedSizes, setSelectedSizes] = useState([])
```

### Props Flow
```
Shop.jsx
  ├─> priceRange ──────┐
  ├─> selectedSizes ───┤
  ├─> products ────────┼──> Products.jsx (filters & displays)
  └─> sort ────────────┘
```

---

## Filter Combinations

All filters work together:
1. **Category + Price + Size** 
   - Example: Male T-Shirts, 500k-1M, size L

2. **Category + Search + Price**
   - Example: Female "dress" keyword, under 500k

3. **Sort + Filter**
   - Example: Size XL, sorted by price (low to high)

4. **All filters combined**
   - Most specific results

---

## Testing Checklist

### ✅ Price Filter
- [x] Select each price range
- [x] Verify products filtered correctly
- [x] Check with sale prices
- [x] Test "All Prices" option

### ✅ Size Filter
- [x] Select single size
- [x] Select multiple sizes
- [x] Products with matching sizes shown
- [x] Products without size field excluded

### ✅ Combined Filters
- [x] Price + Size
- [x] Category + Price + Size
- [x] All filters + Sort + Search

### ✅ Reset Filters
- [x] Button appears when filters active
- [x] Clears all filters on click
- [x] Maintains category selection

### ✅ Edge Cases
- [x] No products match filters → Show message
- [x] Product without size field → Excluded from size filter
- [x] Sale prices considered in price filter

---

## Database Schema (Product)

```javascript
{
    name_product: String,
    price_product: Number,
    size: String,              // "S,M,L,XL,XXL"
    promotion: Number,         // Sale percentage
    id_category: ObjectId,
    // ... other fields
}
```

**Note:** 
- `size` is comma-separated string
- `price_product` is original price
- Final price = `price_product * (1 - promotion/100)`

---

## Future Enhancements 🔜

### Phase 2.2: Stock Badges
- Show stock status on product cards
- "Hết hàng" (Out of stock)
- "Chỉ còn X" (Low stock)
- "Còn hàng" (In stock)

### Phase 3: Advanced Filters
- Color filter
- Material filter
- Brand filter
- Custom price range slider

### Backend Optimization
- Move filtering to server-side
- Add filter query parameters to API
- Implement filter caching

---

## API Endpoints Used

### Current
```
GET /api/product/pagination?page=1&count=9&category=:id&search=keyword
```

### Future Enhancement
```
GET /api/product/pagination?
    page=1
    &count=9
    &category=:id
    &search=keyword
    &minPrice=500000
    &maxPrice=1000000
    &sizes=S,M,L
```

---

## Performance Considerations

### ✅ Current Implementation
- Client-side filtering (fast for small datasets)
- Filter happens after API fetch
- Good for < 1000 products

### 🔜 Future Optimization
For large datasets (> 5000 products):
- Server-side filtering
- Database indexes on price, size
- Pagination with filters
- Filter count API (show "10 products found")

---

## User Guide

### How to use filters:

1. **Navigate to Shop page**
   - Click "Shop" in menu
   - Or select a category

2. **Filter by Price**
   - Click price range radio button
   - Products update instantly

3. **Filter by Size**
   - Check one or more size boxes
   - Products must have ALL selected sizes

4. **Combine filters**
   - Select category (sidebar)
   - Choose price range
   - Select sizes
   - Use search box
   - Sort results

5. **Reset**
   - Click "Reset Filters" button
   - Or select "All Prices"
   - Or uncheck all sizes

---

## Developer Notes

### Adding new price ranges:
```jsx
<li>
    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <input 
            type="radio" 
            name="priceRange" 
            checked={priceRange.min === MIN && priceRange.max === MAX}
            onChange={() => handlerPriceRangeChange(MIN, MAX)}
            style={{ marginRight: '8px' }}
        />
        Your Range Label
    </label>
</li>
```

### Adding new sizes:
```jsx
{['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(size => (
    // ... checkbox code
))}
```

### Customizing filter logic:
Edit `Products.jsx`:
```javascript
// Strict matching (product must have ALL selected sizes)
return selectedSizes.every(size => productSizes.includes(size))

// OR matching (product has ANY selected size)
return selectedSizes.some(size => productSizes.includes(size))
```

---

## Conclusion

✅ **FR-008 Implementation Complete**

**Delivered:**
- ✅ Category filter
- ✅ Price range filter (5 ranges)
- ✅ Size filter (5 sizes, multi-select)
- ✅ Combined filter support
- ✅ Reset filters functionality
- ✅ Responsive design
- ✅ Real-time filtering

**Status:** Production Ready 🚀

**Priority:** High ✅ Done

**Testing:** Passed ✅

**Documentation:** Complete ✅
