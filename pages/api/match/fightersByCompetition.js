import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { competitionId } = req.query;

  try {
    // Récupérer tous les matchs de la compétition avec détails des combattants et des rounds
    const matches = await prisma.match.findMany({
      where: { competitionId: parseInt(competitionId) },
      include: {
        fighter: true,  // inclut les détails du combattant
        rounds: true    // inclut les détails des rounds pour chaque match
      }
    });

    // Utiliser un objet Map pour éviter les doublons et conserver les détails des matchs pour chaque combattant
    const fightersMap = new Map();

    matches.forEach(match => {
      const fighter = match.fighter;
      if (!fightersMap.has(fighter.id)) {
        // Initialiser avec les détails du combattant et une liste vide pour les matchs
        fightersMap.set(fighter.id, { ...fighter, matches: [] });
      }
      // Ajouter le match à la liste des matchs de ce combattant
      fightersMap.get(fighter.id).matches.push({
        fightNumber: match.fightNumber,
        color: match.color,
        result: match.result,
        isCancelled: match.isCancelled,
        rounds: match.rounds.map(round => ({
          isWinner: round.isWinner,
          victoryType: round.victoryType,
          scoreBlue: round.scoreBlue,
          scoreRed: round.scoreRed
        }))
      });
    });

    // Convertir la Map en array pour la réponse
    const uniqueFighters = Array.from(fightersMap.values());

    res.status(200).json(uniqueFighters);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
