/*
  Warnings:

  - You are about to drop the column `user_name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,address,postal_code]` on the table `Studio` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Studio_Images" ADD COLUMN     "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Tattoo_Images" ADD COLUMN     "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "user_name";

-- CreateIndex
CREATE UNIQUE INDEX "Studio_name_address_postal_code_key" ON "Studio"("name", "address", "postal_code");
