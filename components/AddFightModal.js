import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const AddFightModal = ({ open, onClose, competitionId }) => {
    const [fightNumber, setFightNumber] = useState('');
    const [color, setColor] = useState('');
    const [fighters, setFighters] = useState([]);
    const [selectedFighterId, setSelectedFighterId] = useState('');  // Initialisation à chaîne vide ou autre valeur par défaut

    useEffect(() => {
        fetch('/api/fighters')  // Assurez-vous que cette URL est correcte et que l'API renvoie les données attendues
            .then(response => response.json())
            .then(setFighters)
            .catch(error => console.error('Error fetching fighters:', error));
    }, []);

    const handleSave = async () => {
        if (!selectedFighterId) {
            alert('Please select a fighter');
            return;
        }
        const response = await fetch('/api/match/addFight', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fighterId: selectedFighterId,  // Utilisation de l'ID du combattant sélectionné
                competitionId,  
                fightNumber,
                color,
            }),
        });

        if (response.ok) {
            onClose(true);  // Ferme la modal et rafraîchit éventuellement les données parentes
        } else {
            alert('Failed to add fighter to competition');
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)}>
            <DialogTitle>Add Fighter to Competition</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Fight Number"
                    type="number"
                    value={fightNumber}
                    onChange={(e) => setFightNumber(e.target.value)}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="color-label">Color</InputLabel>
                    <Select
                        value={color}
                        label="Color"
                        onChange={(e) => setColor(e.target.value)}
                        labelId="color-label"
                    >
                        <MenuItem value="Blue">Blue</MenuItem>
                        <MenuItem value="Red">Red</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="fighter-label">Fighter</InputLabel>
                    <Select
                        labelId="fighter-label"
                        value={selectedFighterId}
                        label="Fighter"
                        onChange={(e) => setSelectedFighterId(e.target.value)}
                        fullWidth
                    >
                        {fighters.map((fighter) => (
                            <MenuItem key={fighter.id} value={fighter.id}>
                                {fighter.name} {fighter.lastName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)}>Cancel</Button>
                <Button onClick={handleSave}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFightModal;
