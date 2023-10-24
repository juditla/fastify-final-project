/*
  Warnings:

  - You are about to drop the column `studioId` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Studio` table. All the data in the column will be lost.
  - You are about to drop the column `artistId` on the `Tattoo_Images` table. All the data in the column will be lost.
  - You are about to drop the column `is_done` on the `Tattoo_Images` table. All the data in the column will be lost.
  - You are about to drop the column `is_reserved` on the `Tattoo_Images` table. All the data in the column will be lost.
  - You are about to drop the column `is_wannado` on the `Tattoo_Images` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studio_id` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `Studio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `artist_id` to the `Tattoo_Images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_Done` to the `Tattoo_Images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_Reserved` to the `Tattoo_Images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_Wannado` to the `Tattoo_Images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_studioId_fkey";

-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_userId_fkey";

-- DropForeignKey
ALTER TABLE "Studio" DROP CONSTRAINT "Studio_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Tattoo_Images" DROP CONSTRAINT "Tattoo_Images_artistId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropIndex
DROP INDEX "Artist_userId_key";

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "studioId",
DROP COLUMN "userId",
ADD COLUMN     "studio_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Studio" DROP COLUMN "ownerId",
ADD COLUMN     "owner_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tattoo_Images" DROP COLUMN "artistId",
DROP COLUMN "is_done",
DROP COLUMN "is_reserved",
DROP COLUMN "is_wannado",
ADD COLUMN     "artist_id" INTEGER NOT NULL,
ADD COLUMN     "is_Done" BOOLEAN NOT NULL,
ADD COLUMN     "is_Reserved" BOOLEAN NOT NULL,
ADD COLUMN     "is_Wannado" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roleId",
ADD COLUMN     "role_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Artist_user_id_key" ON "Artist"("user_id");

-- AddForeignKey
ALTER TABLE "Studio" ADD CONSTRAINT "Studio_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "Studio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tattoo_Images" ADD CONSTRAINT "Tattoo_Images_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
