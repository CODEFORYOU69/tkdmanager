"use client";
import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { CldUploadWidget } from 'next-cloudinary';
import { useNotification } from './NotificationService';
import { useRouter } from 'next/router';



const Profile = () => {
    const [profile, setProfile] = useState({ name: '', email: '', imageUrl: '' });
    const [imageUrl, setImageUrl] = useState(null);
    const [password, setPassword] = useState('');

    const router = useRouter();


    // Initialement définir 'user' ou 'club' basé sur ce qui est stocké dans localStorage
    const [profileType, setProfileType] = useState(localStorage.getItem('role').replace(/"/g, ''));

    const { notify } = useNotification();

    useEffect(() => {
        fetch(`/api/profile?profileType=${profileType}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                const { name, email, imageUrl } = data;
                setProfile({ name, email, imageUrl });
            })
            .catch(err => console.error('Error fetching profile:', err));
    }, [profileType]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'password') {
            setPassword(value);
        } else {
            setProfile(prev => ({ ...prev, [name]: value }));
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            name: profile.name,
            email: profile.email,
            password: profile.password,
            imageUrl: imageUrl // URL retournée par le composant d'upload
        };

        fetch(`/api/updateProfile?profileType=${profileType}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                notify?.('Fighter added successfully', { variant: 'success' });
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                notify?.('Error updating profile', { variant: 'error' });
            });
    };


    return (
        <Container maxWidth="sm">
            <Box sx={{ border: 1, borderColor: 'grey.300', p: 2, my: 2 }}>
                <Typography variant="h4" color="primary" sx={{ textAlign: 'center' }}>Edit {profileType === 'user' ? 'User' : 'Club'} Profile</Typography>
            </Box>            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={handleInputChange}
                    margin="normal"
                />
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

                <Button type="submit" color="primary" variant="contained">
                    Save Changes
                </Button>
            </form>
        </Container>
    );
};

export default Profile;
