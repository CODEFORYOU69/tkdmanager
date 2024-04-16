// components/SignUpForm.tsx
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { TextField, Button, Box, Container } from '@mui/material';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SignUpForm: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clubName, setClubName] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('api/signup', {  // Assurez-vous que l'endpoint est correct
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name: clubName,
      }),
    });
  
    const data = await response.json();
  
    if (response.ok) {
      enqueueSnackbar(data.message, { variant: 'success' });
    } else {
      enqueueSnackbar(data.message, { variant: 'error' });
    }
  };
  

  return (
    <Container maxWidth="sm">
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
