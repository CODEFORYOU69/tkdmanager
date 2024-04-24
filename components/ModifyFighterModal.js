"use client";
import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Avatar } from '@mui/material';
import { CldUploadWidget } from 'next-cloudinary';
import { useNotification } from './NotificationService';


const ModifyFighterModal = ({ fighter, open, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState(null);

  const { notify } = useNotification();

  useEffect(() => {
    if (fighter) {
      setFirstName(fighter.firstName);
      setLastName(fighter.lastName);
      setCategory(fighter.category);
      setImageUrl(fighter.imageUrl);
    }
  }, [fighter]);

  const handleUpdate = async () => {
    const response = await fetch(`/api/fighters/${fighter.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, category, imageUrl })
    });

    if (response.ok) {
      notify?.('Fighter updated', { variant: "success" });
      onClose(true);  // Indique que la mise à jour a été effectuée, peut-être rafraîchir les données
    } else {
      notify?.('Failed to update fighter', { variant: "error" });
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
        <Avatar src={imageUrl} alt="avatar" />
        <CldUploadWidget uploadPreset="tkdmanagerimage"
                onSuccess={(results) => {
                    console.log('Public ID', results.info.url);
                    setImageUrl(results.info.url);
                  }}>
  {({ open }) => {
    return (
      <button onClick={() => open()}>
        Upload profil Image
      </button>
    );
  }}
</CldUploadWidget>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button onClick={handleUpdate}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModifyFighterModal;
