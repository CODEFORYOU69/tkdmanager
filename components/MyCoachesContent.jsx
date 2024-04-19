import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, List, ListItem, ListItemText, IconButton, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModifyCoachModal from './ModifyCoachModal';
import DeleteUser from './DeleteUser';
import LoadingWithImage from './LoadingWithImage'; // Adjust path as necessary


const MyCoachesContent = () => {
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);



  const fetchData = () => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        return;
    }

    // Remarque : Assurez-vous que l'endpoint accepte clubId en tant que paramètre de requête si nécessaire
    // ou ajustez en fonction des besoins réels de votre application.
    fetch('/api/users', {
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
        setCoaches(data);
    })
    .catch(error => {
        console.error('Error fetching coachs:', error.message);
    });
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
            <Paper style={{ padding: '10px', margin: '5px 0', backgroundColor: '#f5f5f5', borderRadius: '15px', width: '100%', minHeight: '100px' }}>

            <ListItemText
              //color text in black
              color='textPrimary'
              primary={`${coach.name} `}
              primaryTypographyProps={{ style: { color: 'black' } }}

             
            />
           </Paper>

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

export default MyCoachesContent;
