/*
  Warnings:

  - A unique constraint covering the columns `[owner_id,participant_id]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expiry_timestamp" SET DEFAULT NOW() + interval '24 hours';

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_owner_id_participant_id_key" ON "Conversation"("owner_id", "participant_id");
