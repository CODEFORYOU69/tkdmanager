/*
  Warnings:

  - You are about to drop the column `competitionEntryId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `fighterId` on the `Round` table. All the data in the column will be lost.
  - You are about to drop the `CompetitionEntry` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `competitionId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fighterId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CompetitionEntry" DROP CONSTRAINT "CompetitionEntry_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "CompetitionEntry" DROP CONSTRAINT "CompetitionEntry_fighterId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_competitionEntryId_fkey";

-- DropForeignKey
ALTER TABLE "Round" DROP CONSTRAINT "Round_fighterId_fkey";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "competitionEntryId",
ADD COLUMN     "competitionId" INTEGER NOT NULL,
ADD COLUMN     "fighterId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Round" DROP COLUMN "fighterId";

-- DropTable
DROP TABLE "CompetitionEntry";

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "Fighter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
