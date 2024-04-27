import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify(req, res) {
  const { token, type } = req.query; // Obtenir le token et le type de la requête

  console.log("Verifying token:", token);
  console.log("Type:", type)

  if (!type || !token) {
    return res.status(400).json({ message: "Missing token or type parameters." });
  }

  try {
    let entity = null;
    console.log("enity:", entity);

    // Sélectionner la méthode de recherche en fonction du type
    if (type === 'user') {
      entity = await prisma.user.findFirst({
        where: {
          verificationToken: token,
          tokenExpires: {
            gt: new Date(), // tokenExpires doit être supérieur à la date actuelle
          },
        },
      });
    } else if (type === 'club') {
      entity = await prisma.club.findFirst({
        where: {
          verificationToken: token,
          tokenExpires: {
            gt: new Date(),
          },
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid type specified." });
    }

    // Vérifier si l'entité a été trouvée et que le token est toujours valide
    if (!entity) {
      return res.status(400).json({ message: "This token is invalid or has expired." });
    }

    // Activer le compte en fonction du type
    if (type === 'user') {
      await prisma.user.update({
        where: {
          id: entity.id,
        },
        data: {
          isActive: true,
          verificationToken: null, // Effacer le token
          tokenExpires: null, // Effacer la date d'expiration du token
        },
      });
    } else if (type === 'club') {
      await prisma.club.update({
        where: {
          id: entity.id,
        },
        data: {
          isActive: true,
          verificationToken: null,
          tokenExpires: null,
        },
      });
    }

    res.json({ message: "Your account has been verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
}

export default verify;
