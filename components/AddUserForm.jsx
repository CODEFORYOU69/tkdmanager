import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import jwt from 'jsonwebtoken';

const AddUserForm = ({ open, handleClose }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [clubId, setClubId] = useState('');  // State to store clubId

    // Function to get clubId from the stored JWT
    const getClubIdFromToken = () => {
        const token = localStorage.getItem('token');  // Retrieve the JWT token from localStorage
        if (token) {
            const decoded = jwt.decode(token);  // Decode the token
            setClubId(decoded.clubId);  // Set the clubId from the decoded token
        }
    };

    // Call getClubIdFromToken when the component mounts
    React.useEffect(() => {
        getClubIdFromToken();
    }, []);

    const submitForm = async () => {
        try {
            const response = await fetch('/api/users/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    name,
                    password,
                    clubId,
                }),
            });

            if (response.ok) {
                handleClose();
            } else {
                const errorData = await response.json();
                console.error('Error submitting form:', errorData.message || 'Unknown error');
            }
        } catch (err) {
            console.error('Error with fetch operation:', err);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New User</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense" label="Email Address" type="email" fullWidth variant="outlined" value={email} onChange={e => setEmail(e.target.value)} />
                <TextField margin="dense" label="Name" type="text" fullWidth variant="outlined" value={name} onChange={e => setName(e.target.value)} />
                <TextField margin="dense" label="Password" type="password" fullWidth variant="outlined" value={password} onChange={e => setPassword(e.target.value)} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={submitForm}>Add User</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddUserForm;
