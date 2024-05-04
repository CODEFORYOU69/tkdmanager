import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import jwt from 'jsonwebtoken';
import { useNotification } from './NotificationService';
import { CldUploadWidget } from 'next-cloudinary';
import Joi from 'joi';



const AddUserForm = ({ open, handleClose }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [clubId, setClubId] = useState('');  // State to store clubId
    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState({});


    const { notify } = useNotification();

    const schema = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).required().label("Email Address"),
        password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')).required().label("Password"),
        name: Joi.string().required().label("Name"),
    });

    const errorMessages = {
        'string.empty': 'Ce champ ne peut pas être vide',
        'string.email': 'Veuillez entrer une adresse email valide',
        'string.min': `Le mot de passe doit contenir au moins {#limit} caractères.`,
        'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, un caractère spécial et doit faire au moins 8 caractères',
        // Ajoutez d'autres messages d'erreur personnalisés ici
    };

    const validate = () => {
        const { error } = schema.validate({ email, password, name }, { abortEarly: false });
        if (!error) return null;

        const newErrors = {};
        for (let detail of error.details) {
            newErrors[detail.path[0]] = errorMessages[detail.type] || detail.message;
        }
        return newErrors;
    };

    // Function to get clubId from the stored JWT
    const getClubIdFromToken = () => {
        const token = localStorage.getItem('token');  // Retrieve the JWT token from localStorage
        if (token) {
            const decoded = jwt.decode(token);  // Decode the token
            setClubId(decoded.clubId);  // Set the clubId from the decoded token
        }
    };

    // Call getClubIdFromToken when the component mounts
    useEffect(() => {
        getClubIdFromToken();
    }, []);

    const submitForm = async () => {
        const formErrors = validate();
        if (formErrors) {
            setErrors(formErrors);
            return;
        }
        try {
            const response = await fetch('/api/users/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    name,
                    password,
                    clubId,
                    imageUrl,
                }),
            });

            if (response.ok) {
                notify('User added successfully', { variant: 'success' });
                handleClose();
            } else {
                const errorData = await response.json();
                notify('Error while adding user', { variant: 'error' });
                console.error('Error submitting form:', errorData.message || 'Unknown error');
            }
        } catch (err) {
            notify('Error while adding user', { variant: 'error' });
            console.error('Error with fetch operation:', err);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>

            <DialogTitle>Add New Coach</DialogTitle>
            <CldUploadWidget uploadPreset="tkdmanagerimage"
                onSuccess={(results) => {
                    setImageUrl(results.info.url);
                }}>
                {({ open }) => {
                    return (
                        <button
                            style={{
                                border: '2px solid black', // Sets a black border around the button
                                padding: '10px 20px', // Adds some padding inside the button for better spacing
                                color: 'white', // Sets the text color to white
                                cursor: 'pointer',
                                margin: '25px', // Adds some margin around the button 
                                borderRadius: '5px', // Rounds the corners of the button
                                backgroundColor: 'black', // Sets the background color to black

                                // Changes the cursor to a pointer on hover
                            }}
                            onClick={() => open()}>
                            Upload Coach Photo
                        </button>
                    );
                }}
            </CldUploadWidget>

            <DialogContent>
                <TextField margin="dense" label="Name" type="text" fullWidth variant="outlined" value={name} onChange={e => setName(e.target.value)} error={!!errors.name} helperText={errors.name || ''} />
                <TextField autoFocus margin="dense" label="Email Address" type="email" fullWidth variant="outlined" value={email} onChange={e => setEmail(e.target.value)} error={!!errors.email} helperText={errors.email || '' }/>
                <TextField margin="dense" label="Password" type="password" fullWidth variant="outlined" value={password} onChange={e => setPassword(e.target.value)} error={!!errors.password} helperText={errors.password || ''}  />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={submitForm}>Add User</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddUserForm;
