/*
  Warnings:

  - You are about to drop the column `lastScore` on the `DeckAlgorithmState` table. All the data in the column will be lost.
  - You are about to drop the column `targetSecondsPerItem` on the `DeckAlgorithmState` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."DeckAlgorithmState" DROP COLUMN "lastScore",
DROP COLUMN "targetSecondsPerItem";
