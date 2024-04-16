import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const ModifyCoachModal = ({ coach, open, onClose }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    if (coach) {
      setName(coach.name);
      setPassword(coach.password);
      
    }
  }, [coach]);

  const handleUpdate = async () => {
    const response = await fetch(`/api/users/${coach.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password })
    });

    if (response.ok) {
      onClose(true);  // Indique que la mise à jour a été effectuée, peut-être rafraîchir les données
    } else {
      alert('Failed to update coach');
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>Edit Coach</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button onClick={handleUpdate}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModifyCoachModal;
