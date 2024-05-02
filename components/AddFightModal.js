"use client";
import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem, Select, InputLabel, FormControl, IconButton, Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useNotification } from './NotificationService';

const ColorButton = ({ selectedColor, onSelectColor, color }) => (
    <Button
        style={{
            backgroundColor: color,
            minWidth: 140,
            minHeight: 30,
            marginTop: 15,

            border: selectedColor === color ? '2px solid black' : '1px solid grey'
        }}
        onClick={() => onSelectColor(color)}
    />
);

const AddFightModal = ({ open, onClose, competitionId }) => {
    const [fights, setFights] = useState([{ fightNumber: '', color: 'Blue' }]);
    const [fighters, setFighters] = useState([]);
    const [selectedFighterId, setSelectedFighterId] = useState('');

    const { notify } = useNotification();


  

 useEffect(() => {
        if (open) {
            const fetchData = async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }
                
                try {
                    const response = await fetch('/api/fighters', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    
                    const data = await response.json();
                    setFighters(data);
                } catch (error) {
                    console.error('Error fetching fighters:', error);
                }
            };

            fetchData();
        }
    }, [open]);

  

    const handleSave = async () => {
        if (!selectedFighterId) {
            alert('Please select a fighter');
            return;
        }

        const response = await fetch('/api/match/addFight', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fighterId: selectedFighterId,
                competitionId,
                fights,
            }),
        });

        if (response.ok) {
            notify?.('Fights added to competition', { variant:'success' });
            onClose(true);
        } else {
            notify?.('Error adding fights to competition', { variant: 'error' });
        }
    };

    const handleAddFight = () => {
        setFights([...fights, { fightNumber: '', color: 'Blue' }]);
    };

    const handleRemoveFight = (index) => {
        setFights(fights.filter((_, i) => i !== index));
    };

    const handleChangeFight = (index, field, value) => {
        const newFights = [...fights];
        newFights[index][field] = value;
        setFights(newFights);
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)}>
            <DialogTitle>Add Multiple Fights for a Fighter</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="fighter-label">Fighter</InputLabel>
                    <Select
                        labelId="fighter-label"
                        value={selectedFighterId}
                        label="Fighter"
                        onChange={(e) => setSelectedFighterId(e.target.value)}
                    >
                        {fighters.map((fighter) => (
                            <MenuItem key={fighter.id} value={fighter.id}>
                                {fighter.firstName} {fighter.lastName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {fights.map((fight, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                        <TextField
                            label="Fight Number"
                            type="number"
                            value={fight.fightNumber}
                            onChange={(e) => handleChangeFight(index, 'fightNumber', e.target.value)}
                            fullWidth
                        />
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <ColorButton selectedColor={fight.color} onSelectColor={(color) => handleChangeFight(index, 'color', color)} color="Red" />
                            <ColorButton selectedColor={fight.color} onSelectColor={(color) => handleChangeFight(index, 'color', color)} color="Blue" />
                        </Box>
                        {index > 0 && (
                            <IconButton onClick={() => handleRemoveFight(index)} sx={{ mt: 1 }}>
                                <RemoveCircleIcon />
                            </IconButton>
                        )}
                    </Box>
                ))}
                <Button startIcon={<AddCircleIcon />} onClick={handleAddFight}>
                    Add Another Fight
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save All Fights</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFightModal;
