// components/AddCompetitionModal.tsx
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const AddCompetitionModal = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');

    const handleSave = async () => {
        const token = localStorage.getItem('token'); // Récupérer l'ID du club stocké

        const response = await fetch('/api/competitions/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,

          },
          body: JSON.stringify({
            name: name,
            date: date,
          }),
        });
      
        if (response.ok) {
          handleClose(); // Fermer la modale après l'ajout
        } else {
          console.error('Failed to add competition');
        }
      };
      

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Competition</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Competition Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </DialogContent><DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Competition Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCompetitionModal;
