-- DropForeignKey
ALTER TABLE "Studio_Images" DROP CONSTRAINT "Studio_Images_studio_id_fkey";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expiry_timestamp" SET DEFAULT NOW() + interval '24 hours';

-- CreateTable
CREATE TABLE "artistRating" (
    "id" SERIAL NOT NULL,
    "artist_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "artistRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Studio_Images" ADD CONSTRAINT "Studio_Images_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "Studio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artistRating" ADD CONSTRAINT "artistRating_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artistRating" ADD CONSTRAINT "artistRating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
