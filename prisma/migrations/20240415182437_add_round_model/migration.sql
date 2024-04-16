/*
  Warnings:

  - You are about to drop the column `round` on the `Match` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RoundVictoryType" AS ENUM ('PTG', 'GJ', 'SC', 'KO', 'IN', 'NC', 'OT');

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "round";

-- CreateTable
CREATE TABLE "Round" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "fighterId" INTEGER NOT NULL,
    "victoryType" "RoundVictoryType",
    "isWinner" BOOLEAN NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "Fighter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
