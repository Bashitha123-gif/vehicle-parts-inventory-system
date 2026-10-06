import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
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

  const adminRole = await prisma.role.findUnique({
    where: {
      name: 'Admin',
    },
  });

  if (!adminRole) {
    throw new Error('Admin role not found');
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  await prisma.user.upsert({
    where: {
      email: 'admin@gmail.com',
    },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      roleId: adminRole.id,
    },
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
