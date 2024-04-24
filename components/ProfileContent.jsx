"use client";
import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import { CldUploadWidget } from 'next-cloudinary';
import { useNotification } from './NotificationService';
import { useRouter } from 'next/router';



const Profile = () => {
    const [profile, setProfile] = useState({ name: '', email: '', imageUrl: '' });
    const [imageUrl, setImageUrl] = useState(null);
    // Initialement définir 'user' ou 'club' basé sur ce qui est stocké dans localStorage
    const [profileType, setProfileType] = useState(localStorage.getItem('role').replace(/"/g, ''));

    const router = useRouter();
    const { notify } = useNotification();

    useEffect(() => {
        fetch(`/api/profile?profileType=${profileType}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => setProfile(data))
            .catch(err => console.error('Error fetching profile:', err));
    }, [profileType]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
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
                console.log('data', data);
                notify?.('Fighter added successfully', { variant: 'success' });
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                notify?.('Error updating profile', { variant: 'error' });
            });
    };


    return (
        <Container maxWidth="sm">
            <Typography variant="h4">Edit {profileType === 'user' ? 'User' : 'Club'} Profile</Typography>
            <form onSubmit={handleSubmit}>
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
                    value={profile.password}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <CldUploadWidget uploadPreset="tkdmanagerimage"
                    onSuccess={(results) => {
                        console.log('Public ID', results.info.url);
                        setImageUrl(results.info.url);
                    }}>
                    {({ open }) => {
                        return (
                            <button onClick={() => open()}>
                                Upload profil Image
                            </button>
                        );
                    }}
                </CldUploadWidget>
                {/* <Typography variant="subtitle1">Profile Image</Typography>
                <input
                    type="file"
                    onChange={handleImageChange}
                /> */}
                <Button type="submit" color="primary" variant="contained">
                    Save Changes
                </Button>
            </form>
        </Container>
    );
};

export default Profile;
