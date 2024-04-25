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
<Link href="/" passHref>
  <MenuItem onClick={handleClose} className="hover:bg-gray-100 text-gray-700">Home</MenuItem>
</Link>
<Link href="/profile" passHref>
  <MenuItem onClick={handleClose} className="hover:bg-gray-100 text-gray-700">Profile</MenuItem>
</Link>
<Link href="/dashboard" passHref>
  <MenuItem onClick={handleClose} className="hover:bg-gray-100 text-gray-700">Dashboard</MenuItem>
</Link>
<Link href="/my-coaches" passHref>
  <MenuItem onClick={handleClose} className="hover:bg-gray-100 text-gray-700">Coach</MenuItem>
</Link>
<Link href="/my-fighters" passHref>
  <MenuItem onClick={handleClose} className="hover:bg-gray-100 text-gray-700">Fighter</MenuItem>
</Link>
<Link href="/mycompetitions" passHref>
  <MenuItem onClick={handleClose} className="hover:bg-gray-100 text-gray-700">My Competition</MenuItem>
</Link>
<Link href="/competitionday" passHref>
  <MenuItem onClick={handleClose} className="hover:bg-gray-100 text-gray-700">Fight Day</MenuItem>
</Link>
<Link href="/socialMedia" passHref>
  <MenuItem onClick={handleClose} className="hover:bg-gray-100 text-gray-700">Social Media</MenuItem>
</Link>
<Link href="/inscription" passHref>
  <Button color="inherit" onClick={handleClose} className="hover:bg-gray-100 text-gray-700">Signin</Button>
</Link>
<Link href="/login" passHref>
  <Button color="inherit" onClick={handleClose} className="hover:bg-gray-100 text-gray-700">Login</Button>
</Link>

          <Button color="inherit" onClick={handleLogout}>Log out</Button>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default MobileNavbar;
