-- DropForeignKey
ALTER TABLE "Flashcard" DROP CONSTRAINT "Flashcard_noteId_fkey";

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
