-- AlterTable
ALTER TABLE "auth"."User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
