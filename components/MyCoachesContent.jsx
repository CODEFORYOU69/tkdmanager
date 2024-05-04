import React, { useState, useEffect } from 'react';
import { Button, Grid, Container, Typography, List, ListItem, IconButton, Paper, Avatar, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModifyCoachModal from './ModifyCoachModal';
import DeleteUser from './DeleteUser';
import AddUserForm from './AddUserForm';


const MyCoachesContent = () => {
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);


  const handleAddUserOpen = () => {
    setIsAddUserOpen(true);
  };



  const handleAddUserClose = () => {
    setIsAddUserOpen(false);
  };

  const loadCoachs = () => {
    fetch("/api/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then(setCoaches)
      .catch(console.error);
  };
  useEffect(() => {
    loadCoachs();
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
      <Button sx={{ margin: 2 }} variant="contained" onClick={handleAddUserOpen}>
        Add Coach
      </Button>
      <AddUserForm
        open={isAddUserOpen}
        handleClose={handleAddUserClose}
        
      />
      <Container maxWidth="sm">
        <Box sx={{ border: 1, borderColor: 'grey.300', p: 2, my: 2 }}>
          <Typography variant="h4" color="primary" sx={{ textAlign: 'center' }}>My Coachs</Typography>
        </Box>
        <List sx={{ width: '100%' }}>
          {coaches.map(coach => (
            <ListItem key={coach.id} sx={{ px: 0 }}>
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
                    <Avatar src={coach.image} alt={coach.firstName} sx={{ width: 100, height: 100 }} />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6" color="text.primary">
                      {coach.name}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton color="primary" onClick={() => handleOpenModify(coach)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleOpenDelete(coach)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
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

    </div>
  );
};

export default MyCoachesContent;
