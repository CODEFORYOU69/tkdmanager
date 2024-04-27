import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const matchId = parseInt(req.query.id); // Convertir l'ID en nombre pour éviter des erreurs

    switch (req.method) {
        case 'GET':
            // Traiter une requête GET pour un combattant spécifique
            try {
                const match = await prisma.match.findUnique({
                    where: { id: matchId  },
                });
                if (match) {
                    res.status(200).json(match);
                } else {
                    res.status(404).json({ message: 'match not found' });
                }
            } catch (error) {
                res.status(500).json({ message: 'Server error', error });
            }
            break;

        case 'PUT':
            // Code pour mettre à jour un combattant
            console.log(req.body)
            console.log("matchId", matchId)
            console.log(typeof matchId, matchId);  // This should output 'number' and the value

            try {
                const { fightNumber,
                color,
                fighterId,
                competitionId
                 } = req.body;
                const fightNumberId = parseInt(fightNumber);
                  console.log(req.body)
            console.log("matchId", matchId)

                const updatedMatch = await prisma.match.update({
                    where: { id: matchId },
                    data: { fightNumber: fightNumberId,
                color,
                fighterId,
                isCancelled: false,
                competitionId
                 },
                });
                res.status(200).json(updatedMatch);
            } catch (error) {
                if (error ) {
                        console.error(error);  // This will give more details on the error

                    res.status(404).json({ message: 'match not found' });
                } else {
                    res.status(500).json({ message: 'Failed to update fighter', error: error.message });
                }
            }
            break;

        case 'DELETE':
            // Code pour supprimer un combattant
            try {
                await prisma.match.delete({
                    where: { id: matchId },
                });
                res.status(204).end(); // No Content, indique que l'action a réussi mais qu'aucun contenu n'est renvoyé
            } catch (error) {
                if (error instanceof prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                    res.status(404).json({ message: 'Match not found' });
                } else {
                    res.status(500).json({ message: 'Failed to delete match', error: error.message });
                }
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
