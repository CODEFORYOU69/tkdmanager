// pages/dashboard.tsx
import React, { useState } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import AddFighterModal from './AddFighterModal';
import AddCompetitionModal from './AddCompetitionModal';
import AddUserForm from './AddUserForm';


const DashboardContent = () => {
  // État pour gérer l'ouverture/fermeture des modales
  const [openFighterModal, setOpenFighterModal] = useState(false);
  const [openCompetitionModal, setOpenCompetitionModal] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  

  const handleAddUserOpen = () => {
    setIsAddUserOpen(true);
  };

  const handleAddUserClose = () => {
    setIsAddUserOpen(false);
  };


  // Fonctions pour gérer l'ouverture et la fermeture des modales Fighter
  const handleOpenFighterModal = () => setOpenFighterModal(true);
  const handleCloseFighterModal = () => setOpenFighterModal(false);

  // Fonctions pour gérer l'ouverture et la fermeture des modales Competition
  const handleOpenCompetitionModal = () => setOpenCompetitionModal(true);
  const handleCloseCompetitionModal = () => setOpenCompetitionModal(false);

  return (
    <Container maxWidth="sm">
      <Box sx={{ border: 1, borderColor: 'grey.300', p: 2, my: 2 }}>
                <Typography variant="h4" color="primary"   sx={{ textAlign: 'center' }}>Dashboard</Typography>
            </Box>   
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Button variant="contained" onClick={handleAddUserOpen}>
        Add Coach
      </Button>
      
        <Button variant="contained" color="primary" onClick={handleOpenFighterModal}>
          Add Fighter
        </Button>
        <Button variant="contained" color="primary" onClick={handleOpenCompetitionModal}>
          Add Competition
        </Button>
        {/* Les autres boutons pour "My Fighters" et "My Competitions" pourraient également être ajoutés ici */}
      </Box>

      {/* Modales pour ajouter des combattants et des compétitions */}
      <AddUserForm
        open={isAddUserOpen}
        handleClose={handleAddUserClose}
      />
      <AddFighterModal open={openFighterModal} handleClose={handleCloseFighterModal}  />
      <AddCompetitionModal open={openCompetitionModal} handleClose={handleCloseCompetitionModal} />
    </Container>
  );
};

export default DashboardContent;
