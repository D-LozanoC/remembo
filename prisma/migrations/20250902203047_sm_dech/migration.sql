/*
  Warnings:

  - You are about to drop the column `easiness` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `interval` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `lastScore` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `nextReview` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `repetitions` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the `FlashcardReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DeckToFlashcard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."FlashcardReview" DROP CONSTRAINT "FlashcardReview_flashcardId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DeckToFlashcard" DROP CONSTRAINT "_DeckToFlashcard_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DeckToFlashcard" DROP CONSTRAINT "_DeckToFlashcard_B_fkey";

-- AlterTable
ALTER TABLE "public"."Deck" ADD COLUMN     "description" TEXT,
ADD COLUMN     "easiness" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
ADD COLUMN     "interval" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nextReview" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "repetitions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "targetSecondsPerItem" INTEGER NOT NULL DEFAULT 20;

-- AlterTable
ALTER TABLE "public"."Flashcard" DROP COLUMN "easiness",
DROP COLUMN "interval",
DROP COLUMN "lastScore",
DROP COLUMN "nextReview",
DROP COLUMN "repetitions";

-- DropTable
DROP TABLE "public"."FlashcardReview";

-- DropTable
DROP TABLE "public"."_DeckToFlashcard";

-- CreateTable
CREATE TABLE "public"."DeckFlashcard" (
    "deckId" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3),

    CONSTRAINT "DeckFlashcard_pkey" PRIMARY KEY ("deckId","flashcardId")
);

-- CreateTable
CREATE TABLE "public"."StudySession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudySessionDeck" (
    "studySessionId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "accuracy" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "nextReview" TIMESTAMP(3),

    CONSTRAINT "StudySessionDeck_pkey" PRIMARY KEY ("studySessionId","deckId")
);

-- CreateTable
CREATE TABLE "public"."StudySessionFlashcard" (
    "studySessionId" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "deckId" TEXT,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER,

    CONSTRAINT "StudySessionFlashcard_pkey" PRIMARY KEY ("studySessionId","flashcardId")
);

-- CreateIndex
CREATE INDEX "DeckFlashcard_flashcardId_idx" ON "public"."DeckFlashcard"("flashcardId");

-- CreateIndex
CREATE INDEX "StudySession_userId_idx" ON "public"."StudySession"("userId");

-- CreateIndex
CREATE INDEX "StudySessionDeck_deckId_idx" ON "public"."StudySessionDeck"("deckId");

-- CreateIndex
CREATE INDEX "StudySessionFlashcard_flashcardId_idx" ON "public"."StudySessionFlashcard"("flashcardId");

-- AddForeignKey
ALTER TABLE "public"."DeckFlashcard" ADD CONSTRAINT "DeckFlashcard_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "public"."Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeckFlashcard" ADD CONSTRAINT "DeckFlashcard_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "public"."Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudySession" ADD CONSTRAINT "StudySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudySessionDeck" ADD CONSTRAINT "StudySessionDeck_studySessionId_fkey" FOREIGN KEY ("studySessionId") REFERENCES "public"."StudySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudySessionDeck" ADD CONSTRAINT "StudySessionDeck_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "public"."Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudySessionFlashcard" ADD CONSTRAINT "StudySessionFlashcard_studySessionId_fkey" FOREIGN KEY ("studySessionId") REFERENCES "public"."StudySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudySessionFlashcard" ADD CONSTRAINT "StudySessionFlashcard_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "public"."Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudySessionFlashcard" ADD CONSTRAINT "StudySessionFlashcard_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "public"."Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
