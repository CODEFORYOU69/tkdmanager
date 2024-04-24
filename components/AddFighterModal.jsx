// components/AddFighterModal.tsx
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useNotification } from './NotificationService';


const categories = {
    Male: {
        Baby: [],
        Pupille: [],
        Benjamins: ['-21kg', '-24kg', '-27kg', '-30kg', '-33kg', '-37kg', '-41kg', '-45kg', '-49kg', '+49kg'],
        Cadets: ['-33kg', '-37kg', '-41kg', '-45kg', '-49kg', '-53kg', '-57kg', '-61kg', '-65kg', '+65kg'],
        Junior: ['-45kg', '-48kg', '-51kg', '-55kg', '-59kg', '-63kg', '-68kg', '-73kg', '-78kg', '+78kg'],
        Espoir: ['-54kg', '-58kg', '-63kg', '-68kg', '-74kg', '-78kg', '-84kg', '+84kg'],
        Senior: ['-54kg', '-58kg', '-63kg', '-68kg', '-74kg', '-78kg', '-84kg', '+84kg'],
        Master: ['-54kg', '-58kg', '-63kg', '-68kg', '-74kg', '-78kg', '-84kg', '+84kg'],
    },
    Female: {
        Baby: [],
        Pupille: [],
        Benjamins: ['-17kg', '-20kg', '-23kg', '-26kg', '-29kg', '-33kg', '-37kg', '-41kg', '-44kg', '+44kg'],
        Cadets: ['-29kg', '-33kg', '-37kg', '-41kg', '-44kg', '-47kg', '-51kg', '-55kg', '-59kg', '+59kg'],
        Junior: ['-42kg', '-44kg', '-46kg', '-49kg', '-52kg', '-55kg', '-59kg', '-63kg', '-68kg', '+68kg'],
        Espoir: ['-46kg', '-49kg', '-53kg', '-57kg', '-62kg', '-67kg', '-73kg', '+73kg'],
        Senior: ['-46kg', '-49kg', '-53kg', '-57kg', '-62kg', '-67kg', '-73kg', '+73kg'],
        Master: ['-46kg', '-49kg', '-53kg', '-57kg', '-62kg', '-67kg', '-73kg', '+73kg'],
    }
};




const AddFighterModal = ({ open, handleClose }) => {
    const [firstName, setfirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [sex, setSex] = useState('');
    const [ageCategory, setAgeCategory] = useState('');
    const [weightCategory, setWeightCategory] = useState('');

    const { notify } = useNotification();


    const handleSave = async () => {
        const category = `${sex}-${ageCategory}-${weightCategory}`;
        const token = localStorage.getItem('token'); // Récupérer l'ID du club stocké
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
            notify('Fighter added successfully', { variant: 'success' });
            handleClose(); // Fermer la modale après l'ajout
        } else {
            notify('Error while adding fighter', { variant: 'error' });
        }
    };


    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Fighter</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="First Name"
                    fullWidth
                    value={firstName}
                    onChange={(e) => setfirstName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Last Name"
                    fullWidth
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel>Sex</InputLabel>
                    <Select value={sex} onChange={(e) => setSex(e.target.value)}>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Age Category</InputLabel>
                    <Select
                        value={ageCategory}
                        onChange={(e) => {
                            setAgeCategory(e.target.value);
                            setWeightCategory('');
                        }}
                        disabled={!sex}
                    >
                        {sex && Object.keys(categories[sex]).map((category) => (
                            <MenuItem key={category} value={category}>{category}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Weight Category</InputLabel>
                    <Select
                        value={weightCategory}
                        onChange={(e) => setWeightCategory(e.target.value)}
                        disabled={!ageCategory}
                    >
                        {sex && ageCategory && categories[sex][ageCategory].map((weight) => (
                            <MenuItem key={weight} value={weight}>{weight}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFighterModal;