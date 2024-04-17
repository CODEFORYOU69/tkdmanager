import React, { useState, useEffect } from 'react';
import { Container, Typography, Select, MenuItem, Button, Tabs, Tab, Box, Paper, Drawer, List, ListItem, ListItemText } from '@mui/material';
import AddRoundModal from './AddRoundModal';

export default function CompetitionDayContent() {
    const [competitions, setCompetitions] = useState([]);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [matches, setMatches] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);  // State to control modal visibility
    const [selectedMatch, setSelectedMatch] = useState(null);  // State to hold the currently selected match
    const [tabValue, setTabValue] = useState(0);
    const [ongoingMatches, setOngoingMatches] = useState({});
    const [completedMatches, setCompletedMatches] = useState([]);
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [roundData, setRoundData] = useState({});

    useEffect(() => {
        fetch('/api/competitions')
            .then(res => res.json())
            .then(setCompetitions)
            .catch(err => console.error('Error fetching competitions:', err));
    }, []);

    useEffect(() => {
        if (selectedCompetition) {
            fetch(`/api/match?competitionId=${selectedCompetition.id}`)
                .then(res => res.json())
                .then(data => {
                    const sortedMatches = data.sort((a, b) => a.fightNumber - b.fightNumber);
                    const ongoing = {};
                    const completed = [];
                    
                    sortedMatches.forEach(match => {
                        const area = Math.floor(match.fightNumber / 100).toString();
                        if (!match.result && !match.isCancelled) {
                            if (!ongoing[area]) ongoing[area] = [];
                            ongoing[area].push(match);
                        }
                        if (match.result && !match.isCancelled) {
                            completed.push(match);
                        }
                    });
    
                    setMatches(sortedMatches);
                    setOngoingMatches(ongoing);
                    setCompletedMatches(completed);
                    setFilteredMatches(Object.values(ongoing).flat());
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
                    return { matchId: match.id, rounds: data };
                })
                .catch(err => {
                    console.error(`Error fetching rounds for match ${match.id}:`, err);
                    return { matchId: match.id, rounds: [] };
                })
            );
    
            Promise.all(fetchRoundsPromises)
                .then(results => {
                    const roundsByMatch = results.reduce((acc, result) => {
                        acc[result.matchId] = result.rounds;
                        return acc;
                    }, {});
                    setRoundData(roundsByMatch);
                })
                .catch(err => console.error('Error fetching all rounds:', err));
        }
    }, [completedMatches]);

    const handleCompetitionChange = (event) => {
        const competition = competitions.find(c => c.id === event.target.value);
        setSelectedCompetition(competition);
    };

    const handleAreaChange = (area) => {
        if (area === 'All') {
            setFilteredMatches(Object.values(ongoingMatches).flat());
        } else {
            setFilteredMatches(ongoingMatches[area] || []);
        }
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
        <Container maxWidth="lg" sx={{ display: 'flex' }}>
            <Drawer
                anchor="left"
                open={isModalOpen}
                onClose={closeModal}
                sx={{ width: 250 }}
            >
                <List>
                    <ListItem button onClick={() => handleAreaChange('All')}>
                        <ListItemText primary="All Areas" />
                    </ListItem>
                    {Object.keys(ongoingMatches).map(area => (
                        <ListItem button key={area} onClick={() => handleAreaChange(area)}>
                            <ListItemText primary={`Aire ${area}`} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Button onClick={() => setIsModalOpen(!isModalOpen)}>Filter by Area</Button>
            <Box flex={1} p={2}>
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

                <Tabs value={tabValue} onChange={(event, newValue) => setTabValue(newValue)}>
                    <Tab label="Ongoing Matches" />
                    <Tab label="Completed Matches" />
                </Tabs>

                {tabValue === 0 && filteredMatches.map(match => (
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
            </Box>
        </Container>
    );
}
