/*
  Warnings:

  - You are about to drop the column `priority` on the `DeckFlashcard` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."DeckFlashcard_flashcardId_priority_idx";

-- AlterTable
ALTER TABLE "public"."DeckFlashcard" DROP COLUMN "priority";

-- CreateIndex
CREATE INDEX "DeckFlashcard_flashcardId_idx" ON "public"."DeckFlashcard"("flashcardId");
