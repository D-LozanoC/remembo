/*
  Warnings:

  - You are about to drop the column `scheduledAt` on the `StudySession` table. All the data in the column will be lost.
  - Made the column `nextReview` on table `StudySession` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."StudySession" DROP COLUMN "scheduledAt",
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "nextReview" SET NOT NULL,
ALTER COLUMN "nextReview" SET DEFAULT CURRENT_TIMESTAMP;
