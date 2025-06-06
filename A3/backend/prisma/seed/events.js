const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function seedEvents(users) {
  const now = new Date();

  const event1 = await prisma.event.create({
    data: {
      name: 'CS Career Fair',
      description: 'Annual career fair with top tech companies',
      location: 'Bahen Centre',
      startTime: new Date(now.getTime() + 86400000),
      endTime: new Date(now.getTime() + 3 * 86400000),
      capacity: 100,
      pointsRemain: 1000,
      pointsAwarded: 0,
      published: true
    }
  });

  const event2 = await prisma.event.create({
    data: {
      name: 'Coding Competition',
      description: 'Compete with fellow students on coding challenges',
      location: 'Myhal Centre',
      startTime: new Date(now.getTime() + 7 * 86400000),
      endTime: new Date(now.getTime() + 8 * 86400000),
      capacity: 50,
      pointsRemain: 500,
      pointsAwarded: 0,
      published: true
    }
  });

  const event3 = await prisma.event.create({
    data: {
      name: 'Student-Led Workshop',
      description: 'A workshop organized by regular users',
      location: 'Online',
      startTime: new Date(now.getTime() + 10 * 86400000),
      endTime: new Date(now.getTime() + 11 * 86400000),
      capacity: 30,
      pointsRemain: 300,
      pointsAwarded: 0,
      published: true
    }
  });

  // Add organizers
  await Promise.all([
    prisma.eventOrganizer.create({ data: { eventId: event1.id, userId: users.managerUser.id } }),
    prisma.eventOrganizer.create({ data: { eventId: event2.id, userId: users.managerUser.id } }),
    prisma.eventOrganizer.create({ data: { eventId: event3.id, userId: users.regularUser.id } })
  ]);

  // Add guests
  await prisma.eventGuest.create({ data: { eventId: event1.id, userId: users.regularUser.id } });
  await prisma.eventGuest.create({ data: { eventId: event2.id, userId: users.eventGuestUser.id } });

  // update number of guests
  await Promise.all([
    prisma.event.update({
      where: { id: event1.id },
      data: { numGuests: { increment: 1 } }
    }),
    prisma.event.update({
      where: { id: event2.id },
      data: { numGuests: { increment: 1 } }
    })
  ]);

  return [event1, event2, event3];
};
