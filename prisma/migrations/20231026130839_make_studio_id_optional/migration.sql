-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_studio_id_fkey";

-- AlterTable
ALTER TABLE "Artist" ALTER COLUMN "studio_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expiry_timestamp" SET DEFAULT NOW() + interval '24 hours';

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "Studio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
