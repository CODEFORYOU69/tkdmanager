import { ThemeProvider } from '@emotion/react';
import { SnackbarProvider } from 'notistack';
import theme from './theme/theme';
import { CssBaseline } from '@mui/material';
import Layout from './layout';
import { ReactNode } from 'react';
import MobileNavbar from '../components/MobileNavbar';


function Page({ children }: { children: ReactNode }) {
  return (
    <SnackbarProvider maxSnack={3}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <div>
          <MobileNavbar />
            {children}
          </div>
        </Layout>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default Page;
