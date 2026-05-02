require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.user.deleteMany({ where: { email: 'test@example.com' } });
    await prisma.role.deleteMany({ where: { name: 'Admin' } });
    await prisma.organization.deleteMany({ where: { name: 'Test Law Firm' } });

    const org = await prisma.organization.create({
      data: {
        name: 'Test Law Firm',
      },
    });

    const role = await prisma.role.create({
      data: {
        organizationId: org.id,
        name: 'Admin',
        permissions: ['users:read', 'users:create', 'matters:read', 'matters:create', 'dashboard:read'],
      },
    });

    const passwordHash = await bcrypt.hash('password123', 12);
    const user = await prisma.user.create({
      data: {
        organizationId: org.id,
        roleId: role.id,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        passwordHash,
        status: 'ACTIVE',
      },
    });

    console.log('Test user created!');
    console.log('Email: test@example.com');
    console.log('Password: password123');
  } catch (e) {
    console.error('Error:', e.message);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
