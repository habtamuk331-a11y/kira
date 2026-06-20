# Shop Manager - Recommended Next Features

## Priority 1: HIGH IMPACT (1-2 days of work each)

### 1. **CSV/Excel Export**
```
Why: Users often need to extract data for accounting, analysis, or backup
Where: Add buttons on each page (Sales, Expenses, Credits)
API Endpoint: GET /api/sales/export?format=csv
Frontend: Use papaparse or csv-stringify library
```

**Benefits:**
- External data backup
- Integration with accounting software
- Data analysis in Excel
- Compliance/audit trail

**Effort:** 4-6 hours

---

### 2. **Advanced Date Range Filtering**
```
Why: Users need to view specific periods (e.g., "Jan 2026" or "Mar 15 - Apr 15")
Where: Add filter panels above tables
Features:
  - Preset ranges (This Week, This Month, Last 30 Days, Custom)
  - Date pickers for custom range
  - Filter by amount range (Min-Max)
```

**Example Implementation:**
```typescript
// Query: GET /api/sales?startDate=2026-03-01&endDate=2026-03-31&minAmount=100
const filtered = sales.filter(s => 
  s.createdAt >= startDate && 
  s.createdAt <= endDate &&
  s.amount >= minAmount
);
```

**Benefits:**
- Better data analysis
- Easier accounting period management
- Pinpoint specific transactions

**Effort:** 6-8 hours

---

### 3. **Edit Existing Transactions** (Currently only Delete allowed)
```
Why: Users sometimes need to correct mistakes without losing history
Where: Add PATCH endpoints for Sales and Expenses
Current: DELETE only
New: EDIT button → Modal → Update amount/type/reason
```

**Implementation:**
```typescript
// New endpoints
PATCH /api/sales/:id { type, amount }
PATCH /api/expenses/:id { reason, amount }

// Changes automatically invalidate React Query cache
```

**Benefits:**
- Error correction without deletion
- Maintains accurate history
- Better user experience

**Effort:** 4-6 hours

---

## Priority 2: MEDIUM IMPACT (4-8 hours each)

### 4. **Monthly Summary Dashboard**
```
Route: /monthly-summary (new page)
Display:
  - Monthly breakdown table (months vs sales/expenses)
  - Monthly profit/loss calculation
  - Year-to-date totals
  - Comparison charts (this month vs last month)
```

**Data Structure:**
```typescript
{
  month: "2026-03",
  sales: 45000,
  expenses: 12000,
  credits_issued: 5000,
  credits_paid: 3000,
  net_profit: 33000
}
```

**Effort:** 6-8 hours

---

### 5. **Batch Operations**
```
Features:
  - Multi-select checkboxes on tables
  - "Delete Selected" button
  - "Export Selected" button
  - Bulk mark credit as paid
```

**API Endpoints:**
```
POST /api/sales/delete-batch { ids: [id1, id2, ...] }
POST /api/expenses/delete-batch { ids: [...] }
PATCH /api/credits/mark-paid-batch { ids: [...] }
```

**Benefits:**
- Faster data cleanup
- Easier bulk operations
- Better UX for large datasets

**Effort:** 4-6 hours

---

### 6. **Undo/Redo Functionality**
```
Session-based undo stack:
  - Store last 10 deletions in memory
  - "Undo" button in toast notifications
  - Sidebar: "Recent Actions" panel

Implementation:
  - Create UndoStack hook
  - Intercept mutations
  - Store deleted records temporarily
```

**Benefit:** User-friendly error recovery

**Effort:** 5-7 hours

---

## Priority 3: POLISH & NICE-TO-HAVE (2-4 hours each)

### 7. **Data Sync Status Indicator**
```
Show:
  - Last sync time in header
  - "Offline" badge if API unreachable
  - Retry button for failed operations
  - Queue badge showing pending operations
```

**Implementation:**
```typescript
// useApiStatus hook
const lastSync = new Date();
const isOffline = !navigator.onLine;
const pendingOps = queryClient.getQueriesData(['pending']);
```

---

### 8. **Duplicate Transaction Warning**
```
When adding new transaction:
  - Check if similar transaction exists in last 5 minutes
  - Show warning: "Similar transaction added 2 mins ago"
  - Allow user to confirm or cancel
```

---

### 9. **Print View / PDF Reports**
```
Routes:
  - /print/sales (last 30 days)
  - /print/expenses (last 30 days)
  - /print/monthly-summary (current year)

Features:
  - Clean formatting for printing
  - PDF generation (use html2pdf library)
  - Logo/header customization
```

---

### 10. **Search Across All Transactions**
```
Global search bar in header:
  - Search by amount: "100"
  - Search by reason/owner name: "rent"
  - Search by type: "cash"
  - Fuzzy search with highlighting
```

---

## Priority 4: FUTURE ENHANCEMENTS (Complex, >2 days each)

### 11. **User Authentication & Multi-User**
- Login system (username/password or OAuth)
- Role-based access (Admin, Manager, Viewer)
- Audit logs (who did what when)
- Multi-user collaboration

### 12. **Recurring Transactions**
- Set up recurring expenses (rent, utilities)
- Auto-generate on schedule
- Edit/skip individual instances
- Dashboard alerts for upcoming recurring

### 13. **Budget Planning**
- Set monthly budget for expenses
- Track actual vs budget
- Alerts when approaching limit
- Visual progress indicators

### 14. **Inventory Module**
- Track products (name, qty, cost)
- Link sales to inventory
- Auto-calculate COGS
- Low stock alerts

### 15. **Multi-Currency Support**
- Support multiple currencies
- Exchange rate conversion
- Display in user's preferred currency
- Historical rate tracking

---

## Implementation Checklist Template

For each feature, follow this pattern:

```typescript
// 1. Add API endpoint (backend)
app.get('/api/feature', async (req, res) => {
  try {
    const data = await prisma.model.findMany();
    res.json(data);
  } catch (error) {
    console.error('Failed:', error);
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// 2. Add API client method (frontend)
export const featureApi = {
  getAll: () => api.get('/feature'),
};

// 3. Add React Query hook
export function useFeature() {
  return useQuery({
    queryKey: ['feature'],
    queryFn: async () => {
      const { data } = await featureApi.getAll();
      return data;
    },
  });
}

// 4. Create component
export function FeatureComponent() {
  const { data, isLoading } = useFeature();
  return <div>{/* Render data */}</div>;
}

// 5. Add route
<Route path="/feature" element={<FeatureComponent />} />

// 6. Add sidebar navigation
<SidebarItem label="Feature" icon={<IconName />} />
```

---

## Performance Optimization Opportunities

1. **Virtual Scrolling** - For large tables (100+ rows), use react-window
2. **Query Pagination** - Fetch 50 items at a time instead of all
3. **Indexed Queries** - Add database indexes on date fields
4. **Caching** - Cache aggregation results (update every 5 mins)
5. **Image Optimization** - Compress any logos/images

---

## Testing Recommendations

Before deploying any new feature:

```bash
# 1. Unit tests for utilities
npm run test

# 2. Manual testing checklist
- Add new item ✓
- Edit new item ✓
- Delete new item ✓
- Dark mode toggle ✓
- Mobile responsive ✓
- Error handling ✓

# 3. API testing
curl http://localhost:5000/api/feature

# 4. Database verification
SELECT COUNT(*) FROM table_name;
```

---

## Database Schema Changes

If adding new features, consider adding:

```prisma
// Example: If adding notes/comments
model TransactionNote {
  id        String   @id @default(cuid())
  content   String
  saleId    String
  sale      Sale     @relation(fields: [saleId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Then migrate:
npx prisma migrate dev --name add_notes
```

---

## Feedback & User Requests

As you gather feedback, track feature requests here:
- [ ] Feature X (requested by user Y on DATE)
- [ ] Feature Z (affects N% of users)

Prioritize based on:
1. **Impact** - How many users benefit?
2. **Effort** - How long to implement?
3. **Complexity** - Risk of introducing bugs?

---

## Deployment Strategy

When deploying new features:

```bash
# 1. Backup current database
cp server/prisma/dev.db server/prisma/dev.db.backup

# 2. Run migrations (if schema changed)
npx prisma migrate deploy

# 3. Test in staging
npm run build
npm run dev

# 4. Deploy to production
# (Step depends on your hosting)

# 5. Monitor for errors
# Check server logs, database queries, etc.
```

---

**Last Updated**: June 19, 2026
**Current Version**: 1.0.0 (Post-Fix)
