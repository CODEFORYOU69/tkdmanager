import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';

const prisma = new PrismaClient();

app.post('/api/sendOtp', async (req, res) => {
  const { email } = req.body;
  const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

  // Save OTP to the database
  const user = await prisma.club.update({
    where: { email },
    data: {
      otp: otp,
      otpCreatedAt: new Date()
    }
  });

  // Email setup and sending logic (configure nodemailer here)
  // ...

  res.json({ message: 'OTP sent to email.' });
});
