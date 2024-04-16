// components/AddFighterModal.tsx
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const AddFighterModal = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {
    const [firstName, setfirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [category, setCategory] = useState('');

    const handleSave = async () => {
        const token = localStorage.getItem('token'); // Récupérer l'ID du club stocké
console.log("token", token);
        const response = await fetch('/api/fighters/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            category: category,
        }),
        });
      
        if (response.ok) {
          console.log('Fighter added successfully');
          handleClose(); // Fermer la modale après l'ajout
        } else {
          console.error('Failed to add fighter');
        }
      };
      

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Fighter</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Fighter Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => setfirstName(e.target.value)}
                />
            </DialogContent>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Fighter Last Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </DialogContent><DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Fighter Category"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFighterModal;
