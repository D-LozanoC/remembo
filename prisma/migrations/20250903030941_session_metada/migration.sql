-- CreateEnum
CREATE TYPE "public"."StudySessionStatus" AS ENUM ('En_Curso', 'Finalizada', 'Programada');

-- DropIndex
DROP INDEX "public"."DeckFlashcard_flashcardId_idx";

-- AlterTable
ALTER TABLE "public"."StudySession" ADD COLUMN     "nextReview" TIMESTAMP(3),
ADD COLUMN     "scheduledAt" TIMESTAMP(3),
ADD COLUMN     "status" "public"."StudySessionStatus" NOT NULL DEFAULT 'En_Curso';

-- CreateIndex
CREATE INDEX "DeckAlgorithmState_nextReview_idx" ON "public"."DeckAlgorithmState"("nextReview");

-- CreateIndex
CREATE INDEX "DeckFlashcard_flashcardId_priority_idx" ON "public"."DeckFlashcard"("flashcardId", "priority");

-- CreateIndex
CREATE INDEX "DeckFlashcard_deckId_lastSeenAt_idx" ON "public"."DeckFlashcard"("deckId", "lastSeenAt");
