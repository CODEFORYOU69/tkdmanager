import React, { useState, useEffect } from 'react';
import { Container, Typography, Select, MenuItem, Button, Tabs, Tab, Box, Paper } from '@mui/material';
import AddRoundModal from '../components/AddRoundModal';

export default function CompetitionDay() {
    const [competitions, setCompetitions] = useState([]);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [matches, setMatches] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);  // State to control modal visibility
    const [selectedMatch, setSelectedMatch] = useState(null);  // State to hold the currently selected match
    const [tabValue, setTabValue] = useState(0);
    const [completedMatches, setCompletedMatches] = useState([]);
    const [ongoingMatches, setOngoingMatches] = useState([]);
    const [roundData, setRoundData] = useState([]);

    useEffect(() => {
    if (matches) {
        setCompletedMatches(matches.filter(match => match.result === 'WINNER' && match.isCancelled === false || match.result === 'LOSER' && match.isCancelled === false));
        setOngoingMatches(matches.filter(match => !match.result && match.isCancelled === false));
    }
}, [matches]);

console.log("completedMatches", completedMatches);
    const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
};


    useEffect(() => {
        // Fetch competitions from API
        fetch('/api/competitions')
            .then(res => res.json())
            .then(data => setCompetitions(data))
            .catch(err => console.error('Error fetching competitions:', err));
    }, []);

    useEffect(() => {
        if (selectedCompetition) {
            // Fetch matches for the selected competition
            fetch(`/api/match?competitionId=${selectedCompetition.id}`)
                .then(res => res.json())
                .then(data => {
                    const sortedMatches = data.sort((a, b) => a.fightNumber - b.fightNumber);
                    setMatches(sortedMatches);
                })
                .catch(err => console.error('Error fetching matches:', err));
        }
    }, [selectedCompetition]);

    useEffect(() => {
        if (completedMatches.length > 0) {
            const fetchRoundsPromises = completedMatches.map(match =>
                fetch(`/api/rounds/getRound?matchId=${match.id}`)
                .then(res => res.json())
                .then(data => {
                    return { matchId: match.id, rounds: data }; // Return rounds with associated matchId
                })
                .catch(err => {
                    console.error(`Error fetching rounds for match ${match.id}:`, err);
                    return { matchId: match.id, rounds: [] }; // Return empty rounds on error
                })
            );
    
            Promise.all(fetchRoundsPromises)
                .then(results => {
                    // Transform results into an object keyed by matchId
                    const roundsByMatch = results.reduce((acc, result) => {
                        acc[result.matchId] = result.rounds;
                        return acc;
                    }, {});
                    setRoundData(roundsByMatch); // Store the rounds data by match ID
                })
                .catch(err => console.error('Error fetching all rounds:', err));
        }
    }, [completedMatches]); // Dependency on completedMatches
    
    

    const handleCompetitionChange = (event) => {
        const competition = competitions.find(c => c.id === event.target.value);
        setSelectedCompetition(competition);
    };

    const openModal = (match) => {
        setSelectedMatch(match);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMatch(null);
    };

    return (
        <Container maxWidth="md">
        <Typography variant="h4" sx={{ marginBottom: 2 }}>Competition Day Viewer</Typography>
        <Select
            value={selectedCompetition?.id || ''}
            onChange={handleCompetitionChange}
            fullWidth
            displayEmpty
            renderValue={selected => selected ? selectedCompetition.name : 'Select a competition'}
            sx={{ marginBottom: 2 }}
        >
            {competitions.map(competition => (
                <MenuItem key={competition.id} value={competition.id}>
                    {competition.name}
                </MenuItem>
            ))}
        </Select>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
            <Tabs value={tabValue} onChange={(event, newValue) => setTabValue(newValue)}>
                <Tab label="Ongoing Matches" />
                <Tab label="Completed Matches" />
            </Tabs>
        </Box>

        {tabValue === 0 && ongoingMatches.map(match => (
            <Paper key={match.id} sx={{ backgroundColor: match.color, padding: 2, marginBottom: 1, color: 'white' }}>
                <Typography variant="body1">
                    Fight #{match.fightNumber} - {match.fighter.firstName} {match.fighter.lastName}
                </Typography>
                <Button onClick={() => openModal(match)}>Manage Rounds</Button>
            </Paper>
        ))}

        {tabValue === 1 && completedMatches.map(match => (
            <Paper key={match.id} sx={{ backgroundColor: match.color, padding: 2, marginBottom: 1, color: 'white' }}>
                <Typography variant="h6" gutterBottom>
                    Fight #{match.fightNumber} - {match.fighter.firstName} {match.fighter.lastName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Result: {match.result}
                </Typography>
                {roundData[match.id]?.map(round => (
                    <Box key={round.id} sx={{ paddingLeft: 2, paddingTop: 1 }}>
                        <Typography variant="body2">
                            Round Score: Blue {round.scoreBlue} - Red {round.scoreRed}
                        </Typography>
                        <Typography variant="body2">
                            Victory Type: {round.victoryType || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                            Result: {round.isWinner ? 'Winner' : 'Loser'}
                        </Typography>
                    </Box>
                ))}
            </Paper>
        ))}

        {selectedMatch && (
            <AddRoundModal
                open={isModalOpen}
                onClose={closeModal}
                match={selectedMatch}
                
            />
        )}
    </Container>
    );
    
}
