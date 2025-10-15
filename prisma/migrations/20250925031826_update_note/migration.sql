-- DropForeignKey
ALTER TABLE "public"."Flashcard" DROP CONSTRAINT "Flashcard_noteId_fkey";

-- AlterTable
ALTER TABLE "public"."Note" ADD COLUMN     "divisions" JSONB[];

-- AddForeignKey
ALTER TABLE "public"."Flashcard" ADD CONSTRAINT "Flashcard_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "public"."Note"("id") ON DELETE SET NULL ON UPDATE CASCADE;
