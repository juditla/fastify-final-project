/*
  Warnings:

  - You are about to drop the column `studioId` on the `Studio_Images` table. All the data in the column will be lost.
  - Added the required column `studio_id` to the `Studio_Images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Studio_Images" DROP CONSTRAINT "Studio_Images_studioId_fkey";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expiry_timestamp" SET DEFAULT NOW() + interval '24 hours';

-- AlterTable
ALTER TABLE "Studio_Images" DROP COLUMN "studioId",
ADD COLUMN     "picture_public_id" VARCHAR(30),
ADD COLUMN     "studio_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tattoo_Images" ADD COLUMN     "picture_public_id" VARCHAR(30);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" VARCHAR(100),
ADD COLUMN     "avatar_public_id" VARCHAR(30);

-- AddForeignKey
ALTER TABLE "Studio_Images" ADD CONSTRAINT "Studio_Images_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
