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
