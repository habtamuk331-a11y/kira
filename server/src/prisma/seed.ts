import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.sale.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.credit.deleteMany();

  // Seed Sales
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < 20; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const date = new Date(today.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
    
    await prisma.sale.create({
      data: {
        type: Math.random() > 0.5 ? 'cash' : 'mobile_banking',
        amount: Math.floor(Math.random() * 10000) / 100 + 100,
        createdAt: date,
      },
    });
  }

  // Seed Expenses
  const reasons = ['Rent', 'Utilities', 'Supplies', 'Salaries', 'Marketing', 'Maintenance'];
  for (let i = 0; i < 15; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const date = new Date(today.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
    
    await prisma.expense.create({
      data: {
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        amount: Math.floor(Math.random() * 5000) / 100 + 50,
        createdAt: date,
      },
    });
  }

  // Seed Credits
  const names = ['John Doe', 'Jane Smith', 'Ahmed Hassan', 'Maria Garcia', 'Liu Chen'];
  for (let i = 0; i < 8; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 60);
    const date = new Date(today.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
    
    await prisma.credit.create({
      data: {
        ownerName: names[Math.floor(Math.random() * names.length)],
        amount: Math.floor(Math.random() * 20000) / 100 + 500,
        isPaid: Math.random() > 0.6,
        createdAt: date,
      },
    });
  }

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
