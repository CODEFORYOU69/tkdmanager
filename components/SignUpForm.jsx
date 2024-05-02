"use client"
import React, { useState } from 'react';
import { TextField, Button, Box, Container, Typography } from '@mui/material';
import { CldUploadWidget } from 'next-cloudinary';
import { useNotification } from './NotificationService';
import Joi from 'joi';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clubName, setClubName] = useState('');
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState({});

  const { notify } = useNotification();

  const schema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')).required().label("Mot de passe"),
    clubName: Joi.string().required().label("Nom du club"),
    name: Joi.string().allow('').label("Nom"),
  });

  const validate = () => {
    const { error } = schema.validate({ email, password, clubName, name }, { abortEarly: false });
    if (!error) return null;

    const newErrors = {};
    for (let detail of error.details) {
      newErrors[detail.path[0]] = detail.message;
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validate();
    if (formErrors) {
      setErrors(formErrors);
      return;
    }

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        clubName,
        name,
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
      <Box sx={{ border: 1, borderColor: 'grey.300', p: 2, my: 2 }}>
        <Typography variant="h4" color="primary" sx={{ textAlign: 'center' }}>Inscription</Typography>
      </Box>
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
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth sx={{ mb: 2 }} error={!!errors.email} helperText={errors.email || ''}
          />
          <TextField label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth sx={{ mb: 2 }} error={!!errors.password} helperText={errors.password || ''}
          />
          <TextField label="Nom du club" value={clubName} onChange={(e) => setClubName(e.target.value)} required fullWidth sx={{ mb: 2 }} error={!!errors.clubName} helperText={errors.clubName || ''}
          />
          <TextField label="Nom" value={name} onChange={(e) => setName(e.target.value)} fullWidth sx={{ mb: 2 }} error={!!errors.name} helperText={errors.name || ''}
          />
          <Button type="submit" variant="contained" color="primary">
            Inscription
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default SignUpForm;
