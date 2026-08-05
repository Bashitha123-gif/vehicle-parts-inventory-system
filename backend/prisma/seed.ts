import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


const adapter = new PrismaPg(pool);


const prisma = new PrismaClient({
  adapter,
});

async function main() {

  await prisma.role.createMany({
    data: [
      {
        name: 'Admin',
        description: 'Full system access',
      },
      {
        name: 'Manager',
        description: 'Manage inventory and sales',
      },
      {
        name: 'Cashier',
        description: 'Handle sales',
      },
      {
        name: 'Inventory Staff',
        description: 'Manage stock',
      },
    ],
    skipDuplicates: true,
  });


  await prisma.category.createMany({
    data: [
      { name: 'Engine Parts' },
      { name: 'Electrical' },
      { name: 'Body Parts' },
      { name: 'Suspension' },
      { name: 'Lights' },
      { name: 'Accessories' },
      { name: 'Filters' },
      { name: 'Oils' },
    ],
    skipDuplicates: true,
  });


  await prisma.brand.createMany({
    data: [
      { name: 'Toyota' },
      { name: 'Nissan' },
      { name: 'Suzuki' },
      { name: 'Honda' },
      { name: 'Mitsubishi' },
      { name: 'Mazda' },
    ],
    skipDuplicates: true,
  });


  console.log('Database seeded successfully');
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });