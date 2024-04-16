// pages/api/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { email, password, name } = req.body;

    if (req.method === 'POST') {
        try {
            // Vérifier si le club existe déjà
            let club = await prisma.club.findUnique({
                where: { name }
            });

            if (club) {
                // Si le club existe, créer un nouvel utilisateur lié à ce club
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = await prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        clubId: club.id,
                        name
                    }
                });
                return res.status(201).json({ message: 'Utilisateur créé et ajouté au club existant.' });
            } else {
                // Si le club n'existe pas, créer le club sans ajouter d'utilisateur
                const hashedPassword = await bcrypt.hash(password, 10);
                club = await prisma.club.create({
                    data: {
                        name,
                        email,  // Supposant que vous souhaitez enregistrer un email pour le club
                        password: hashedPassword
                    }
                });
                return res.status(201).json({ message: 'Nouveau club créé, aucun utilisateur ajouté.' });
            }
        } catch (error: any) {
            res.status(500).json({ message: `Erreur serveur: ${error.message}` });
        }
    } else {
        res.status(405).json({ message: 'Méthode non autorisée' });
    }
}
