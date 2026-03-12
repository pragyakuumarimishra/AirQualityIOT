import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const station1 = await prisma.sensorStation.create({
    data: {
      name: 'Central Park Station',
      latitude: 40.7851,
      longitude: -73.9683,
      status: 'active',
      type: 'fixed',
    },
  });

  console.log('Created station:', station1.name);
  console.log('Seeding complete.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
