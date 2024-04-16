import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {

    if (req.method === 'POST') {
        // Handling POST request to create a new round
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

            // After adding the round, check the outcome of the match
            await updateMatchResult(matchId);

            res.status(201).json(round);
        } catch (error) {
            console.error('Failed to create a round:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    } else if (req.method === 'PUT') {
        // Handling PUT request to update an existing round
        const { roundId, scoreBlue, scoreRed, victoryType, isWinner, matchId } = req.body;
        try {
            const round = await prisma.round.update({
                where: { id: parseInt(roundId) },
                data: {
                    scoreBlue: parseInt(scoreBlue, 10),
                    scoreRed: parseInt(scoreRed, 10),
                    victoryType,
                    isWinner,
                    matchId
                }
            });

            // After updating the round, check the outcome of the match
            await updateMatchResult(matchId);

            res.status(200).json(round);
        } catch (error) {
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Round not found' });
            } else {
                console.error('Failed to update the round:', error);
                res.status(500).json({ message: 'Internal Server Error', error: error.message });
            }
        }
    } else {
        res.setHeader('Allow', ['POST', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function updateMatchResult(matchId) {
    const rounds = await prisma.round.findMany({
        where: { matchId }
    });

    const wins = rounds.filter(round => round.isWinner).length;

    let result;
    if (wins >= 2) {
        result = 'WINNER';
    } else if (rounds.length === 3 && wins === 1) {
        result = 'LOSER';
    } else {
        return; // Not enough data to determine the result yet
    }

    await prisma.match.update({
        where: { id: matchId },
        data: { result }
    });
}
