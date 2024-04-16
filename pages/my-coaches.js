import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModifyCoachModal from '../components/ModifyCoachModal';
import DeleteUser from '../components/DeleteUser';
import LoadingWithImage from '../components/LoadingWithImage'; // Adjust path as necessary


const MyCoaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  const fetchData = () => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setCoaches(data))
      .catch(error => console.error('Error fetching coaches:', error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModify = (coach) => {
    setSelectedCoach(coach);
    setIsModifyOpen(true);
  };

  const handleOpenDelete = (coach) => {
    setSelectedCoach(coach);
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
    <div>
      {loading ? (
        <LoadingWithImage />
      ) : (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>My Coaches</Typography>
      <List>
        {coaches.map(coach => (
          <ListItem key={coach.id} secondaryAction={
            <>
              <IconButton edge="end" onClick={() => handleOpenModify(coach)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleOpenDelete(coach)}>
                <DeleteIcon />
              </IconButton>
            </>
          }>
            <ListItemText
              primary={`${coach.name} `}
             
            />
          </ListItem>
        ))}
      </List>
      {selectedCoach && (
        <>
          <ModifyCoachModal coach={selectedCoach} open={isModifyOpen} onClose={() => handleClose(true)} />
          <DeleteUser coach={selectedCoach} open={isDeleteOpen} onClose={handleClose} />
        </>
      )}
    </Container>
    )}
    </div>
  );
};

export default MyCoaches;
