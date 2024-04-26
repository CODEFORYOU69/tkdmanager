"use client";
import React, { useState, useEffect } from 'react';
import {Button, Grid, Container, Typography, List, ListItem, ListItemText, IconButton, Paper, Avatar, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModifyFighterModal from './ModifyFighterModal';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import AddFighterModal from './AddFighterModal';


const MyFightersContent = () => {
  const [fighters, setFighters] = useState([]);
  const [selectedFighter, setSelectedFighter] = useState(null);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openFighterModal, setOpenFighterModal] = useState(false);


  const handleOpenFighterModal = () => setOpenFighterModal(true);
  const handleCloseFighterModal = () => setOpenFighterModal(false);


  const fetchData = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    // Remarque : Assurez-vous que l'endpoint accepte clubId en tant que paramètre de requête si nécessaire
    // ou ajustez en fonction des besoins réels de votre application.
    fetch('/api/fighters', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setFighters(data);
      })
      .catch(error => {
        console.error('Error fetching fighters:', error.message);
      });
  };



  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModify = (fighter) => {
    setSelectedFighter(fighter);
    setIsModifyOpen(true);
  };

  const handleOpenDelete = (fighter) => {
    setSelectedFighter(fighter);
    setIsDeleteOpen(true);
  };

  const handleClose = (modified = false) => {
    setIsModifyOpen(false);
    setIsDeleteOpen(false);
    if (modified) {
      fetchData();  // Recharger les données si des modifications ont été enregistrées
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ border: 1, borderColor: 'grey.300', p: 2, my: 2 }}>

        <Typography variant="h4" color="primary" sx={{ textAlign: 'center' }}>My Fighters</Typography>
      </Box>
      <Button variant="contained" color="primary" onClick={handleOpenFighterModal}>
        Add Fighter
      </Button>
      <List sx={{ width: '100%' }}>
        {fighters.map(fighter => (
          <ListItem key={fighter.id} sx={{ px: 0 }} >
            <Paper elevation={3} sx={{
              p: 2,
              m: 1,
              backgroundColor: '#f5f5f5',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              width: '100%'
            }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar src={fighter.image} alt={fighter.firstName} sx={{ width: 100, height: 100 }} />
                </Grid>
                <Grid item xs>
              <ListItemText
                primary={`${fighter.firstName} ${fighter.lastName}`}
                secondary={`Category: ${fighter.category}`}
                primaryTypographyProps={{ style: { color: 'black' } }}
                
              />
                </Grid>
                <Grid item>
                  <IconButton color="primary" onClick={() => handleOpenModify(fighter)}>
                <EditIcon />
              </IconButton>
                  <IconButton color="error" onClick={() => handleOpenDelete(fighter)}>
                <DeleteIcon />
              </IconButton>
                </Grid>
              </Grid>
            </Paper>
          </ListItem>
        ))}
      </List>
      {selectedFighter && (
        <>
          <ModifyFighterModal fighter={selectedFighter} open={isModifyOpen} onClose={() => handleClose(true)} />
          <DeleteConfirmationDialog fighter={selectedFighter} open={isDeleteOpen} onClose={handleClose} />
        </>
      )}
      <AddFighterModal open={openFighterModal} handleClose={handleCloseFighterModal} />

    </Container>
  );
};

export default MyFightersContent;
