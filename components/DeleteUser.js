import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const DeleteUser = ({ coach, open, onClose }) => {
  const handleDelete = async () => {
    const response = await fetch(`/api/users/${coach.id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      onClose(true);  // Pass true to indicate that a deletion was successful
    } else {
      alert('Failed to delete the coach');
      onClose();  // Close the modal without refreshing the fighters list
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete {coach.name}? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button onClick={handleDelete} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUser;
