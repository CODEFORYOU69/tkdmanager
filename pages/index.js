import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import Image from 'next/image';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '@fontsource/roboto-condensed/700.css'; // Poids 700 pour gras
import { useRouter } from 'next/router';

const theme = createTheme({
  typography: {
    h2: {
      fontFamily: 'Roboto Condensed',
      fontWeight: 700,
      color: '#2E3B55', // Choisissez une couleur selon votre branding
      textShadow: '1px 1px 4px rgba(0,0,0,0.5)', // Ombre subtile pour du contraste
    },
    button: {
      fontWeight: 500,
      textTransform: 'none' // Enlever la transformation en majuscules par défaut
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          margin: '10px', // Espace entre les boutons
        }
      }
    }
  }
});

const HomePage = () => {
  const router = useRouter();

  const handleSignInClick = () => {
    router.push('/inscription'); // Modifiez selon le chemin de votre page d'inscription
  };
  const handleLogInClick = () => {
    router.push('/login'); // Modifiez selon le chemin de votre page de connexion
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          TKD Manager
        </Typography>
        <Box sx={{ width: 300, height: 300, position: 'relative' }}>
          <Image 
          src="/tkdmanager.jpeg" 
          alt="TKD Manager Image" 
          style={{ objectFit: 'cover' }}
          fill 
          sizes='(max-width: 300px) 100vw, 300px'
          priority />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleSignInClick}>Sign In</Button>
          <Button variant="contained" color="secondary" onClick={handleLogInClick}>Log In</Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default HomePage;
