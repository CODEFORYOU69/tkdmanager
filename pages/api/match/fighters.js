// API route: /api/match/fighters/[competitionId]

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { competitionId } = req.query;

  try {
    const matches = await prisma.match.findMany({
      where: { competitionId: parseInt(competitionId) },
      include: {
        fighter: true // inclut les détails du combattant
      }
    });

    // Utiliser un objet pour filtrer les doublons
    const uniqueFighters = {};
    matches.forEach(match => {
      const fighter = match.fighter;
      if (!uniqueFighters[fighter.id]) {
        uniqueFighters[fighter.id] = fighter;
      }
    });

    res.status(200).json(Object.values(uniqueFighters));
  } catch (error) {
    res.status(500).send(error.message);
  }
}
