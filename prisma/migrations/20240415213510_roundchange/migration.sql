/*
  Warnings:

  - Added the required column `scoreBlue` to the `Round` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scoreRed` to the `Round` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Round" ADD COLUMN     "scoreBlue" INTEGER NOT NULL,
ADD COLUMN     "scoreRed" INTEGER NOT NULL;
