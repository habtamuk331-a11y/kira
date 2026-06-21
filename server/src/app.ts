import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { authMiddleware, generateToken, AuthRequest } from './middleware/auth.js';
import { prisma } from './prisma/client.js';
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
  if (!req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? req.url : `/${req.url}`}`;
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============ AUTH ROUTES (No auth required) ============

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user (requires auth)
app.get('/api/auth/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true },
    });

    res.json(user);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ============ SALES ROUTES ============

// Get all sales
app.get('/api/sales', async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// Create sale
app.post('/api/sales', async (req, res) => {
  try {
    const { type, amount } = req.body;

    if (!type || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const sale = await prisma.sale.create({
      data: {
        type,
        amount: Math.round(parseFloat(amount) * 100) / 100,
      },
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sale' });
  }
});

// Delete sale
app.delete('/api/sales/:id', async (req, res) => {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: req.params.id },
    });
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    await prisma.sale.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete sale:', error);
    res.status(500).json({ error: 'Failed to delete sale' });
  }
});

// Get sales stats (for dashboard)
app.get('/api/sales/stats/overview', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());

    const thisMonthStart = new Date(today);
    thisMonthStart.setDate(1);

    const thisMonthSales = await prisma.sale.aggregate({
      where: {
        createdAt: {
          gte: thisMonthStart,
        },
      },
      _sum: { amount: true },
    });

    const thisWeekSales = await prisma.sale.aggregate({
      where: {
        createdAt: {
          gte: thisWeekStart,
        },
      },
      _sum: { amount: true },
    });

    res.json({
      thisMonth: thisMonthSales._sum.amount || 0,
      thisWeek: thisWeekSales._sum.amount || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get today's sales by type
app.get('/api/sales/today/breakdown', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const cash = todaySales
      .filter(s => s.type === 'cash')
      .reduce((sum, s) => sum + s.amount, 0);

    const mobileBanking = todaySales
      .filter(s => s.type === 'mobile_banking')
      .reduce((sum, s) => sum + s.amount, 0);

    res.json({ cash, mobileBanking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch breakdown' });
  }
});

// Get sales for last 7 days (for chart)
app.get('/api/sales/chart/last7days', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      const sales = await prisma.sale.aggregate({
        where: {
          createdAt: {
            gte: date,
            lt: nextDay,
          },
        },
        _sum: { amount: true },
      });

      data.push({
        day: dayName,
        date: date.toISOString().split('T')[0],
        total: sales._sum.amount || 0,
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// ============ EXPENSE ROUTES ============

// Get all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Create expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { reason, amount } = req.body;

    if (!reason || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const expense = await prisma.expense.create({
      data: {
        reason,
        amount: Math.round(parseFloat(amount) * 100) / 100,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Delete expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id: req.params.id },
    });
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    await prisma.expense.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Get expense stats
app.get('/api/expenses/stats/overview', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());

    const thisMonthStart = new Date(today);
    thisMonthStart.setDate(1);

    const thisMonthExpenses = await prisma.expense.aggregate({
      where: {
        createdAt: {
          gte: thisMonthStart,
        },
      },
      _sum: { amount: true },
    });

    const thisWeekExpenses = await prisma.expense.aggregate({
      where: {
        createdAt: {
          gte: thisWeekStart,
        },
      },
      _sum: { amount: true },
    });

    res.json({
      thisMonth: thisMonthExpenses._sum.amount || 0,
      thisWeek: thisWeekExpenses._sum.amount || 0,
    });
  } catch (error) {
    console.error('Failed to fetch expense stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ============ CREDIT ROUTES ============

// Get all credits
app.get('/api/credits', async (req, res) => {
  try {
    const credits = await prisma.credit.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(credits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch credits' });
  }
});

// Create credit
app.post('/api/credits', async (req, res) => {
  try {
    const { ownerName, amount } = req.body;

    if (!ownerName || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const credit = await prisma.credit.create({
      data: {
        ownerName,
        amount: Math.round(parseFloat(amount) * 100) / 100,
      },
    });

    res.status(201).json(credit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create credit' });
  }
});

// Update credit payment status
app.patch('/api/credits/:id', async (req, res) => {
  try {
    const { isPaid } = req.body;

    if (typeof isPaid !== 'boolean') {
      return res.status(400).json({ error: 'isPaid must be a boolean' });
    }

    const credit = await prisma.credit.findUnique({
      where: { id: req.params.id },
    });
    if (!credit) {
      return res.status(404).json({ error: 'Credit not found' });
    }

    const updatedCredit = await prisma.credit.update({
      where: { id: req.params.id },
      data: { isPaid },
    });

    res.json(updatedCredit);
  } catch (error) {
    console.error('Failed to update credit:', error);
    res.status(500).json({ error: 'Failed to update credit' });
  }
});

// Delete credit
app.delete('/api/credits/:id', async (req, res) => {
  try {
    const credit = await prisma.credit.findUnique({
      where: { id: req.params.id },
    });
    if (!credit) {
      return res.status(404).json({ error: 'Credit not found' });
    }
    await prisma.credit.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete credit:', error);
    res.status(500).json({ error: 'Failed to delete credit' });
  }
});

// Get credit stats
app.get('/api/credits/stats/outstanding', async (req, res) => {
  try {
    const outstandingCredits = await prisma.credit.aggregate({
      where: {
        isPaid: false,
      },
      _sum: { amount: true },
    });

    res.json({
      outstanding: outstandingCredits._sum.amount || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default app;
