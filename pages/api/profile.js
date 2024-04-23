import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();
const modelMap = {
    user: prisma.user,
    club: prisma.club,
    // Ajoutez d'autres modèles si nécessaire
};

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { profileType } = req.query; // Utilisez req.query pour accéder aux paramètres dans Next.js
        console.log("profileType", profileType)
        //get user id from bearear token
         const token = req.headers.authorization?.split(' ')[1];
         const { email } = jwt.verify(token, process.env.JWT_SECRET);
            

        const userEmail = email; // Assurez-vous que l'ID utilisateur est correctement défini par votre middleware d'authentification

        const model = modelMap[profileType]; // Accéder au modèle correspondant
        if (!model) {
            return res.status(400).json({ message: 'Invalid profile type' });
        }

        try {
            const profile = await model.findUnique({
                where: { email: userEmail }
            });
            if (profile) {
                res.status(200).json(profile);
            } else {
                res.status(404).json({ message: 'Profile not found' });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
