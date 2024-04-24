import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
import { useNotification } from './NotificationService';

export default function AddRoundModal({ open, onClose, match }) {
  const [rounds, setRounds] = useState([]);

  const { notify } = useNotification();

  const handleAddRound = () => {
    setRounds([...rounds, { scoreBlue: '', scoreRed: '', isWinner: '', victoryType: '' }]);
  };

  const handleRemoveRound = (index) => {
    const updatedRounds = [...rounds];
    updatedRounds.splice(index, 1);
    setRounds(updatedRounds);
  };

  const handleSave = async () => {
    for (const round of rounds) {
      const response = await fetch('/api/rounds/addRound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...round,
          matchId: match.id,
        }),
        
      });

      if (!response.ok) {
        // Handle error for individual round creation
        notify?.('Error creating round', { variant: 'error' });
      } else {
        notify?.('Round added successfully', { variant:'success' });
      }
    }
    onClose(); // Close the modal after potential errors are handled
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Manage Rounds for {match.fighter.firstName} {match.fighter.lastName}</DialogTitle>
      <DialogContent>
        {rounds.map((round, index) => (
          <div key={index}>
            <TextField
              label={`Score Blue (Round ${index + 1})`}
              value={round.scoreBlue}
              type="number"
              onChange={(e) => setRounds((prevRounds) =>
                prevRounds.map((r, i) => (i === index ? { ...r, scoreBlue: e.target.value } : r))
              )}
              fullWidth
              margin="normal"
            />
            <TextField
              label={`Score Red (Round ${index + 1})`}
              value={round.scoreRed}
              type="number"
              onChange={(e) => setRounds((prevRounds) =>
                prevRounds.map((r, i) => (i === index ? { ...r, scoreRed: e.target.value } : r))
              )}
              fullWidth
              margin="normal"
            />

            <InputLabel id={`victory-type-label-${index}`}>Victory Type (Round {index + 1})</InputLabel>
            <Select
              labelId={`victory-type-label-${index}`}
              value={round.victoryType}
              onChange={(e) => setRounds((prevRounds) =>
                prevRounds.map((r, i) => (i === index ? { ...r, victoryType: e.target.value } : r))
              )}
              fullWidth
              margin="normal"
            >
              <MenuItem value="PTG">12 points gap (PTG)</MenuItem>
              <MenuItem value="GJ">5 warnings (GJ)</MenuItem>
              <MenuItem value="KO">Knockout (KO)</MenuItem>
              <MenuItem value="SC">Final score (SC)</MenuItem>
              <MenuItem value="IN">Injury (IN)</MenuItem>
              <MenuItem value="NC">no contest (NC)</MenuItem>
              <MenuItem value="OT">other (OT)</MenuItem>
            </Select>

            <InputLabel id={`is-winner-label-${index}`}>Is Winner? (Round {index + 1})</InputLabel>
            <Select
              labelId={`is-winner-label-${index}`}
              value={round.isWinner}
              onChange={(e) => setRounds((prevRounds) =>
                prevRounds.map((r, i) => (i === index ? { ...r, isWinner: e.target.value } : r))
              )}
              fullWidth
              margin="normal"
            >
              <MenuItem value="yes">yes</MenuItem>
              <MenuItem value="no">no</MenuItem>
            </Select>
            <Button onClick={() => handleRemoveRound(index)}>Remove Round</Button>
          </div>
        ))}
        <Button onClick={handleAddRound}>Add Round</Button>
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogContent>
    </Dialog>

    );
}
