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
    let imageData = req.file.buffer; // Gardez l'image originale en mémoire

    // Créer un objet FormData pour l'envoi à remove.bg
     try {
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

    if (removeBgResponse.status === 200) {
        imageData = removeBgResponse.data; // Utilisez l'image modifiée si remove.bg réussit
    }
 } catch (removeBgError) {
      console.error("Remove.bg API Error:", removeBgError); // Log the error but continue to upload the original image
    }
    // Convertir l'image traitée en base64 pour l'envoyer à Cloudinary
    const base64Image = Buffer.from(imageData).toString('base64');
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

    if (cloudinaryResponse.status === 200) {
      res.status(200).json({ imageUrl: cloudinaryResponse.data.secure_url });
    }else {
      throw new Error(`Error from Cloudinary: ${cloudinaryResponse.status} ${cloudinaryResponse.statusText}`);
    }
} catch (error) {
    console.error("Final API Error:", error);
    res.status(500).json({ message: "Failed to process and upload image." });
  }
    
}
