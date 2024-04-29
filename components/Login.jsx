// pages/login.tsx
import React, { useState } from 'react';
import { useNotification } from './NotificationService'; // Assurez-vous que le chemin est correct

import { TextField, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';


const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const router = useRouter();
  const { notify } = useNotification(); // Utiliser le contexte de notification ou un objet vide si null

  const handleChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    //remove token from localstorage
    localStorage.removeItem("token");
    event.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", JSON.stringify(data.account.role));
        Cookies.set('token', data.token, { expires: 7 }); // Le jeton expire après 7 jours


        notify("Connexion réussie!", { variant: "success" });

        // Save the JWT in localStorage
        router.push("/dashboard"); // Redirect to a protected page
      } else {
        notify?.(data.message, { variant: "error" });
      }
    } catch (error) {
      notify("Erreur de connexion", { variant: "error" });
      console.error("Login error:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        Connexion
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          value={credentials.email}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          value={credentials.password}
          onChange={handleChange}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          Se connecter
        </Button>
      </form>
    </Container>
  );
};

export default Login;
