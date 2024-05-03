// components/AddCompetitionModal.tsx
"use client"
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useNotification } from './NotificationService';
import { CldUploadWidget } from 'next-cloudinary';


const AddCompetitionModal = ({ open, handleClose }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const { notify } = useNotification();

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
        image: imageUrl,
      }),
    });

    if (response.ok) {
      notify('Competition added successfully', { variant: 'success' });
      onClose(true);
      loadCompetitions(); // Fermer la modale après l'ajout
    } else {
      notify('Error while adding competition', { variant: 'error' });
    };
  };

  return (
    <Dialog open={open} onClose={() => handleClose(false)}>
      <DialogTitle>Add New Competition</DialogTitle>
      <CldUploadWidget uploadPreset="tkdmanagerimage"
        onSuccess={(results) => {
          setImageUrl(results.info.url);
        }}>
        {({ open }) => {
          return (
            <button
              style={{
                border: '2px solid black', // Sets a black border around the button
                padding: '10px 20px', // Adds some padding inside the button for better spacing
                color: 'white', // Sets the text color to white
                cursor: 'pointer',
                margin: '25px', // Adds some margin around the button 
                borderRadius: '5px', // Rounds the corners of the button
                backgroundColor: 'black', // Sets the background color to black

                // Changes the cursor to a pointer on hover
              }}
              onClick={() => open()}>
              Upload profil Image
            </button>
          );
        }}
      </CldUploadWidget>
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
        <Button onClick={() => handleClose(false)}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCompetitionModal;
