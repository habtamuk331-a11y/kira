# Shop Manager - Quick Implementation Guide

## For Adding New Features

This guide provides step-by-step instructions for implementing the next features from the roadmap.

---

## 🎯 Feature #1: CSV Export

### Step 1: Install Dependency
```bash
cd client
npm install papaparse
npm install --save-dev @types/papaparse
```

### Step 2: Create Export Utility
Create `client/src/lib/export.ts`:
```typescript
import Papa from 'papaparse';

export function exportToCSV(data: any[], filename: string) {
  const csv = Papa.unparse(data);
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', `${filename}.csv`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
```

### Step 3: Add Export Button to SalesPage
```typescript
import { exportToCSV } from '../lib/export';

export function SalesPage() {
  const { data: sales } = useSales();
  
  const handleExport = () => {
    if (sales) {
      exportToCSV(sales, 'sales-export');
    }
  };
  
  return (
    <button onClick={handleExport} className="...">
      📥 Export CSV
    </button>
  );
}
```

### Step 4: Repeat for Expenses & Credits Pages

**Time: 1-2 hours**

---

## 🎯 Feature #2: Edit Transactions

### Step 1: Create API Endpoints (Backend)
Add to `server/src/index.ts`:
```typescript
// Edit sale
app.patch('/api/sales/:id', async (req, res) => {
  try {
    const { type, amount } = req.body;
    
    if (type && !['cash', 'mobile_banking'].includes(type)) {
      return res.status(400).json({ error: 'Invalid sale type' });
    }
    
    const sale = await prisma.sale.findUnique({
      where: { id: req.params.id },
    });
    
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    const updated = await prisma.sale.update({
      where: { id: req.params.id },
      data: {
        ...(type && { type }),
        ...(amount && { amount: Math.round(parseFloat(amount) * 100) / 100 }),
      },
    });
    
    res.json(updated);
  } catch (error) {
    console.error('Failed to update sale:', error);
    res.status(500).json({ error: 'Failed to update sale' });
  }
});

// Edit expense
app.patch('/api/expenses/:id', async (req, res) => {
  try {
    const { reason, amount } = req.body;
    
    const expense = await prisma.expense.findUnique({
      where: { id: req.params.id },
    });
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    const updated = await prisma.expense.update({
      where: { id: req.params.id },
      data: {
        ...(reason && { reason }),
        ...(amount && { amount: Math.round(parseFloat(amount) * 100) / 100 }),
      },
    });
    
    res.json(updated);
  } catch (error) {
    console.error('Failed to update expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});
```

### Step 2: Add API Client Methods
Add to `client/src/lib/api.ts`:
```typescript
export const saleApi = {
  // ... existing methods
  update: (id: string, data: { type?: string; amount?: number }) =>
    api.patch(`/sales/${id}`, data),
};

export const expenseApi = {
  // ... existing methods
  update: (id: string, data: { reason?: string; amount?: number }) =>
    api.patch(`/expenses/${id}`, data),
};
```

### Step 3: Add React Query Hook
Add to `client/src/hooks/useQueries.ts`:
```typescript
export function useUpdateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; type?: string; amount?: number }) =>
      saleApi.update(data.id, { type: data.type, amount: data.amount }),
    onSuccess: () => {
      toast.success('Sale updated successfully');
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['salesStats'] });
      queryClient.invalidateQueries({ queryKey: ['todayBreakdown'] });
      queryClient.invalidateQueries({ queryKey: ['salesChart'] });
    },
    onError: () => {
      toast.error('Failed to update sale');
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; reason?: string; amount?: number }) =>
      expenseApi.update(data.id, { reason: data.reason, amount: data.amount }),
    onSuccess: () => {
      toast.success('Expense updated successfully');
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expensesStats'] });
    },
    onError: () => {
      toast.error('Failed to update expense');
    },
  });
}
```

### Step 4: Create Edit Modal Component
Create `client/src/components/EditModal.tsx`:
```typescript
import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  title: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'number';
    value: any;
  }>;
}

export function EditModal({ isOpen, onClose, onSave, title, fields }: EditModalProps) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {})
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        
        {fields.map(field => (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            <Input
              type={field.type}
              value={formData[field.name]}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            />
          </div>
        ))}
        
        <div className="flex gap-2 justify-end">
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={() => { onSave(formData); onClose(); }}>Save</Button>
        </div>
      </div>
    </div>
  );
}
```

### Step 5: Integrate Edit Button in SalesPage
```typescript
const [editingId, setEditingId] = useState<string | null>(null);
const [editData, setEditData] = useState<any>(null);
const updateSale = useUpdateSale();

// In the table, replace delete button with:
<Button
  onClick={() => {
    setEditingId(sale.id);
    setEditData(sale);
  }}
  className="mr-2"
>
  ✏️ Edit
</Button>

// Add modal:
{editData && (
  <EditModal
    isOpen={!!editingId}
    onClose={() => setEditingId(null)}
    onSave={(data) => updateSale.mutate({ id: editingId!, ...data })}
    title="Edit Sale"
    fields={[
      { name: 'type', label: 'Type', type: 'text', value: editData.type },
      { name: 'amount', label: 'Amount', type: 'number', value: editData.amount },
    ]}
  />
)}
```

**Time: 3-4 hours**

---

## 🎯 Feature #3: Advanced Date Range Filtering

### Step 1: Create Filter Component
Create `client/src/components/DateRangeFilter.tsx`:
```typescript
import React, { useState } from 'react';
import { Button } from './Button';

interface DateRangeFilterProps {
  onFilter: (startDate: Date, endDate: Date) => void;
}

export function DateRangeFilter({ onFilter }: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [preset, setPreset] = useState<'week' | 'month' | 'custom' | ''>('');

  const applyPreset = (type: 'week' | 'month') => {
    const end = new Date();
    const start = new Date();
    
    if (type === 'week') {
      start.setDate(end.getDate() - 7);
    } else {
      start.setMonth(end.getMonth() - 1);
    }
    
    onFilter(start, end);
    setPreset(type);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-4">
      <div className="flex gap-2 mb-3">
        <Button
          onClick={() => applyPreset('week')}
          variant={preset === 'week' ? 'default' : 'outline'}
          size="sm"
        >
          This Week
        </Button>
        <Button
          onClick={() => applyPreset('month')}
          variant={preset === 'month' ? 'default' : 'outline'}
          size="sm"
        >
          This Month
        </Button>
      </div>
      
      {preset === 'custom' && (
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border rounded"
          />
          <Button
            onClick={() => onFilter(new Date(startDate), new Date(endDate))}
            size="sm"
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}
```

### Step 2: Add Filtering Hook
Add to `client/src/hooks/useQueries.ts`:
```typescript
export function useSalesFiltered(startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ['sales', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      let { data } = await saleApi.getAll();
      
      if (startDate && endDate) {
        data = data.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate >= startDate && saleDate <= endDate;
        });
      }
      
      return data;
    },
  });
}
```

### Step 3: Use in SalesPage
```typescript
const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
const { data: sales } = useSalesFiltered(dateRange?.[0], dateRange?.[1]);

return (
  <>
    <DateRangeFilter
      onFilter={(start, end) => setDateRange([start, end])}
    />
    {/* Sales table */}
  </>
);
```

**Time: 2-3 hours**

---

## 🎯 Feature #4: Batch Delete Operations

### Step 1: Update API
Add to `server/src/index.ts`:
```typescript
app.post('/api/sales/delete-batch', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid IDs' });
    }
    
    const result = await prisma.sale.deleteMany({
      where: { id: { in: ids } },
    });
    
    res.json({ deleted: result.count });
  } catch (error) {
    console.error('Failed to delete sales:', error);
    res.status(500).json({ error: 'Failed to delete sales' });
  }
});
```

### Step 2: Add Client Method
```typescript
export const saleApi = {
  // ... existing
  deleteBatch: (ids: string[]) => api.post('/sales/delete-batch', { ids }),
};
```

### Step 3: Add UI for Selection
```typescript
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

const toggleSelect = (id: string) => {
  const newSelected = new Set(selectedIds);
  if (newSelected.has(id)) {
    newSelected.delete(id);
  } else {
    newSelected.add(id);
  }
  setSelectedIds(newSelected);
};

// In table header:
<input
  type="checkbox"
  onChange={(e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(sales.map(s => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  }}
/>

// In each row:
<input
  type="checkbox"
  checked={selectedIds.has(sale.id)}
  onChange={() => toggleSelect(sale.id)}
/>

// Batch delete button:
{selectedIds.size > 0 && (
  <Button onClick={() => deleteSalesBatch.mutate(Array.from(selectedIds))}>
    Delete {selectedIds.size} Selected
  </Button>
)}
```

**Time: 2-3 hours**

---

## 📋 TESTING CHECKLIST

For each feature, verify:
- [ ] API endpoint returns correct data
- [ ] Frontend displays data correctly
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] No memory leaks
- [ ] Real-time updates work
- [ ] Error handling works

---

## 🚀 DEPLOYMENT STEPS

```bash
# 1. Test locally
npm run dev  # Both client and server

# 2. Build for production
npm run build

# 3. Run production build
npm start

# 4. Verify all features work
# - Open app
# - Test each feature
# - Check console for errors

# 5. Commit changes
git add .
git commit -m "Add feature: [Feature Name]"

# 6. Deploy (depends on your hosting)
```

---

## 📞 COMMON GOTCHAS

1. **Forgot to invalidate cache** - Query won't update after mutation
   ```typescript
   queryClient.invalidateQueries({ queryKey: ['sales'] });
   ```

2. **Type validation missing** - Invalid data gets stored
   ```typescript
   if (typeof value !== 'expected_type') {
     return res.status(400).json({ error: '...' });
   }
   ```

3. **Race conditions** - Multiple updates conflict
   ```typescript
   // Use optimistic updates:
   await queryClient.cancelQueries(['sales']);
   const previous = queryClient.getQueryData(['sales']);
   ```

4. **API routes order matters** - Specific routes before generic
   ```typescript
   // ✅ CORRECT
   app.delete('/api/sales/:id')  // Specific
   app.delete('/api/sales')      // Generic (won't work here)
   
   // ❌ WRONG
   app.delete('/api/sales')
   app.delete('/api/sales/:id')  // This pattern would never match
   ```

---

**Ready to build? Pick a feature and start with Step 1!**
