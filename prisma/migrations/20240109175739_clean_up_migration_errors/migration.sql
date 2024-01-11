/*
  Warnings:

  - Made the column `user_id` on table `artistRating` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expiry_timestamp" SET DEFAULT NOW() + interval '24 hours';

-- AlterTable
ALTER TABLE "artistRating" ALTER COLUMN "user_id" SET NOT NULL;
