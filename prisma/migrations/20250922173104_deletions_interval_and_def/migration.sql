/*
  Warnings:

  - You are about to drop the column `interval` on the `DeckAlgorithmState` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."DeckAlgorithmState" DROP COLUMN "interval",
ALTER COLUMN "repetitions" SET DEFAULT 1;
