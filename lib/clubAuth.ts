// lib/clubauth/club.ts
import bcrypt from 'bcrypt';
import {PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Création d'un club avec un email et mot de passe hashé
export async function createClub(name: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const club = await prisma.club.create({
    data: {
      name,
      email,
      password: hashedPassword,
    }
  });
  return club;
}

// Authentification d'un club avec email et mot de passe
export async function authenticateClub(email: string, password: string): Promise<{ id: number, name: string, email: string } | null> {
  const club = await prisma.club.findUnique({ where: { email } });

  if (!club || !(await bcrypt.compare(password, club.password)) || !club.isActive ) {
    return null;  // Retourner null au lieu de false
  } else {
    return { id: club.id, name: club.name, email: club.email };
  }
}


// Fonction pour trouver un club par son nom
export async function findClubByName(clubName: string) {
  const club = await prisma.club.findUnique({
    where: { name: clubName }
  });

  if (!club) {
    throw new Error("Club not found.");
  }

  return club;
}

