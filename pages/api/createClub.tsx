// pages/api/createClub.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Type pour les données de la requête
interface ClubRequestData {
  email: string;
  password: string;
  name: string;
}

// Type pour la réponse en cas de succès
interface ClubResponseData {
  club: {
    email: string;
    password: string;
    name: string;
    id: number; // Assumer que l'ID est retourné
  };
}

// Type pour la réponse en cas d'erreur
interface ErrorResponse {
  error: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ClubResponseData | ErrorResponse>
) {
    if (req.method === 'POST') {
        try {
            const { email, password, name } = req.body as ClubRequestData;
            const club = await prisma.club.create({
                data: {
                    email,
                    password,
                    name,
                },
            });
            res.status(200).json({ club });
        } catch (error: any) {
            res.status(500).json({ error: `Erreur lors de la création du club: ${error.message}` });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
