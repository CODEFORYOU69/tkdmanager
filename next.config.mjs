// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'], // Assurez-vous que le domaine correspond à votre cloud Cloudinary
  },
  env: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET
  },
  reactStrictMode: true, // optionnel, mais recommandé pour le développement avec React
};

export default nextConfig;
