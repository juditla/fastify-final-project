-- CreateTable
CREATE TABLE "Studio" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "address" VARCHAR(50) NOT NULL,
    "city" VARCHAR(30) NOT NULL DEFAULT 'Vienna',
    "postal_code" INTEGER NOT NULL,
    "longitude" VARCHAR(30),
    "latitude" VARCHAR(30),
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Studio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "style" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "studioId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tattoo_Images" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "picture" VARCHAR(100) NOT NULL,
    "artistId" INTEGER NOT NULL,
    "style" TEXT NOT NULL,
    "is_wannado" BOOLEAN NOT NULL,
    "is_reserved" BOOLEAN NOT NULL,
    "is_done" BOOLEAN NOT NULL,

    CONSTRAINT "Tattoo_Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Studio_Images" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "picture" VARCHAR(100) NOT NULL,
    "studioId" INTEGER NOT NULL,

    CONSTRAINT "Studio_Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "user_name" VARCHAR(30) NOT NULL,
    "roleId" INTEGER NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "first_name" VARCHAR(30) NOT NULL,
    "last_name" VARCHAR(30) NOT NULL,
    "password" VARCHAR(30) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_userId_key" ON "Artist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Studio" ADD CONSTRAINT "Studio_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tattoo_Images" ADD CONSTRAINT "Tattoo_Images_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Studio_Images" ADD CONSTRAINT "Studio_Images_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
