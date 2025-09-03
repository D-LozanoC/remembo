/*
  Warnings:

  - You are about to drop the `_DeckToFlashcard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FlashcardToStudySession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_DeckToFlashcard" DROP CONSTRAINT "_DeckToFlashcard_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DeckToFlashcard" DROP CONSTRAINT "_DeckToFlashcard_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_FlashcardToStudySession" DROP CONSTRAINT "_FlashcardToStudySession_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_FlashcardToStudySession" DROP CONSTRAINT "_FlashcardToStudySession_B_fkey";

-- DropTable
DROP TABLE "public"."_DeckToFlashcard";

-- DropTable
DROP TABLE "public"."_FlashcardToStudySession";
