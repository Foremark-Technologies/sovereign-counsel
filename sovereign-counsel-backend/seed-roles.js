require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const ROLES = {
  ADMIN: {
    name: 'Admin',
    permissions: [
      'users:read',
      'users:create',
      'users:update',
      'users:delete',
      'roles:read',
      'roles:create',
      'roles:update',
      'matters:read',
      'matters:create',
      'matters:update',
      'matters:delete',
      'matters:assign',
      'tasks:read',
      'tasks:create',
      'tasks:update',
      'tasks:delete',
      'documents:read',
      'documents:create',
      'documents:delete',
      'billing:read',
      'billing:create',
      'billing:update',
      'dashboard:read',
    ],
  },
  MANAGING_PARTNER: {
    name: 'Managing Partner',
    permissions: [
      'users:read',
      'users:create',
      'matters:read',
      'matters:create',
      'matters:update',
      'matters:assign',
      'tasks:read',
      'tasks:create',
      'documents:read',
      'documents:create',
      'billing:read',
      'billing:create',
      'dashboard:read',
    ],
  },
  PARTNER: {
    name: 'Partner',
    permissions: [
      'users:read',
      'matters:read',
      'matters:create',
      'matters:update',
      'matters:assign',
      'tasks:read',
      'tasks:create',
      'tasks:update',
      'documents:read',
      'documents:create',
      'billing:read',
      'dashboard:read',
    ],
  },
  ASSOCIATE: {
    name: 'Associate',
    permissions: [
      'matters:read',
      'tasks:read',
      'tasks:create',
      'tasks:update',
      'documents:read',
      'documents:create',
      'dashboard:read',
    ],
  },
  PARALEGAL: {
    name: 'Paralegal',
    permissions: [
      'matters:read',
      'tasks:read',
      'tasks:create',
      'documents:read',
      'documents:create',
      'dashboard:read',
    ],
  },
  FINANCE: {
    name: 'Finance',
    permissions: [
      'billing:read',
      'billing:create',
      'billing:update',
      'documents:read',
      'dashboard:read',
    ],
  },
};

async function main() {
  try {
    // Get or create organization
    let org = await prisma.organization.findFirst({
      where: { name: 'Test Law Firm' },
    });

    if (!org) {
      org = await prisma.organization.create({
        data: { name: 'Test Law Firm' },
      });
      console.log('✅ Organization created');
    }

    // Create/Update roles
    for (const [key, roleData] of Object.entries(ROLES)) {
      await prisma.role.upsert({
        where: {
          organizationId_name: {
            organizationId: org.id,
            name: roleData.name,
          },
        },
        update: {
          permissions: roleData.permissions,
        },
        create: {
          organizationId: org.id,
          name: roleData.name,
          permissions: roleData.permissions,
          isSystemRole: true,
        },
      });
      console.log(`✅ Role created: ${roleData.name}`);
    }

    // Create test admin user
    const adminRole = await prisma.role.findFirst({
      where: { organizationId: org.id, name: 'Admin' },
    });

    const passwordHash = await bcrypt.hash('password123', 12);
    await prisma.user.upsert({
      where: {
        organizationId_email: {
          organizationId: org.id,
          email: 'admin@testfirm.com',
        },
      },
      update: {},
      create: {
        organizationId: org.id,
        roleId: adminRole.id,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@testfirm.com',
        passwordHash,
        status: 'ACTIVE',
      },
    });

    console.log('✅ Admin user created: admin@testfirm.com / password123');
    console.log('\n📋 Test credentials:');
    console.log('  Email: admin@testfirm.com');
    console.log('  Password: password123');
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
