import { SnackbarProvider } from 'notistack';
import { CssBaseline } from '@mui/material';
import Layout from './layout';
import React, { ReactNode } from 'react';
import MobileNavbar from '../components/MobileNavbar';

interface PageProps {
  children: ReactNode;
}

const Page: React.FC<PageProps> = ({ children }) => {
  return (
    <SnackbarProvider maxSnack={3}>
        <CssBaseline />
        <Layout>
          <MobileNavbar />
          {children}
        </Layout>
    </SnackbarProvider>
  );
}

export default Page;
