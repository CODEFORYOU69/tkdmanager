"use client"
import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Avatar } from '@mui/material';
import { Dashboard } from '@uppy/react';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import Webcam from '@uppy/webcam';
import ImageEditor from '@uppy/image-editor';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/image-editor/dist/style.css';
import { useNotification } from './NotificationService';

const ModifyFighterModal = ({ fighter, open, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState(null);

  const { notify } = useNotification();

  const uppy = new Uppy({
    restrictions: { maxNumberOfFiles: 1 },
    autoProceed: false
  });

  uppy.use(Webcam);
  uppy.use(ImageEditor);
  uppy.use(XHRUpload, {
    endpoint: '/api/removeBackground',
    fieldName: 'file',
    formData: true,
    method: 'post',
    bundle: true,
    headers: {
      accept: 'application/json',
    },
    onError: (error) => {
      notify(`Error: ${error.message}`, { variant: "error" });
    },

  });

  uppy.on('upload-success', (file, response) => {
  
  if (response.status === 200) {
    const responseData = response.body;
    setImageUrl(responseData.imageUrl);
    if (responseData.imageUrl) {
      console.log('Image processed and uploaded successfully:');
    }
  }
});

  useEffect(() => {
    if (fighter) {
      setFirstName(fighter.firstName);
      setLastName(fighter.lastName);
      setCategory(fighter.category);
    }
  }, [fighter, imageUrl]);

  const handleUpdate = async () => {
    const response = await fetch(`/api/fighters/${fighter.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, category, imageUrl })
    });

    if (response.ok) {
      notify('Fighter updated successfully', { variant: "success" });
      onClose(true);
    } else {
      notify('Failed to update fighter', { variant: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>Edit Fighter</DialogTitle>
      <DialogContent>
        <Dashboard
          uppy={uppy}
          proudlyDisplayPoweredByUppy={false}
          plugins={['Webcam', 'ImageEditor']}
        />
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
        {imageUrl && <Avatar src={imageUrl} alt="Fighter" />}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button onClick={handleUpdate}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModifyFighterModal;
