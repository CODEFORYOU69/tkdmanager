import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModifyFighterModal from '../components/ModifyFighterModal';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';

const MyFighters = () => {
  const [fighters, setFighters] = useState([]);
  const [selectedFighter, setSelectedFighter] = useState(null);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchData = () => {
    fetch('/api/fighters')
      .then(response => response.json())
      .then(data => setFighters(data))
      .catch(error => console.error('Error fetching fighters:', error));
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
      <Typography variant="h4" gutterBottom>My Fighters</Typography>
      <List>
        {fighters.map(fighter => (
          <ListItem key={fighter.id} secondaryAction={
            <>
              <IconButton edge="end" onClick={() => handleOpenModify(fighter)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleOpenDelete(fighter)}>
                <DeleteIcon />
              </IconButton>
            </>
          }>
            <ListItemText
              primary={`${fighter.firstName} ${fighter.lastName}`}
              secondary={`Category: ${fighter.category}`}
            />
          </ListItem>
        ))}
      </List>
      {selectedFighter && (
        <>
          <ModifyFighterModal fighter={selectedFighter} open={isModifyOpen} onClose={() => handleClose(true)} />
          <DeleteConfirmationDialog fighter={selectedFighter} open={isDeleteOpen} onClose={handleClose} />
        </>
      )}
    </Container>
  );
};

export default MyFighters;
