import { Artist, Studio, studioImage, tattooImage } from './types.js';

export const studios: Studio[] = [
  {
    id: 1,
    name: 'True Canvas',
    address: 'Weyringergasse 19',
    city: 'Vienna',
    postalCode: 1040,
    ownerId: 2,
  },
  {
    id: 2,
    name: 'Hyperhuman',
    address: 'Zehetnergasse 13',
    city: 'Vienna',
    postalCode: 1140,
    ownerId: 4,
  },
  {
    id: 3,
    name: 'Maschinenraum',
    address: 'Schweglerstraße 51',
    city: 'Vienna',
    postalCode: 1140,
    ownerId: 1,
  },
  {
    id: 4,
    name: 'zur Stecherei',
    address: 'Schottenfeldgasse 86',
    city: 'Vienna',
    postalCode: 1070,
    ownerId: 3,
  },
];

export const artists: Artist[] = [
  {
    id: 1,
    style: 'flow',
    studioId: 3,
    name: 'schmoozyTattoozy',
    description: 'i do them schmooziest tattoosies',
  },
  {
    id: 2,
    style: 'anime',
    studioId: 2,
    name: 'inksi',
    description: 'i do them inksies with the pinksies',
  },
  {
    id: 3,
    style: 'microrealism',
    studioId: 1,
    name: 'thetatooer',
    description: 'i do tattoop',
  },
  {
    id: 4,
    style: 'animals',
    studioId: 4,
    name: 'huho',
    description: 'i do them tatthuho',
  },
];

export const tattooImages: tattooImage[] = [
  {
    id: 1,
    name: 'picture1',
    picture: 'examplepicture.com/picture1',
    artistId: 2,
    isWannado: true,
    isReserved: false,
    isDone: false,
    style: 'animal',
  },
  {
    id: 2,
    name: 'picture2',
    picture: 'examplepicture.com/picture2',
    artistId: 2,
    isWannado: true,
    isReserved: true,
    isDone: false,
    style: 'ornament',
  },
  {
    id: 3,
    name: 'picture3',
    picture: 'examplepicture.com/picture3',
    artistId: 1,
    isWannado: false,
    isReserved: false,
    isDone: true,
    style: 'animal',
  },
  {
    id: 4,
    name: 'picture4',
    picture: 'examplepicture.com/picture4',
    artistId: 3,
    isWannado: true,
    isReserved: true,
    isDone: true,
    style: 'animal',
  },
];

export const studioImages: studioImage[] = [
  {
    id: 1,
    name: 'studiopicture1',
    picture: 'examplepicture.com/studio1',
    studioId: 2,
  },
  {
    id: 2,
    name: 'studiopicture2',
    picture: 'examplepicture.com/studio2',
    studioId: 1,
  },
  {
    id: 3,
    name: 'studiopicture3',
    picture: 'examplepicture.com/studio3',
    studioId: 3,
  },
  {
    id: 4,
    name: 'studiopicture4',
    picture: 'examplepicture.com/studio4',
    studioId: 4,
  },
];
