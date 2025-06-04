/*
  Warnings:

  - You are about to drop the `_DeckToNote` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subject` to the `Deck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Deck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic` to the `Deck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isDerived` to the `Flashcard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_DeckToNote" DROP CONSTRAINT "_DeckToNote_A_fkey";

-- DropForeignKey
ALTER TABLE "_DeckToNote" DROP CONSTRAINT "_DeckToNote_B_fkey";

-- AlterTable
ALTER TABLE "Deck" ADD COLUMN     "subject" "Subjects" NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "topic" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "correctAnswers" TEXT[],
ADD COLUMN     "easiness" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
ADD COLUMN     "interval" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isDerived" BOOLEAN NOT NULL,
ADD COLUMN     "lastScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nextReview" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "noteId" TEXT,
ADD COLUMN     "repetitions" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "topic" TEXT NOT NULL;

-- DropTable
DROP TABLE "_DeckToNote";

-- CreateTable
CREATE TABLE "FlashcardReview" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "previousInterval" INTEGER NOT NULL,
    "nextInterval" INTEGER NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "flashcardId" TEXT NOT NULL,

    CONSTRAINT "FlashcardReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashcardReview" ADD CONSTRAINT "FlashcardReview_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
