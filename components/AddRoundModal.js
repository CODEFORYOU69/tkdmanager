// components/AddRoundModal.js
import { Dialog, DialogTitle, DialogContent, TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
import { useState } from 'react';

export default function AddRoundModal({ open, onClose, match }) {
    const [scoreBlue, setScoreBlue] = useState('');
    const [scoreRed, setScoreRed] = useState('');
    const [isWinner, setIsWinner] = useState('');
    const [victoryType, setVictoryType] = useState('');

    const handleSave = async () => {
        const response = await fetch('/api/rounds/addRound', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                scoreBlue,  // Utilisation de l'ID du combattant sélectionné
                scoreRed,
                isWinner,
                matchId: match.id,
                victoryType
            }),
        }
        
    );
    console.log("reponse", response);


        if (response.ok) {
            onClose(true);  // Ferme la modal et rafraîchit éventuellement les données parentes
        } else {
            alert('Failed to add round to fight');
        }
       
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Manage Rounds for {match.fighter.firstName} {match.fighter.lastName}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Score Blue"
                    value={scoreBlue}
                    type="number"
                    onChange={(e) => setScoreBlue(e.target.value)}
                    fullWidth
                    margin='normal'
                />
                <TextField
                    label="Score Red"
                    value={scoreRed}
                    type="number"
                    onChange={(e) => setScoreRed(e.target.value)}
                    fullWidth
                    margin='normal'
                />
                                    <InputLabel id="victory-type-label">Victory Type</InputLabel>

                <Select
                    labelId="victory-type-label"
                    value={victoryType}
                    onChange={(e) => setVictoryType(e.target.value)}
                    fullWidth
                    margin='normal'
                >
                    <MenuItem value="PTG">12 points gap (PTG)</MenuItem>
                    <MenuItem value="GJ">5 warnings (GJ)</MenuItem>
                    <MenuItem value="KO">Knockout (KO)</MenuItem>
                    <MenuItem value="SC">Final score (SC)</MenuItem>
                    <MenuItem value="IN">Injury (IN)</MenuItem>
                    <MenuItem value="NC">no contest (NC)</MenuItem>
                    <MenuItem value="OT">other (OT)</MenuItem>
                </Select>
                <InputLabel id="is-winner-label">Is Winner?</InputLabel>

                <Select
                    labelId="is-winner-label"
                    value={isWinner}                                                                                                                                                                                                                                                                                                                         
                    onChange={(e) => setIsWinner(e.target.value)}
                    fullWidth
                    margin='normal'
                >
                    <MenuItem value="yes">yes</MenuItem>
                    <MenuItem value="no">no</MenuItem>
                    
                </Select>
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={onClose}>Cancel</Button>

            </DialogContent>
        </Dialog>
    );
}
