import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem, Select, InputLabel, FormControl, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const AddFightModal = ({ open, onClose, competitionId }) => {
    const [fights, setFights] = useState([{ fightNumber: '', color: '' }]);
    const [fighters, setFighters] = useState([]);
    const [selectedFighterId, setSelectedFighterId] = useState('');


    useEffect(() => {
        fetch('/api/fighters')
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
                fighterId: selectedFighterId,
                competitionId,
                fights,
            }),
        });

        if (response.ok) {
            onClose(true);
        } else {
            alert('Failed to add fights to competition');
        }
    };

    const handleAddFight = () => {
        setFights([...fights, { fightNumber: '', color: '' }]);
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
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                        <TextField
                            label="Fight Number"
                            type="number"
                            value={fight.fightNumber}
                            onChange={(e) => handleChangeFight(index, 'fightNumber', e.target.value)}
                            style={{ marginRight: 10 }}
                        />
                        <Select
                            value={fight.color}
                            onChange={(e) => handleChangeFight(index, 'color', e.target.value)}
                            style={{ marginRight: 10 }}
                        >
                            <MenuItem value="Blue">Blue</MenuItem>
                            <MenuItem value="Red">Red</MenuItem>
                        </Select>
                        {index > 0 && (
                            <IconButton onClick={() => handleRemoveFight(index)}>
                                <RemoveCircleIcon />
                            </IconButton>
                        )}
                    </div>
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
