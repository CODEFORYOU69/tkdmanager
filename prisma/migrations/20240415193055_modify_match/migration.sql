/*
  Warnings:

  - You are about to drop the column `scoreRound1` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `scoreRound2` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `scoreRound3` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "scoreRound1",
DROP COLUMN "scoreRound2",
DROP COLUMN "scoreRound3";
