import { Prisma, PrismaClient, Studio } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    email: 'test1@example.com',
    firstName: 'hallo',
    lastName: 'welt',
    password: 'hallowelt',
    role: { create: { name: 'artist' } },
    studio: {
      create: [
        {
          name: 'Hyperhuman',
          address: 'Zehetnergasse 13',
          city: 'Vienna',
          postalCode: 1140,
        },
      ],
    },
  },
  {
    email: 'tatoo@example.com',
    firstName: 'mimi',
    lastName: 'mumu',
    password: 'huschiwuschi',
    role: { create: { name: 'customer' } },
  },
];

const artistData: Prisma.ArtistCreateInput[] = [
  {
    name: 'aloha',
    style: 'blackwork',
    description: 'askdihsdkfjhsdkfjhsdf',
    studio: { connect: { id: 1 } },
    user: { connect: { id: 1 } },
  },
];

const tattooImagesData: Prisma.TattooImagesCreateInput[] = [
  {
    name: 'tattoo1',
    style: 'blackwork',
    picture:
      'https://images-eu.ssl-images-amazon.com/images/I/516PMLwEYsL._AC_UL210_SR210,210_.jpg',
    isWannado: false,
    isReserved: false,
    isDone: true,
    artist: { connect: { id: 1 } },
  },
  {
    name: 'tattoo2',
    style: 'microrealism',
    picture:
      'https://cdn.pixabay.com/photo/2017/10/27/13/40/tattoo-2894318_960_720.jpg',
    isWannado: true,
    isReserved: false,
    isDone: false,
    artist: { connect: { id: 1 } },
  },
  {
    name: 'tattoo3',
    style: 'fineline',
    picture:
      'https://i.pinimg.com/1200x/f8/5f/13/f85f13a914a4f96009d7f422c1c43f24.jpg',
    isWannado: false,
    isReserved: true,
    isDone: false,
    artist: { connect: { id: 1 } },
  },
];

const studioImagesData: Prisma.StudioImagesCreateInput = {
  name: 'hyperhumanstudio',
  picture:
    'https://i.pinimg.com/1200x/f8/5f/13/f85f13a914a4f96009d7f422c1c43f24.jpg',
  studio: { connect: { id: 1 } },
};

export async function main() {
  console.log(`Start seeding ...`);
  for (const user of userData) {
    console.log(user);
    const currentUser = await prisma.user.create({
      data: user,
    });
    console.log(`Created user with id: ${currentUser.id}`);
  }
  for (const artist of artistData) {
    const currentArtist = await prisma.artist.create({
      data: artist,
    });
    console.log(`Created user with id: ${currentArtist.id}`);
  }
  for (const tattooImage of tattooImagesData) {
    const currentImage = await prisma.tattooImages.create({
      data: tattooImage,
    });
    console.log(`Created user with id: ${currentImage.id}`);
  }
  const studioImage = await prisma.studioImages.create({
    data: studioImagesData,
  });
  console.log(`Created user with id: ${studioImage.id}`);

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
