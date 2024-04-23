"use client";
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MobileNavbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleLogout = () => {
      // Clear local storage or cookies here
      localStorage.removeItem('token');  // Assuming 'token' is your authentication token
  
      // You could also clear cookies if they are used
  
      // Redirect to the login page
      router.push('/login');
  };
  

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={handleMenu}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Taekwondo App
        </Typography>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleClose}
        >
          <Link href="/"><MenuItem onClick={handleClose}>Home</MenuItem></Link>
          <Link href="/profile"><MenuItem onClick={handleClose}>Profile</MenuItem></Link>
          <Link href="/dashboard"><MenuItem onClick={handleClose}>Dashboard</MenuItem></Link>
          <Link href="/my-coaches"><MenuItem onClick={handleClose}>Coach</MenuItem></Link>
          <Link href="/my-fighters"><MenuItem onClick={handleClose}>Fighter</MenuItem></Link>
          <Link href="/mycompetitions"><MenuItem onClick={handleClose}>My Competition</MenuItem></Link>
          <Link href="/competitionday"><MenuItem onClick={handleClose}>Fight Day</MenuItem></Link>
          <Link href="/inscription"><Button color="inherit" onClick={handleClose}>Signin</Button></Link>
          <Link href="/login"><Button color="inherit" onClick={handleClose}>Login</Button></Link>
          <Button color="inherit" onClick={handleLogout}>Log out</Button>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default MobileNavbar;
