/*
  Warnings:

  - You are about to drop the column `description` on the `Deck` table. All the data in the column will be lost.
  - You are about to drop the column `easiness` on the `Deck` table. All the data in the column will be lost.
  - You are about to drop the column `interval` on the `Deck` table. All the data in the column will be lost.
  - You are about to drop the column `lastScore` on the `Deck` table. All the data in the column will be lost.
  - You are about to drop the column `nextReview` on the `Deck` table. All the data in the column will be lost.
  - You are about to drop the column `repetitions` on the `Deck` table. All the data in the column will be lost.
  - You are about to drop the column `targetSecondsPerItem` on the `Deck` table. All the data in the column will be lost.
  - You are about to drop the column `totalScore` on the `StudySession` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `StudySession` table. All the data in the column will be lost.
  - You are about to drop the `DeckFlashcard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudySessionDeck` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudySessionFlashcard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."DeckFlashcard" DROP CONSTRAINT "DeckFlashcard_deckId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DeckFlashcard" DROP CONSTRAINT "DeckFlashcard_flashcardId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudySession" DROP CONSTRAINT "StudySession_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudySessionDeck" DROP CONSTRAINT "StudySessionDeck_deckId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudySessionDeck" DROP CONSTRAINT "StudySessionDeck_studySessionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudySessionFlashcard" DROP CONSTRAINT "StudySessionFlashcard_deckId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudySessionFlashcard" DROP CONSTRAINT "StudySessionFlashcard_flashcardId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudySessionFlashcard" DROP CONSTRAINT "StudySessionFlashcard_studySessionId_fkey";

-- DropIndex
DROP INDEX "public"."StudySession_userId_idx";

-- AlterTable
ALTER TABLE "public"."Deck" DROP COLUMN "description",
DROP COLUMN "easiness",
DROP COLUMN "interval",
DROP COLUMN "lastScore",
DROP COLUMN "nextReview",
DROP COLUMN "repetitions",
DROP COLUMN "targetSecondsPerItem";

-- AlterTable
ALTER TABLE "public"."StudySession" DROP COLUMN "totalScore",
DROP COLUMN "userId",
ADD COLUMN     "accuracy" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "deckId" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "public"."DeckFlashcard";

-- DropTable
DROP TABLE "public"."StudySessionDeck";

-- DropTable
DROP TABLE "public"."StudySessionFlashcard";

-- CreateTable
CREATE TABLE "public"."_DeckToFlashcard" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DeckToFlashcard_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_FlashcardToStudySession" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FlashcardToStudySession_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DeckToFlashcard_B_index" ON "public"."_DeckToFlashcard"("B");

-- CreateIndex
CREATE INDEX "_FlashcardToStudySession_B_index" ON "public"."_FlashcardToStudySession"("B");

-- AddForeignKey
ALTER TABLE "public"."StudySession" ADD CONSTRAINT "StudySession_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "public"."Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DeckToFlashcard" ADD CONSTRAINT "_DeckToFlashcard_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DeckToFlashcard" ADD CONSTRAINT "_DeckToFlashcard_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_FlashcardToStudySession" ADD CONSTRAINT "_FlashcardToStudySession_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_FlashcardToStudySession" ADD CONSTRAINT "_FlashcardToStudySession_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."StudySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
