import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { scoreBlue, scoreRed, victoryType, isWinner, matchId } = req.body;
        try {
            const round = await prisma.round.create({
                data: {
                    matchId,
                    scoreBlue: parseInt(scoreBlue, 10),
                    scoreRed: parseInt(scoreRed, 10),
                    victoryType,
                    isWinner: isWinner === 'yes' ? true : false
                }
            });

            await updateMatchResult(matchId);
            res.status(201).json(round);
        } catch (error) {
            console.error('Failed to create a round:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function updateMatchResult(matchId) {
    const rounds = await prisma.round.findMany({
        where: { matchId }
    });
    const wins = rounds.filter(round => round.isWinner).length;
    let result = '';

    // Déterminer le résultat basé sur le nombre de victoires
    if (wins >= 2) {
        result = 'WINNER';
    } else if ((rounds.length === 2 && wins === 0) || (rounds.length === 3 && wins === 1)) {
        result = 'LOSER';
    } else {
        // Pas assez de données pour déterminer le résultat
        return;
    }

    // Mise à jour du match avec le résultat
    await prisma.match.update({
        where: { id: matchId },
        data: { result }
    });

    if (result === 'LOSER') {
        // Récupérer les détails du match pour trouver les futurs matchs du même combattant
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            include: { fighter: true }
        });

        // Annuler tous les futurs matchs si le combattant perd
        await prisma.match.updateMany({
            where: {
                competitionId: match.competitionId,
                fighterId: match.fighterId,
                id: { not: matchId },  // Exclure le match actuel
                // Exclure les matchs où le résultat est déjà 'WINNER' ou non défini
                OR: [
                    { result: null },
                    { result: { not: 'WINNER' } }
                ]
            },
            data: { isCancelled: true }
        });
    }
}

