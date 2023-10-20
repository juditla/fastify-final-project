import { Prisma, PrismaClient, Studio } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    email: 'test1@example.com',
    user_name: 'test',
    first_name: 'hallo',
    last_name: 'welt',
    password: 'hallowelt',
    role: { create: { name: 'customer' } },
    Studio: {
      create: [
        {
          name: 'Hyperhuman',
          address: 'Zehetnergasse 13',
          city: 'Vienna',
          postal_code: 1140,
        },
      ],
    },
    // Artist: {
    //   create: {
    //     style: 'flow',
    //     name: 'schmoozyTattoozy',
    //     description: 'i do them schmooziest tattoosies',
    //     studioId: 1,
    //   },
    // },
  },
];

export async function main() {
  console.log(`Start seeding ...`);
  for (const user of userData) {
    console.log(user);
    const currentUser = await prisma.user.create({
      data: user,
    });
    console.log(`Created user with id: ${currentUser.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
