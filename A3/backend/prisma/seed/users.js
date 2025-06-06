const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function seedUsers() {
  const users = [
    {
      utorid: 'regular1',
      password: '123',
      email: 'testuser@mail.utoronto.ca',
      role: 'organizer',
      name: 'Test User',
      verified: true
    },
    {
      utorid: 'cashier1',
      password: '123',
      email: 'cashier@mail.utoronto.ca',
      role: 'cashier',
      name: 'Test Cashier',
      verified: true
    },
    {
      utorid: 'manager1',
      password: '20954',
      email: 'manager@mail.utoronto.ca',
      role: 'manager',
      name: 'Test Manager',
      verified: true
    },
    {
      utorid: 'superuser',
      password: 'Super123!',
      email: 'super@mail.utoronto.ca',
      role: 'superuser',
      name: 'Super User',
      verified: true
    },
    {
      utorid: 'unverified1',
      password: 'Test123!',
      email: 'unverified1@mail.utoronto.ca',
      role: 'regular',
      name: 'Unverified User',
      verified: false
    },
    {
      utorid: 'minimal1',
      password: 'Test123!',
      email: 'minimal1@mail.utoronto.ca',
      role: 'regular',
      name: '',
      verified: true
    },
    {
      utorid: 'redemptionzero',
      password: 'Test123!',
      email: 'redemptionzero@mail.utoronto.ca',
      role: 'regular',
      name: 'No Points',
      verified: true
    },
    {
      utorid: 'eventguest1',
      password: 'Test123!',
      email: 'guest1@mail.utoronto.ca',
      role: 'regular',
      name: 'Event Guest',
      verified: true
    },
    {
      utorid: 'cashier2',
      password: 'Test123!',
      email: 'cashier2@mail.utoronto.ca',
      role: 'cashier',
      name: 'Cashier Two',
      verified: true
    },
    {
      utorid: 'manager2',
      password: 'Test123!',
      email: 'manager2@mail.utoronto.ca',
      role: 'manager',
      name: 'Manager Two',
      verified: true
    },
    {
      utorid: 'forgotpw',
      password: 'Test123!', // reset to 'Reset123!'
      email: 'forgotpw@mail.utoronto.ca',
      role: 'regular',
      name: 'Forgot Password',
      verified: true
    }
  ];

//   const created = await Promise.all(users.map(u => prisma.user.create({ data: u })));

  const created = await Promise.all(
    users.map(u =>
      prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: u
      })
    )
  );
  

  return {
    regularUser: created[0],
    cashierUser: created[1],
    managerUser: created[2],
    superUser: created[3],
    unverifiedUser: created[4],
    minimalUser: created[5],
    zeroPointsUser: created[6],
    eventGuestUser: created[7],
    cashierUser2: created[8],
    managerUser2: created[9]
  };
};
