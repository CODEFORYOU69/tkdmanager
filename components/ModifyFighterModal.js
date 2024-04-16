import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const ModifyFighterModal = ({ fighter, open, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (fighter) {
      setFirstName(fighter.firstName);
      setLastName(fighter.lastName);
      setCategory(fighter.category);
    }
  }, [fighter]);

  const handleUpdate = async () => {
    const response = await fetch(`/api/fighters/${fighter.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, category })
    });

    if (response.ok) {
      onClose(true);  // Indique que la mise à jour a été effectuée, peut-être rafraîchir les données
    } else {
      alert('Failed to update fighter');
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>Edit Fighter</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="First Name"
          type="text"
          fullWidth
          variant="outlined"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Last Name"
          type="text"
          fullWidth
          variant="outlined"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Category"
          type="text"
          fullWidth
          variant="outlined"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button onClick={handleUpdate}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModifyFighterModal;
