import multer from 'multer';
import { promisify } from 'util';
import axios from 'axios';
import FormData from 'form-data';

// Configuration de multer pour le stockage en mémoire
const upload = multer({ storage: multer.memoryStorage() });
const singleFileUpload = promisify(upload.single('file'));

export const config = {
  api: {
    bodyParser: false, // Disable the default bodyParser to enable multipart/form data
},
};

export default async function handler(req, res) {
  try {
    // Exécuter le middleware multer manuellement
    await singleFileUpload(req, res);

    if (!req.file) {
      throw new Error("No file uploaded or file upload failed.");
    }

    // Créer un objet FormData pour l'envoi à remove.bg
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', req.file.buffer, req.file.originalname);

    // Effectuer la requête à remove.bg via axios
    const removeBgResponse = await axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      data: formData,
      responseType: 'arraybuffer',
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': process.env.REMOVE_BG_KEY,
      },
    });

    if (removeBgResponse.status !== 200) {
      throw new Error(`Error from remove.bg: ${removeBgResponse.status} ${removeBgResponse.statusText}`);
    }

    // Convertir l'image traitée en base64 pour l'envoyer à Cloudinary
    const base64Image = Buffer.from(removeBgResponse.data).toString('base64');
    const cloudinaryResponse = await axios({
      method: 'post',
      url: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      data: {
        file: `data:image/png;base64,${base64Image}`,
        upload_preset: 'tkdmanagerimage'
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (cloudinaryResponse.status !== 200) {
      throw new Error(`Error from Cloudinary: ${cloudinaryResponse.status} ${cloudinaryResponse.statusText}`);
    }

    // Répondre avec l'URL de l'image sur Cloudinary
    res.status(200).json({ imageUrl: cloudinaryResponse.data.secure_url });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: error.message });
  }
}
