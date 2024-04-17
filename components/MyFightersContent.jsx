import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, List, ListItem, ListItemText, IconButton, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModifyFighterModal from './ModifyFighterModal';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const MyFightersContent = () => {
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
            <Paper style={{ padding: '10px', margin: '5px 0', backgroundColor: '#f5f5f5', borderRadius: '15px', width: '100%', minHeight: '100px' }}>
              <ListItemText
                primary={`${fighter.firstName} ${fighter.lastName}`}
                secondary={`Category: ${fighter.category}`}
                primaryTypographyProps={{ style: { color: 'black' } }}
              />
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
    </Container>
  );
};

export default MyFightersContent;
