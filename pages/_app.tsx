// pages/_app.tsx
import { AppProps } from 'next/app';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Layout from '../app/layout';
import MobileNavbar from '../components/MobileNavbar';
import ProfileCard from '../components/ProfileCard';
import { AuthProvider } from '../components/AuthProvider'; // Assurez-vous d'ajuster le chemin
import { NotificationProvider } from "../components/NotificationService";

const theme = createTheme({
   palette: {
    primary: {
      main: '#556cd6',
      dark: '#000000',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#f44336',      // rouge vif pour les erreurs
      light: '#e57373',     // rouge plus clair
      dark: '#d32f2f',      // rouge foncé
      contrastText: '#fff', // texte en blanc pour une bonne lisibilité sur fond rouge
    },
   
  },
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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <AuthProvider> 
          <Layout>
            <CssBaseline />
            <MobileNavbar />
            <ProfileCard />
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default MyApp;
