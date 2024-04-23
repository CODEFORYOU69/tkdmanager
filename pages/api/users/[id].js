import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const coachId = parseInt(req.query.id); // Convertir l'ID en nombre pour éviter des erreurs

    switch (req.method) {
        case 'GET':
            // Traiter une requête GET pour un combattant spécifique
            try {
                const coach = await prisma.user.findUnique({
                    where: { id: coachId },
                });
                if (coach) {
                    res.status(200).json(coach);
                } else {
                    res.status(404).json({ message: 'Coach not found' });
                }
            } catch (error) {
                res.status(500).json({ message: 'Server error', error });
            }
            break;

        case 'PUT':
            // Code pour mettre à jour un combattant
            try {
                const { name, password, imageUrl } = req.body;
                console.log("req.body",req.body)
                const hashedPassword = await bcrypt.hash(password, 10);

                const updatedUser = await prisma.user.update({
                    where: { id: coachId },
                    data: { name, 
                        password: hashedPassword ,
                         image: imageUrl},
                });
                res.status(200).json(updatedUser);
            } catch (error) {
                if (error) {
                    res.status(404).json({ message: 'Coach not found' });
                } else {
                    res.status(500).json({ message: 'Failed to update coach', error: error.message });
                }
            }
            break;

        case 'DELETE':
            // Code pour supprimer un combattant
            try {
                await prisma.user.delete({
                    where: { id: coachId },
                });
                res.status(204).end(); // No Content, indique que l'action a réussi mais qu'aucun contenu n'est renvoyé
            } catch (error) {
                if (error instanceof prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                    res.status(404).json({ message: 'Coach not found' });
                } else {
                    res.status(500).json({ message: 'Failed to delete coach', error: error.message });
                }
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
