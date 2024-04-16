// pages/_app.tsx
import { AppProps } from 'next/app';
import Page from '../app/page';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
    <Page>
      <Component {...pageProps} />
    </Page>
    </ThemeProvider>

  );
}

export default MyApp;




