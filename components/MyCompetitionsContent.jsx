import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Select, MenuItem } from '@mui/material';
import AddFightModal from './AddFightModal';

const MyCompetitionsContent = () => {
    const [competitions, setCompetitions] = useState([]);
    const [selectedCompetition, setSelectedCompetition] = useState(null); // Modifié pour gérer l'objet entier
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetch('/api/competitions')
            .then(response => response.json())
            .then(setCompetitions)
            .catch(error => console.error('Error fetching competitions:', error));
    }, []);
    console.log("competitions", competitions);

    const handleSelectCompetition = (event) => {
        const competitionId = event.target.value;
        const competition = competitions.find(c => c.id === competitionId);
        setSelectedCompetition(competition);
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>Organise my fight</Typography>
            <Select
                value={selectedCompetition?.id || ''}
                onChange={handleSelectCompetition}
                fullWidth
            >
                {competitions.map((competition) => (
                    <MenuItem key={competition.id} value={competition.id}>
                        {competition.name}
                    </MenuItem>
                ))}
            </Select>
            <Button variant="contained" color="primary" onClick={handleOpenModal}>
                Add Fighter from List
            </Button>
            {selectedCompetition && (
                <AddFightModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    competitionId={selectedCompetition.id}
                />
            )}
        </Container>
    );
};

export default MyCompetitionsContent;
