"use client"
import React, { useState } from 'react';
import { TextField, Button, Box, Container } from '@mui/material';
import { CldUploadWidget } from 'next-cloudinary';
import { useNotification } from './NotificationService';



const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clubName, setClubName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const { notify } = useNotification(); // Utiliser le contexte de notification ou un objet vide si null


  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/signup", {
      // Assurez-vous que l'endpoint est correct
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name: clubName,
        imageUrl,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      notify?.(data.message, { variant: "success" });
    } else {
      notify?.(data.message, { variant: "error" });
    }
  };


  return (
    <Container maxWidth="sm">
      <>
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
      </>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth sx={{ mb: 2 }} />
          <TextField label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth sx={{ mb: 2 }} />
          <TextField label="Nom du club" value={clubName} onChange={(e) => setClubName(e.target.value)} required fullWidth sx={{ mb: 2 }} />

          <Button type="submit" variant="contained" color="primary">
            Inscription
          </Button>
        </form>
      </Box>

    </Container>
  );
};

export default SignUpForm;
