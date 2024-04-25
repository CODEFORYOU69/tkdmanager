import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Select, MenuItem, List, ListItem, ListItemText, Paper, Avatar } from '@mui/material';
import AddFightModal from './AddFightModal';

const MyCompetitionsContent = () => {
    const [competitions, setCompetitions] = useState([]);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [fighters, setFighters] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetch('/api/competitions', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(setCompetitions)
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedCompetition) {
            fetch(`/api/match/fightersByCompetition?competitionId=${selectedCompetition.id}`)
                .then(res => res.json())
                .then(setFighters)
                .catch(console.error);
        } else {
            setFighters([]);
        }
    }, [selectedCompetition]);

    const handleSelectCompetition = (event) => {
        const competition = competitions.find(c => c.id === event.target.value);
        setSelectedCompetition(competition);
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>Organise my fight</Typography>
            <Select value={selectedCompetition?.id || ''} onChange={handleSelectCompetition} fullWidth>
                {competitions.map(competition => (
                    <MenuItem key={competition.id} value={competition.id}>{competition.name}</MenuItem>
                ))}
            </Select>
            <Button variant="contained" color="primary" onClick={handleOpenModal}>Add Fighter from List</Button>
            {selectedCompetition && (
                <AddFightModal open={modalOpen} onClose={handleCloseModal} competitionId={selectedCompetition.id} />
            )}
            <List sx={{ mt: 2 }}>
                {fighters.map(fighter => (
                    <Paper key={fighter.id} elevation={3} sx={{ my: 2, p: 2, borderRadius: 2 }}>
                        <Paper key={fighter.id} elevation={3} sx={{ my: 2, p: 2, borderRadius: 2, display: 'flex', alignItems: 'center' }}>
                            <Avatar src={fighter.image} alt={fighter.firstName} sx={{ width: 100, height: 100, marginRight: 2 }} />
                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                {fighter.firstName} {fighter.lastName} - {fighter.category}
                            </Typography>
                        </Paper>


                        {fighter.matches.map(match => (
                            <ListItem key={match.id} sx={{ backgroundColor: match.color, mt: 1, borderRadius: 2, color: 'white' }}>
                                <ListItemText primary={`Match #${match.fightNumber} - ${match.color} - Result: ${match.result || 'Pending'}`} />
                            </ListItem>
                        ))}
                    </Paper>
                ))}
            </List>
        </Container>
    );
};

export default MyCompetitionsContent;
