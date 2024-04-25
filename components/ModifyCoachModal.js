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
        <Avatar src={imageUrl} alt="avatar" />
         <CldUploadWidget uploadPreset="tkdmanagerimage"
                onSuccess={(results) => {
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

export default ModifyCoachModal;
