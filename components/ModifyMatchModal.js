import React, { useState, useEffect } from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
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
const ModifyMatchModal = ({ open, onClose, match, matchId, competitionId, fighters }) => {
    const [fightNumber, setFightNumber] = useState(match.fightNumber);
    const [color, setColor] = useState(match.color);
    const [fighterId, setFighterId] = useState(match.fighterId);
    const { notify } = useNotification();

    useEffect(() => {
        setFightNumber(match.fightNumber);
        setColor(match.color);
        setFighterId(match.fighterId);
    }, [match]);

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/match/${matchId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                fightNumber,
                color,
                fighterId,
                competitionId,
                
            }),
        });

        if (response.ok) {
            notify('Match updated successfully', { variant: 'success' });
            onClose(true);  // Signal to refresh the data
        } else {
            notify('Error updating match', { variant: 'error' });
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)}>
            <DialogTitle>Edit Match</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Fighter</InputLabel>
                     <Select
                        labelId="fighter-label"
                        value={fighterId}
                        label="Fighter"
                        onChange={(e) => setFighterId(e.target.value)}
                    >
                        {fighters.map((fighter) => (
                            <MenuItem key={fighter.id} value={fighter.id}>
                                {fighter.firstName} {fighter.lastName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    margin="dense"
                    label="Fight Number"
                    type="number"
                    fullWidth
                    value={fightNumber}
                    onChange={(e) => setFightNumber(e.target.value)}
                />
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <ColorButton selectedColor={color} onSelectColor={setColor} color="Blue" />
                    <ColorButton selectedColor={color} onSelectColor={setColor} color="Red" />
                        </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModifyMatchModal;
