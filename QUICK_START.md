# SHOP MANAGER - Quick Start Guide

## ✅ Project Status: COMPLETE & RUNNING

Your Shop Manager system is fully built and currently running!

- ✅ Backend API: http://localhost:5000
- ✅ Frontend UI: http://localhost:5173
- ✅ Database: SQLite (auto-created at server/prisma/dev.db)
- ✅ Sample Data: Pre-seeded with realistic data

## 🚀 IMMEDIATE NEXT STEPS

### 1. Access the Application
Open your browser and go to: **http://localhost:5173**

You should see:
- A professional sidebar with navigation (Dashboard, Sales, Expense, Credit)
- A clean header with the app name and current date
- The Dashboard with 4 summary stat cards showing totals

### 2. Test the Features

#### Dashboard
- View statistics cards for monthly/weekly sales, expenses, and outstanding credits
- All totals update in real-time

#### Sales Tab
- See a 7-day trend chart of sales
- Add cash and mobile banking sales
- View today's breakdown by payment type
- Complete table of all sales with search
- Delete sales with confirmation

#### Expense Tab
- Add expenses with reason and amount
- View weekly expense total
- Search and filter expenses
- Delete with confirmation

#### Credit Tab
- Track customer credit with paid/unpaid status
- Outstanding credit total updates automatically
- Toggle payment status with checkboxes
- Delete credits as needed

#### Dark Mode
- Click the "Dark Mode" button in the sidebar to toggle
- Your preference is saved

### 3. Test API Endpoints (Optional)
The backend provides these endpoints:

```
# Sales
GET    /api/sales
GET    /api/sales/stats/overview
GET    /api/sales/today/breakdown
GET    /api/sales/chart/last7days
POST   /api/sales
DELETE /api/sales/:id

# Expenses
GET    /api/expenses
GET    /api/expenses/stats/overview
POST   /api/expenses
DELETE /api/expenses/:id

# Credits
GET    /api/credits
GET    /api/credits/stats/outstanding
POST   /api/credits
PATCH  /api/credits/:id
DELETE /api/credits/:id
```

Test with curl:
```bash
curl http://localhost:5000/api/sales
```

## 📂 Project Structure

```
shop-manager/
├── server/                    # Express + Prisma backend
│   ├── src/
│   │   ├── index.ts          # Main server file with all routes
│   │   └── prisma/
│   │       └── seed.ts       # Sample data
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── dev.db            # SQLite database (auto-created)
│   │   └── migrations/       # Database migrations
│   ├── package.json
│   └── tsconfig.json
│
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx           # Main app with routing
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and API client
│   │   └── index.css         # Tailwind styles
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
└── README.md                 # Full documentation
```

## 🛠️ Running the Project

### Already Running?
If you see this file, the project is likely already running!

Both servers are in the background:
- **Server**: Terminal running `npm run dev` in server/
- **Client**: Terminal running `npm run dev` in client/

### Start Fresh (if needed)

#### Terminal 1 - Start Server:
```bash
cd shop-manager/server
npm run dev
```

#### Terminal 2 - Start Client:
```bash
cd shop-manager/client
npm run dev
```

Then open: http://localhost:5173

### Reset Database
If you want to reset the database:

```bash
cd server
rm -f prisma/dev.db
npm run prisma:migrate
npm run prisma:seed
```

## 📊 Sample Data

The database comes pre-seeded with:
- 20 sales (cash and mobile banking)
- 15 expenses (various categories)
- 8 credits (some paid, some unpaid)
- Data spread across the last 30 days

## 🎨 Key Features

### Live Updates
Every action updates instantly:
- Add a sale → chart updates, totals update, table refreshes
- Mark credit as paid → outstanding credit updates
- Delete expense → weekly total recalculates

### Input Validation
- No empty fields allowed
- Negative amounts rejected
- Clear error messages shown

### Confirmation Dialogs
- All deletions require confirmation
- Prevents accidental data loss

### Search & Filter
- Type in search boxes to filter tables
- Works across all modules

### Dark Mode
- Toggle in sidebar
- Saved in browser localStorage
- Beautiful dark color scheme

### Currency Formatting
- All amounts displayed as ₨ (Rupee)
- Consistent formatting everywhere

## 🔧 Configuration

### Change Currency Symbol
Edit `client/src/lib/utils.ts`:
```typescript
export function formatCurrency(amount: number, currency = '₨'): string {
  return `${currency} ${amount.toFixed(2)}`;
}
```

Change `'₨'` to your preferred symbol (e.g., `'$'`, `'€'`, `'£'`)

### Change Server Port
Edit `server/.env`:
```
PORT=5000  // Change to your desired port
```

### Change Client Port
Edit `client/vite.config.ts`:
```typescript
server: {
  port: 5173,  // Change to your desired port
}
```

## 📈 Database Schema

### Sale Table
```sql
CREATE TABLE Sale (
  id        TEXT PRIMARY KEY
  type      TEXT              -- "cash" or "mobile_banking"
  amount    FLOAT
  createdAt DATETIME
)
```

### Expense Table
```sql
CREATE TABLE Expense (
  id        TEXT PRIMARY KEY
  reason    TEXT
  amount    FLOAT
  createdAt DATETIME
)
```

### Credit Table
```sql
CREATE TABLE Credit (
  id        TEXT PRIMARY KEY
  ownerName TEXT
  amount    FLOAT
  isPaid    BOOLEAN DEFAULT false
  createdAt DATETIME
)
```

## 🧪 Testing Checklist

- [ ] Dashboard loads with 4 stat cards
- [ ] Sales chart shows 7 days of data
- [ ] Add a cash sale and see totals update
- [ ] Add a mobile banking sale
- [ ] Add an expense and see weekly total update
- [ ] Add a credit and see outstanding amount
- [ ] Mark credit as paid and see it disappear from total
- [ ] Delete a sale and see chart/totals update
- [ ] Search in each table works
- [ ] Dark mode toggle works
- [ ] Confirmation dialogs appear on delete
- [ ] Toast notifications show for all actions
- [ ] Data persists after page refresh

## ⚠️ Common Issues

### Port Already in Use
If you see "port already in use":
1. Find process: `lsof -i :5000` or `netstat -ano | findstr :5000`
2. Kill it or use different port
3. Update .env or vite.config.ts

### Database Locked
If you see "database is locked":
1. Stop all running processes
2. Delete `server/prisma/dev.db`
3. Run migrations again: `npm run prisma:migrate`

### API Not Responding
- Check server is running: `curl http://localhost:5000/api/health`
- Check CORS is enabled (it is, in index.ts)
- Check port matches in vite.config.ts

## 📞 Support

- **Backend docs**: See server/src/index.ts for all routes
- **Frontend docs**: See README.md for full documentation
- **Errors**: Check browser console (F12) and terminal output

## ✨ What's Next?

### Build for Production
```bash
# Server
cd server
npm run build

# Client
cd client
npm run build
npm run preview
```

### Deploy
The project is ready for:
- Heroku
- Vercel (frontend)
- AWS
- Docker (with Dockerfile)
- Any Node.js hosting

### Customize
- Change colors in tailwind.config.ts
- Add new pages in client/src/pages/
- Add new API routes in server/src/index.ts
- Modify database schema in server/prisma/schema.prisma

---

**You're all set! Open http://localhost:5173 and start using Shop Manager! 🎉**
