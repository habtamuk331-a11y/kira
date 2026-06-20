# Shop Manager - Quick Start with Authentication

## Get Started in 3 Steps

### Step 1: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Expected output:
```
✅ Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Expected output:
```
VITE v5.4.21 ready in 500ms
➜ Local:   http://localhost:5173/
```

---

### Step 2: Open the App

Go to: **http://localhost:5173**

You should see the **Login Page** automatically.

---

### Step 3: Create Your Account

Click **"Sign up"** and enter:
- **Full Name**: Your name
- **Email**: your-email@example.com
- **Password**: At least 6 characters
- **Confirm Password**: Same as above

Click **"Create Account"**

✅ You're logged in! Welcome to ShopManager.

---

## What You Can Do Now

### Dashboard
- View 4 summary cards:
  - Total Sales (This Month)
  - Total Sales (This Week)
  - Total Expense (This Week)
  - Total Credit Outstanding

### Sales Tab
- Add cash or mobile banking sales
- View 7-day sales chart
- Delete sales with confirmation
- Search/filter sales

### Expense Tab
- Add expenses with reason and amount
- View all expenses
- Delete expenses
- Total expense summary

### Credit Tab
- Record credit given to customers
- Mark credit as paid/unpaid
- Track outstanding credits
- Delete credit records

### Settings
- **Dark Mode**: Toggle in sidebar
- **User Profile**: View your name/email in sidebar
- **Logout**: Click logout button to exit

---

## Test Accounts

After registration, you can create multiple accounts:

**Account 1:**
- Email: manager@shop.com
- Password: password123
- Name: Manager

**Account 2:**
- Email: owner@shop.com
- Password: secure456
- Name: Owner

Each account has its own data!

---

## Features Available

### ✅ What Works
- User registration & login
- Secure password storage
- Session persistence (stay logged in)
- Add/edit/delete sales
- Add/edit/delete expenses
- Add/edit/delete credits
- Mark credits as paid
- 7-day sales chart
- Dark/light mode
- Responsive design
- Real-time updates

### ⏳ Coming Soon
- CSV export data
- Advanced date filtering
- Monthly summary view
- Batch operations
- Password reset
- Email verification

---

## Common Questions

### Q: How do I stay logged in?
**A**: Your login session is saved in browser storage. You'll stay logged in even after closing and reopening your browser.

### Q: How do I logout?
**A**: Click the **"Logout"** button in the sidebar at the bottom.

### Q: Can I delete my account?
**A**: Currently, you can't self-delete. Ask your system admin.

### Q: What if I forget my password?
**A**: Coming soon! For now, register with a new account.

### Q: Can multiple people use the same account?
**A**: Yes, but they'll see the same data. Consider creating separate accounts.

### Q: Is my data backed up?
**A**: No automatic backup. Data is in SQLite database. You can export CSV (coming soon).

### Q: Can I change my password?
**A**: Not yet. Coming soon with account settings page.

---

## Keyboard Shortcuts

- **Tab**: Navigate between form fields
- **Enter**: Submit forms
- **Dark Mode**: Use sidebar toggle

---

## Troubleshooting

### Servers Won't Start

**Error**: "Port already in use"
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Or change port
PORT=5001 npm run dev
```

### Can't Login

**Check**:
1. Email is correct
2. Password is correct (case-sensitive)
3. Backend server is running
4. No network errors in DevTools

### Data Not Saving

**Check**:
1. No console errors (DevTools > Console)
2. Network requests succeed (DevTools > Network)
3. Backend server is running
4. Database exists at `server/prisma/dev.db`

### Stuck on Login Page

**Solution**:
```javascript
// In browser console:
localStorage.removeItem('shopManagerToken');
localStorage.removeItem('shopManagerUser');
location.reload();
```

---

## Database Location

Your data is stored in:
```
server/prisma/dev.db
```

This is a SQLite database. You can:
- Backup: `cp server/prisma/dev.db server/prisma/dev.db.backup`
- Reset: `rm server/prisma/dev.db && npm run seed` (in server folder)

---

## File Structure

```
shop-manager/
├── client/              # React frontend
│   └── src/
│       ├── pages/       # Dashboard, Sales, Expense, Credit, Login, Register
│       ├── components/  # UI components
│       ├── contexts/    # AuthContext
│       ├── hooks/       # Data fetching hooks
│       └── lib/         # Utilities, API client
│
├── server/              # Express backend
│   ├── src/
│   │   ├── index.ts     # All API endpoints
│   │   ├── middleware/  # auth.ts
│   │   └── utils.ts     # Helpers
│   └── prisma/
│       ├── schema.prisma    # Database schema
│       └── dev.db           # SQLite database
│
└── docs/                # Documentation
```

---

## API Endpoints

All endpoints return JSON.

### Authentication (No login needed)
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (needs token)

### Sales (Needs login)
- `GET /api/sales` - List all sales
- `POST /api/sales` - Add sale
- `DELETE /api/sales/:id` - Delete sale
- `GET /api/sales/stats/overview` - Monthly/weekly totals
- `GET /api/sales/today/breakdown` - Cash vs mobile today
- `GET /api/sales/chart/last7days` - 7-day chart data

### Expenses (Needs login)
- `GET /api/expenses` - List all
- `POST /api/expenses` - Add expense
- `DELETE /api/expenses/:id` - Delete
- `GET /api/expenses/stats/overview` - Monthly/weekly totals

### Credits (Needs login)
- `GET /api/credits` - List all
- `POST /api/credits` - Add credit
- `PATCH /api/credits/:id` - Mark as paid/unpaid
- `DELETE /api/credits/:id` - Delete
- `GET /api/credits/stats/outstanding` - Total unpaid

---

## Support

For issues or questions:

1. Check `AUTHENTICATION_GUIDE.md` for detailed docs
2. Check `README.md` for general info
3. Review error messages carefully
4. Check browser console (F12 > Console tab)
5. Check server logs (terminal window)

---

## Next Steps

After getting comfortable with the basics:

1. **Add Sample Data** - Create some sales/expenses
2. **Explore Features** - Try adding and deleting items
3. **Check Dark Mode** - Toggle in sidebar
4. **Try Logout/Login** - Test session persistence
5. **Read Docs** - Check `FEATURE_ROADMAP.md` for upcoming features

---

## Happy Selling! 🚀

ShopManager is ready to help you track your business.
Start adding data and watch your insights grow!
