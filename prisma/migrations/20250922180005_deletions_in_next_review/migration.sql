/*
  Warnings:

  - You are about to drop the column `nextReview` on the `DeckAlgorithmState` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."DeckAlgorithmState_nextReview_idx";

-- AlterTable
ALTER TABLE "public"."DeckAlgorithmState" DROP COLUMN "nextReview";

-- CreateIndex
CREATE INDEX "DeckAlgorithmState_deckId_idx" ON "public"."DeckAlgorithmState"("deckId");
