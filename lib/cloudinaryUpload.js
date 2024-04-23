const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', process.env.CLOUDINARY_CLOUD_NAME);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (response.ok) {  
            return data.secure_url; // Retourne l'URL sécurisée de l'image uploadée
        } else {
            throw new Error(data.error.message);
        }
    } catch (err) {
        console.error('Failed to upload image:', err);
        throw err;
    }
};

export default uploadImageToCloudinary;