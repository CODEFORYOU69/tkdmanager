import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const modelMap = {
    user: prisma.user,
    club: prisma.club,
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email, password, imageUrl } = req.body;
        const profileType = req.query.profileType;
        const model = modelMap[profileType];
        console.log("IMAGE", imageUrl);

        if (!model) {
            return res.status(400).json({ message: 'Invalid profile type' });
        }

        try {
            const token = req.headers.authorization?.split(' ')[1];
            const { email: userId } = jwt.verify(token, process.env.JWT_SECRET);

            // Gérer la mise à jour du mot de passe si fourni
            let updateData = { name, email, image: imageUrl, password  };
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = await model.findUnique({ where: { email: userId } });
                if (user.password !== hashedPassword) {
                    updateData.password = hashedPassword;
                }
            }

            const updatedProfile = await model.update({
                where: { email: userId },
                data: updateData
            });

            res.status(200).json(updatedProfile);
        } catch (error) {
            console.error('Failed to update profile:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export const config = {
    api: {
        bodyParser: true, // Activer bodyParser car nous ne gérons pas les fichiers ici
    },
};
