import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Avatar } from '@mui/material';
import { CldUploadWidget } from 'next-cloudinary';
import { useNotification } from './NotificationService';


const ModifyCoachModal = ({ coach, open, onClose }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState(null);

   const { notify } = useNotification();

  useEffect(() => {
    if (coach) {
      setName(coach.name);
      setPassword(coach.password);
      setImageUrl(coach.imageUrl);
      
    }
  }, [coach]);

  const handleUpdate = async () => {
    
    const response = await fetch(`/api/users/${coach.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password, imageUrl })
    });

    if (response.ok) {
      notify?.('Coach updated', { variant: "success" });
      onClose(true);  // Indique que la mise à jour a été effectuée, peut-être rafraîchir les données
    } else {
      notify?.('Failed to update coach', { variant: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>Edit Coach</DialogTitle>
      <DialogContent>
        <Avatar src={imageUrl} alt="avatar" />
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
