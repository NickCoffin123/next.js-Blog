// prisma/seed.js
// Week 12 - Day 2: Seed test users for GitLab OAuth lab

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // Admin user — full access
    await prisma.user.upsert({
        where: { email: 'admin@blog.com' },
        update: {},
        create: {
            email: 'admin@blog.com',
            name: 'Admin User',
            role: 'admin',
        },
    });

    // Author user — can only edit own posts
    await prisma.user.upsert({
        where: { email: 'author@blog.com' },
        update: {},
        create: {
            email: 'author@blog.com',
            name: 'Author User',
            role: 'author',
        },
    });

    console.log('Seed complete! Test accounts ready:');
    console.log('→ admin@blog.com  (role: admin)');
    console.log('→ author@blog.com (role: author)');
}

main()
    .catch((e) => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
