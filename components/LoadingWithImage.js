import React from 'react';
import { CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const LoaderContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1000,
  backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: Adds a white translucent background
});

const ImageBackground = styled('img')({
  position: 'absolute',
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'cover', // Ensures the image covers the area without distorting its aspect ratio
  opacity: 0.5, // Optional: Makes the image less prominent so the loader stands out
});

const LoadingWithImage = () => {
  return (
    <LoaderContainer>
      <ImageBackground src="/brontkd.jpg" alt="Loading" />
      <CircularProgress size={80} thickness={4} style={{ color: 'orange' }} />
    </LoaderContainer>
  );
};

export default LoadingWithImage;
