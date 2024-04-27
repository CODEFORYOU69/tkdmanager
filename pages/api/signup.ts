import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Club, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";
import { Transporter } from "nodemailer";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; error?: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    email,
    password,
    name,
    clubName,
    imageUrl,
  }: { email: string; password: string; name: string; imageUrl: string; clubName: string } =
    req.body;
  try {
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const verificationToken: string = randomBytes(32).toString("hex");
    const tokenExpires: Date = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Check if email or club name is already in use
    const existingUser: User | null = await prisma.user.findUnique({
      where: { email },
    });
    const existingClub: Club | null = await prisma.club.findUnique({
      where: { email },
    });

    if (existingClub) {
      return res.status(409).json({ message: "Club email already in use." });
    }
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    let club = await prisma.club.findUnique({
      where: { name:clubName },
    });
    if (club) {
      const newUser: User = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          clubId: club.id,
          isActive: false,
          verificationToken,
          tokenExpires,
        },
      });
      sendVerificationEmail(email, verificationToken, "user"); // Pour les utilisateurs
      return res
        .status(201)
        .json({ message: "User created and added to the existing club." });
    } else {
      club = await prisma.club.create({
        data: {
          name:clubName,
          email,
          password: hashedPassword,
          image: imageUrl,
          isActive: false,
          verificationToken,
          tokenExpires,
        },
      });
      sendVerificationEmail(email, verificationToken, "club"); // Pour les clubs
      return res
        .status(201)
        .json({ message: "Club and user created. Please verify your email." });
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Signup failed", error: error.message });
  }
}

function sendVerificationEmail(
  email: string,
  token: string,
  type: "user" | "club"
): void {

    const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: `${process.env.GOOGLE_ACCOUNT_NODEMAILER}`,
    pass: `${process.env.GOOGLE_ACCOUNT_PASSWORD_NODEMAILER}`,
  },
});

  const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${token}&type=${type}`;

  const mailOptions = {
    from: `${process.env.GOOGLE_ACCOUNT_NODEMAILER}`,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Please verify your email by clicking on the link below:</p><p><a href="${verificationUrl}">Verify Email</a></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending email: ", error);
  } else {
    console.log("Email sent: ", info.response);
  }
});
}
