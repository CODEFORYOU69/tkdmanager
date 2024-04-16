import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const fighterId = parseInt(req.query.id); // Convertir l'ID en nombre pour éviter des erreurs

    switch (req.method) {
        case 'GET':
            // Traiter une requête GET pour un combattant spécifique
            try {
                const fighter = await prisma.fighter.findUnique({
                    where: { id: fighterId },
                });
                if (fighter) {
                    res.status(200).json(fighter);
                } else {
                    res.status(404).json({ message: 'Fighter not found' });
                }
            } catch (error) {
                res.status(500).json({ message: 'Server error', error });
            }
            break;

        case 'PUT':
            // Code pour mettre à jour un combattant
            try {
                const { firstName, lastName, category } = req.body;
                const updatedFighter = await prisma.fighter.update({
                    where: { id: fighterId },
                    data: { firstName, lastName, category },
                });
                res.status(200).json(updatedFighter);
            } catch (error) {
                if (error instanceof prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                    res.status(404).json({ message: 'Fighter not found' });
                } else {
                    res.status(500).json({ message: 'Failed to update fighter', error: error.message });
                }
            }
            break;

        case 'DELETE':
            // Code pour supprimer un combattant
            try {
                await prisma.fighter.delete({
                    where: { id: fighterId },
                });
                res.status(204).end(); // No Content, indique que l'action a réussi mais qu'aucun contenu n'est renvoyé
            } catch (error) {
                if (error instanceof prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                    res.status(404).json({ message: 'Fighter not found' });
                } else {
                    res.status(500).json({ message: 'Failed to delete fighter', error: error.message });
                }
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
