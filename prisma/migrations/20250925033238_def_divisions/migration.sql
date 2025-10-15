-- AlterTable
ALTER TABLE "public"."Note" ALTER COLUMN "divisions" SET DEFAULT ARRAY[]::JSONB[];
