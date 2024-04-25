import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import jwt from 'jsonwebtoken';
import { useNotification } from './NotificationService';
import { CldUploadWidget } from 'next-cloudinary';



const AddUserForm = ({ open, handleClose }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [clubId, setClubId] = useState('');  // State to store clubId
    const [imageUrl, setImageUrl] = useState('');

    const { notify } = useNotification();

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

            <DialogTitle>Add New User</DialogTitle>
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
                            Upload Profile Image
                        </button>
                    );
                }}
            </CldUploadWidget>

            <DialogContent>
                <TextField autoFocus margin="dense" label="Email Address" type="email" fullWidth variant="outlined" value={email} onChange={e => setEmail(e.target.value)} />
                <TextField margin="dense" label="Name" type="text" fullWidth variant="outlined" value={name} onChange={e => setName(e.target.value)} />
                <TextField margin="dense" label="Password" type="password" fullWidth variant="outlined" value={password} onChange={e => setPassword(e.target.value)} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={submitForm}>Add User</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddUserForm;
