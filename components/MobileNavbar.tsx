import React, { useState } from 'react';
import {IconButton, Menu, MenuItem, AppBar, Toolbar, Typography, BottomNavigation, BottomNavigationAction, Paper, useMediaQuery } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi'; // Icon for Fighters
import SportsIcon from '@mui/icons-material/Sports';  
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import SocialIcon from '@mui/icons-material/PeopleOutline'; // Icon for Social Media
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useRouter } from 'next/router';

const MobileNavbar: React.FC = () => {
  const [value, setValue] = useState('home');
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:600px)'); // Détermine si l'appareil est un mobile
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);


 const handleChange = (newValue: string) => {
  setValue(newValue);
  router.push(`/${newValue}`);  // Utilisez `newValue` directement pour router
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  if (isMobile) {
    return (
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10 }} elevation={3}>
      <BottomNavigation value={value} onChange={(event, newValue) => handleChange(newValue)} showLabels>
        <BottomNavigationAction label="Home" value="" icon={<HomeIcon />} />
        <BottomNavigationAction label="Profile" value="profile" icon={<AccountCircleIcon />} />
        <BottomNavigationAction label="Dashboard" value="dashboard" icon={<DashboardIcon />} />
        <IconButton color="inherit" onClick={openMenu} sx={{ flexDirection: 'column', width: 'auto', minWidth: 0 }}>
          <EmojiEventsIcon sx={{ color: 'gray' }}/>
          <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'gray' }}>Manage</Typography>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
        >
          <MenuItem onClick={() => { handleChange('my-coaches'); closeMenu(); }}>Coach </MenuItem>
          <MenuItem onClick={() => { handleChange('my-fighters'); closeMenu(); }}>Fighter</MenuItem>
          <MenuItem onClick={() => { handleChange('mycompetitions'); closeMenu(); }}>Competition</MenuItem>
          <MenuItem onClick={() => { handleChange('competitionday'); closeMenu(); }}>Fight Day</MenuItem>
          <MenuItem onClick={() => { handleChange('socialMedia'); closeMenu(); }}>Social</MenuItem>
        </Menu>
      </BottomNavigation>
    </Paper>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" component="div" >
          TKD MANAGER
        </Typography>
        <BottomNavigation sx={{backgroundColor: '#556cd6'}} value={value} onChange={(event, newValue) => handleChange(newValue)} showLabels>
          <BottomNavigationAction color="primary" label="" value="" icon={<HomeIcon />} />
          <BottomNavigationAction label="Profile" value="profile" icon={<AccountCircleIcon />} />
          <BottomNavigationAction label="Dashboard" value="dashboard" icon={<DashboardIcon />} />
          <BottomNavigationAction label="Coach" value="my-coaches" icon={<SportsIcon />} />
          <BottomNavigationAction label="Fighter" value="my-fighters" icon={<SportsKabaddiIcon />} />
          <BottomNavigationAction label="Competition" value="mycompetitions" icon={<EmojiEventsIcon />} />
          <BottomNavigationAction label="Fight Day" value="competitionday" icon={<SportsMartialArtsIcon />} />
          <BottomNavigationAction label="Social" value="socialMedia" icon={<SocialIcon />} />
          <BottomNavigationAction label="Log out" value="login" icon={<HomeIcon />} onClick={handleLogout} />
        </BottomNavigation>
      </Toolbar>
    </AppBar>
  );
};

export default MobileNavbar;
