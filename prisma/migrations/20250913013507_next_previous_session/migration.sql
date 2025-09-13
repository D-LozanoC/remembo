/*
  Warnings:

  - You are about to drop the column `nextReview` on the `StudySession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."StudySession" DROP COLUMN "nextReview",
ADD COLUMN     "dateReview" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nextSessionId" TEXT,
ADD COLUMN     "previousSessionId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."StudySession" ADD CONSTRAINT "StudySession_nextSessionId_fkey" FOREIGN KEY ("nextSessionId") REFERENCES "public"."StudySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudySession" ADD CONSTRAINT "StudySession_previousSessionId_fkey" FOREIGN KEY ("previousSessionId") REFERENCES "public"."StudySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
