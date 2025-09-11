/*
  Warnings:

  - You are about to drop the column `position` on the `StudySessionFlashcard` table. All the data in the column will be lost.
  - You are about to drop the `StudySessionDeck` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."StudySessionDeck" DROP CONSTRAINT "StudySessionDeck_deckId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudySessionDeck" DROP CONSTRAINT "StudySessionDeck_studySessionId_fkey";

-- AlterTable
ALTER TABLE "public"."Deck" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Flashcard" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Note" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."StudySessionFlashcard" DROP COLUMN "position";

-- DropTable
DROP TABLE "public"."StudySessionDeck";
