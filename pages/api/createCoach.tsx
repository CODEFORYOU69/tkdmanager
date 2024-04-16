// pages/api/createCoach.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { name, email, password, clubName } = req.body;
        try {
            // Vérifier d'abord si le club existe
            const club = await prisma.club.findUnique({
                where: { name: clubName },
            });

            if (!club) {
                return res.status(404).json({ message: "Le club spécifié n'existe pas" });
            }

            // Si le club existe, créer le coach et le lier au club
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password,
                    club: {
                        connect: { name: clubName },
                    },
                    isAccepted: false  // L'inscription du coach reste en attente de validation
                }
            });

            res.status(200).json({ user });
        } catch (error: any) {
            res.status(500).json({ message: `Erreur lors de la création du coach: ${error.message}` });
        }
    } else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
