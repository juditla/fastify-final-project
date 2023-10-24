/*
  Warnings:

  - You are about to drop the column `is_Done` on the `Tattoo_Images` table. All the data in the column will be lost.
  - You are about to drop the column `is_Reserved` on the `Tattoo_Images` table. All the data in the column will be lost.
  - You are about to drop the column `is_Wannado` on the `Tattoo_Images` table. All the data in the column will be lost.
  - Added the required column `is_done` to the `Tattoo_Images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_reserved` to the `Tattoo_Images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_wannado` to the `Tattoo_Images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tattoo_Images" DROP COLUMN "is_Done",
DROP COLUMN "is_Reserved",
DROP COLUMN "is_Wannado",
ADD COLUMN     "is_done" BOOLEAN NOT NULL,
ADD COLUMN     "is_reserved" BOOLEAN NOT NULL,
ADD COLUMN     "is_wannado" BOOLEAN NOT NULL;
