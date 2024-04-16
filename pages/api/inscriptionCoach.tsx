// pages/inscriptionCoach.tsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { useSnackbar } from 'notistack';

const InscriptionCoach: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [coachData, setCoachData] = useState({
    name: '',
    email: '',
    password: '',
    clubName: ''
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCoachData({ ...coachData, [event.target.name]: event.target.value });
  };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/createCoach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(coachData)
            });
            if (response.ok) {
                enqueueSnackbar('Inscription en attente de validation.', { variant: 'success' });
            } else {
                throw new Error('Échec de linscription');
      }
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 4 }}>Inscription Coach</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nom complet"
          variant="outlined"
          fullWidth
          name="name"
          value={coachData.name}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          name="email"
          value={coachData.email}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Mot de passe"
          type="password"
          variant="outlined"
          fullWidth
          name="password"
          value={coachData.password}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Nom du club"
          variant="outlined"
          fullWidth
          name="clubName"
          value={coachData.clubName}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sinscrire
        </Button>
      </form>
    </Container>
  );
};

export default InscriptionCoach;
