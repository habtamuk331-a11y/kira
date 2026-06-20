# Shop Manager - Professional Shop Management System

A complete, production-ready shop management system built with modern web technologies. Manage sales, expenses, and credits with a beautiful, responsive interface.

## 🎯 Features

- **Dashboard**: Real-time summary cards for sales, expenses, and outstanding credits
- **Sales Management**: Track cash and mobile banking sales with 7-day trend chart
- **Expense Tracking**: Record and categorize business expenses
- **Credit Management**: Manage customer credits with paid/unpaid status
- **Dark Mode**: Professional dark mode support with persistent storage
- **Real-time Updates**: All data updates instantly without page refresh
- **Search & Filter**: Find records quickly across all modules
- **Toast Notifications**: User-friendly feedback for all actions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Input Validation**: Comprehensive validation with inline error messages
- **Confirmation Dialogs**: Safe deletion with confirmation prompts

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **TanStack Query (React Query)** for state management and data fetching
- **Recharts** for beautiful charts
- **Lucide React** for icons
- **React Router** for navigation
- **Sonner** for toast notifications

### Backend
- **Node.js** with Express
- **Prisma ORM** for database operations
- **SQLite** for data storage (zero-configuration, file-based)
- **TypeScript** for type safety

## 📦 Project Structure

```
shop-manager/
├── server/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── index.ts          # Main Express server
│   │   ├── prisma/
│   │   │   └── seed.ts       # Database seed script
│   │   └── routes/
│   ├── prisma/
│   │   └── schema.prisma     # Prisma schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.tsx           # Main app component
│   │   ├── main.tsx          # Entry point
│   │   ├── index.css         # Global styles
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utilities and API client
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation & Setup

1. **Clone and navigate to the project:**
```bash
cd shop-manager
```

2. **Install server dependencies:**
```bash
cd server
npm install
```

3. **Set up the database:**
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations to create the database
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

4. **Start the server:**
```bash
npm run dev
```

The server will start on `http://localhost:5000`

5. **In a new terminal, install client dependencies:**
```bash
cd client
npm install
```

6. **Start the client:**
```bash
npm run dev
```

The client will open at `http://localhost:5173`

## 📖 Usage

### Dashboard
- View summary statistics for the current month and week
- Monitor total outstanding credits
- Get an overview of your shop's performance

### Sales Tab
- View a 7-day trend chart of sales
- Add cash or mobile banking sales
- See today's breakdown by payment method
- Track all sales with filtering and search
- Delete sales with confirmation

### Expense Tab
- Add expenses with reason and amount
- View all expenses with date/time
- Search and filter expenses
- Delete expenses with confirmation
- Monitor weekly total expenses

### Credit Tab
- Add credit for customers
- Mark credits as paid/unpaid
- Outstanding credits automatically calculate
- Search and filter credits
- Delete credits with confirmation

## 🛠️ Development

### Server Scripts
```bash
npm run dev              # Start development server with auto-reload
npm run build            # Build TypeScript to JavaScript
npm run start            # Run production server
npm run prisma:migrate   # Run database migrations
npm run prisma:generate  # Generate Prisma client
npm run prisma:seed      # Seed database with sample data
```

### Client Scripts
```bash
npm run dev              # Start Vite dev server with hot reload
npm run build            # Build for production
npm run preview          # Preview production build
```

## 📊 Database Schema

### Sale
```typescript
{
  id: string           // Auto-generated ID
  type: enum          // "cash" or "mobile_banking"
  amount: float       // Sale amount
  createdAt: datetime // Timestamp
}
```

### Expense
```typescript
{
  id: string           // Auto-generated ID
  reason: string       // Expense description
  amount: float       // Expense amount
  createdAt: datetime // Timestamp
}
```

### Credit
```typescript
{
  id: string           // Auto-generated ID
  ownerName: string    // Customer name
  amount: float       // Credit amount
  isPaid: boolean     // Payment status (default: false)
  createdAt: datetime // Timestamp
}
```

## 🎨 Features in Detail

### Real-time Updates
All data updates instantly across the application without requiring a page refresh. When you add, delete, or update a record, related charts, totals, and tables update immediately.

### Validation
- Empty fields are rejected
- Negative amounts are not allowed
- All inputs are validated before submission
- Clear error messages guide users

### Dark Mode
- Toggle between light and dark modes
- Preference is saved in localStorage
- Professional color schemes for both modes
- Smooth transitions

### Search & Filter
- Search across all tables
- Filters work in real-time
- Case-insensitive matching
- Supports multiple fields

### Responsive Design
- Works on mobile (320px+), tablet, and desktop
- Flexible grid layouts
- Touch-friendly buttons and inputs
- Optimized table views for smaller screens

## 🔒 Security Notes

- All data is stored locally in SQLite
- No data is sent to external servers
- Input validation prevents malicious data
- CORS is properly configured
- Sensitive operations require confirmation

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Server won't start
- Check if port 5000 is available
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run build`

### Client won't connect to API
- Verify server is running on `http://localhost:5000`
- Check browser console for CORS errors
- Ensure API proxy is configured in `vite.config.ts`

### Database issues
- Delete `server/prisma/dev.db` to reset
- Run migrations again: `npm run prisma:migrate`
- Re-seed data: `npm run prisma:seed`

### Port conflicts
- Change SERVER port in `server/.env` (default: 5000)
- Change CLIENT port in `client/vite.config.ts` (default: 5173)

## 📝 License

This project is provided as-is for educational and commercial use.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Check browser console for error messages
4. Verify all dependencies are installed correctly

## 📈 Future Enhancements

Potential features for future versions:
- Export data to CSV/PDF
- Advanced analytics and reporting
- Multi-user authentication
- Cloud backup support
- Receipt printing
- Inventory management
- Customer profiles
- Recurring transactions

---

**Version**: 1.0.0  
**Last Updated**: 2026  
**Status**: Production Ready ✅
