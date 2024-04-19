import React, { useState, useEffect, use } from 'react';
import { Container, Typography, Select, MenuItem, Button, Tabs, Tab, Box, Paper, Drawer, List, ListItem, ListItemText, TextField } from '@mui/material';
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
    const [currentFightNumber, setCurrentFightNumber] = useState({});
    const [remainingFightsByArea, setRemainingFightsByArea] = useState({});
    const [duplicateFights, setDuplicateFights] = useState(new Set());
    const [roundSavedData, setRoundSavedData] = useState([]);


useEffect(() => {
    const newRemainingFights = {};
    Object.keys(ongoingMatches).forEach(area => {
        newRemainingFights[area] = calculateRemainingFights(area);
    });
    setRemainingFightsByArea(newRemainingFights);

    // Détecter les doublons
    const counts = {};
    Object.values(newRemainingFights).forEach(fight => {
        counts[fight] = (counts[fight] || 0) + 1;
    });
    const newDuplicates = new Set();
    Object.entries(counts).forEach(([fight, count]) => {
        if (count > 1) newDuplicates.add(parseInt(fight));
    });
    setDuplicateFights(newDuplicates);

}, [ongoingMatches, currentFightNumber]);





useEffect(() => {
    const fetchData = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        // Assurez-vous que l'endpoint '/api/competitions' est correct et configuré pour utiliser l'authentification.
        fetch('/api/competitions', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setCompetitions(data);
        })
        .catch(error => {
            console.error('Error fetching competitions:', error.message);
        });
    };

    fetchData();
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
                            // Mettre à jour le dernier combat terminé pour chaque aire
                            currentFightNumber[area] = match.fightNumber + 1;
                        }
    
                        // Définir les valeurs par défaut si aucun combat n'est complété dans une aire
                        if (!currentFightNumber[area]) {
                            currentFightNumber[area] = parseInt(area) * 100 + 1;
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
                    console.log("roundData", roundsByMatch)

                    setRoundData(roundsByMatch);
                })
                .catch(err => console.error('Error fetching all rounds:', err));
        }
    }, [completedMatches]);
    // fetch all rounds for each match in ongoingMatches
    useEffect(() => {
        const ongoingMatchIds = Object.values(ongoingMatches).flat().map(match => match.id);
        if (ongoingMatchIds.length > 0) {
            const fetchRoundsPromises = ongoingMatchIds.map(matchId =>
                fetch(`/api/rounds/getRound?matchId=${matchId}`)
                .then(res => res.json())
                .then(data => ({ matchId, rounds: data }))
                .catch(err => {
                    console.error(`Error fetching rounds for match ${matchId}:`, err);
                    return { matchId, rounds: [] };
                })
            );
    
            Promise.all(fetchRoundsPromises)
            .then(results => {
                const newRoundSavedData = {};
                results.forEach(result => {
                    newRoundSavedData[result.matchId] = result.rounds;
                });
                console.log("newRoundSavedData", newRoundSavedData);
                setRoundSavedData(newRoundSavedData);
            })
            .catch(err => console.error('Error fetching all rounds:', err));
        }
    }, [ongoingMatches]);  // Cette dépendance devrait être suffisante pour rafraîchir les données lors des changements
    

    // setRoundSavedData(roundData); to display the number of round saved for each match in ongoing match

    


    const handleCurrentFightChange = (area, value) => {
        setCurrentFightNumber(prev => ({ ...prev, [area]: value }));
    };

    const calculateRemainingFights = (area) => {
        if (!currentFightNumber[area] || !ongoingMatches[area]) return 0; // Renvoie 0 si aucun combat actuel n'est défini ou si aucun combat n'est en cours pour l'aire
    
        // Trouver le prochain numéro de combat après le combat actuel
        const nextFightIndex = ongoingMatches[area].findIndex(match => match.fightNumber > currentFightNumber[area]);
    
        if (nextFightIndex === -1) return 0; // Renvoie 0 si aucun combat futur n'est trouvé
    
        // Calcul du nombre de combats entre le combat actuel et le prochain combat enregistré
        const nextFightNumber = ongoingMatches[area][nextFightIndex].fightNumber;
        return nextFightNumber - currentFightNumber[area];
    };

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
                            <Box key={area}>
                    <TextField
                        label={`Current fight in Area ${area}`}
                        type="number"
                        value={currentFightNumber[area] || ''}
                        onChange={(e) => handleCurrentFightChange(area, parseInt(e.target.value))}
                        sx={{ margin: 1 }}
                    />
                   <Typography sx={{ color: duplicateFights.has(remainingFightsByArea[area]) ? 'red' : 'inherit' }}>
            Remaining Fights in Area {area}: {remainingFightsByArea[area]} fights
        </Typography>
                </Box>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            
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
                <Button onClick={() => setIsModalOpen(!isModalOpen)}>Filter by Area</Button>
                <Tabs value={tabValue} onChange={(event, newValue) => setTabValue(newValue)}>
                    <Tab label="Ongoing Matches" />
                    <Tab label="Completed Matches" />
                </Tabs>

                {tabValue === 0 && filteredMatches.map(match => (
                    <Paper key={match.id} sx={{ backgroundColor: match.color, padding: 2, marginBottom: 1, color: 'white' }}>
                        <Typography variant="body1">
                            Fight #{match.fightNumber} - {match.fighter.firstName} {match.fighter.lastName} 
                        </Typography>
                        <Typography variant="body1" gutterBottom>
            Rounds Recorded: {roundSavedData[match.id] ? roundSavedData[match.id].length : 0}
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
                        {Array.isArray(roundData[match.id]) ? 
    roundData[match.id].map(round => (
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
    )) :
    <Box sx={{ paddingLeft: 2, paddingTop: 1 }}>
        <Typography variant="body2">
            Round Score: Blue {roundData[match.id]?.scoreBlue} - Red {roundData[match.id]?.scoreRed}
        </Typography>
        <Typography variant="body2">
            Victory Type: {roundData[match.id]?.victoryType || 'N/A'}
        </Typography>
        <Typography variant="body2">
            Result: {roundData[match.id]?.isWinner ? 'Winner' : 'Loser'}
        </Typography>
    </Box>
}
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
