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
      },
      secondary: {
        main: '#19857b',
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
