// pages/_app.tsx
import { AppProps } from 'next/app';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Layout from '../app/layout';
import MobileNavbar from '../components/MobileNavbar';
import ProfileCard from '../components/ProfileCard';
import { AuthProvider } from '../components/AuthProvider'; // Assurez-vous d'ajuster le chemin
import { NotificationProvider } from "../components/NotificationService";
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();


const theme = createTheme({
   palette: {
    primary: {
      main: '#556cd6',
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
      fontFamily: 'Roboto, Arial, sans-serif',
      h4: {
        fontWeight: 600,
      },
    },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <QueryClientProvider client={queryClient}>
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
  </QueryClientProvider>

  );
}

export default MyApp;
