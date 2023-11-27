# INKSPIRE

Inkspire is a mobile application developed with React Native and Expo optimised for iOS.
The application is designed to connect users with local tattoo artists, providing a platform to explore their artwork and facilitate communication.

## Technologies

#### Backend

- Node.js
- Fastify
- postgreSQL
- Prisma
- REST API
- Cloudinary image upload

### Frontend

Link to repository: <a href='https://github.com/juditla/react-native-final-project'>react-native-final-project</a>

- React Native / Expo
- TypeScript
- Jest for Unit tests
- Maestro for E2E tests
- GiftedChat UI library
- React Native Paper
- Google Maps API

## Screenshots



<img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/Login-Screen.png" alt="login screen" width="300" height="auto" /> <img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/ArtistOverview-Screen.png" alt="artist overview screen" width="300" height="auto" /> <img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/ArtistDetail-Screen.png" alt="artist details screen" width="300" height="auto" /> <img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/StudioOverview-Screen.png" alt="studio overview screen" width="300" height="auto" /> <img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/StudioDetail-Screen.png" alt="studio details screen" width="300" height="auto" /> <img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/ConversationOverview-Screen.png" alt="conversation overview screen" width="300" height="auto" /> <img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/Chat-Screen.png" alt="chat screen" width="300" height="auto" /> <img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/Profile-Screen.png" alt="profile screen" width="300" height="auto" /> <img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/EditProfile-Screen.png" alt="edit profile screen" width="300" height="auto" />



## Setup guide

To run this project locally, the following steps are needed:

- Clone this repo on your local machine and connect to your GitHub account

- Download and install PostgreSQL (if not installed yet).

  - https://www.postgresql.org/download/
  - Create a User and a Database for the project.
  - Create a .env file resembling the .env.example
  - `DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`

- Create a cloudinary account and use the credentials to set up the image upload

  - https://cloudinary.com/
  - Set the environmental variables in the .env file
  - `CLOUDINARY_URL=cloudinary://CLOUDINARY_API_KEY:CLOUDINARY_API_KEY@CLOUDINARY_NAME`

- Install dependencies by running `pnpm install`

- To start the application

  - Start the postgres server by running `postgres` in your Terminaal
  - Run `pnpm prisma migrate dev`to migrate the databases
  - Finally run `pnpm start`

- To set up the frontend part of the project, go to <a href='https://github.com/juditla/react-native-final-project'>react-native-final-project</a> and follow the instructions there
