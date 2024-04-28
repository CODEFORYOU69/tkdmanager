import React, { useMemo, Suspense, lazy, useState, useEffect, use } from 'react';
import { Container, Typography, Select, MenuItem, Button, Tabs, Tab, Box, Paper, Drawer, List, ListItem, ListItemText, TextField, Avatar } from '@mui/material';
import { useQuery } from 'react-query';



const AddRoundModal = lazy(() => import('./AddRoundModal'));



export default function CompetitionDayContent({ competitions }) {
    const [comp, setCompetitions] = useState(competitions);
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





    // ...

    const { data: fetchedMatches, refetch: refetchMatches } = useQuery(
        ['matches', selectedCompetition?.id],
        async () => {
            const res = await fetch(`/api/match?competitionId=${selectedCompetition?.id}`);
            return res.json();
        },
        {
            enabled: !!selectedCompetition?.id,
            onSuccess: (data) => {
                const sortedMatches = data.sort((a, b) => a.fightNumber - b.fightNumber);
                const ongoing = {};
                const completed = [];

                sortedMatches.forEach(match => {
                    const area = Math.floor(match.fightNumber / 100).toString();

                    if (match.result === null && !match.isCancelled) {
                        if (!ongoing[area]) ongoing[area] = [];
                        ongoing[area].push(match);
                    }
                    // Ajoutez des matches aux matches complétés si le résultat n'est pas nul et n'est pas annulé
                    if (match.result !== null && !match.isCancelled) {
                        completed.push(match);
                        // Mettre à jour le dernier combat terminé pour chaque aire
                        currentFightNumber[area] = match.fightNumber + 1;
                    }

                    if (!currentFightNumber[area]) {
                        currentFightNumber[area] = parseInt(area) * 100 + 1;
                    }
                });

                // Fusionner et trier tous les combats en cours
                const allOngoingMatches = Object.values(ongoing).flat();
                const customSortedMatches = customSortMatches(allOngoingMatches);
                setFilteredMatches(customSortedMatches);

                setMatches(sortedMatches);
                setOngoingMatches(ongoing);
                setCompletedMatches(completed);

                // Mettre à jour remainingFightsByArea et duplicateFights en fonction de fetchedMatches
                const newRemainingFights = {};
                Object.keys(ongoing).forEach(area => {
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
            },
        }
    );

    // ...
    // competitionDayContent.js

    const customSortMatches = useMemo(() => {
        return (matches) => {
            return matches.sort((a, b) => {
                const lastTwoDigitsA = a.fightNumber % 100;
                const lastTwoDigitsB = b.fightNumber % 100;
                if (lastTwoDigitsA !== lastTwoDigitsB) {
                    return lastTwoDigitsA - lastTwoDigitsB;
                }
                return Math.floor(a.fightNumber / 100) - Math.floor(b.fightNumber / 100);
            });
        };
    }, []);



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
    }, [completedMatches, selectedCompetition]);
    // fetch all rounds for each match in ongoingMatches
    useEffect(() => {
        const ongoingMatchIds = Object.values(ongoingMatches).flat().map(match => match.id);
        if (ongoingMatchIds.length > 0) {
            const fetchRoundsPromises = ongoingMatchIds.map(matchId =>
                fetch(`/api/rounds/getRound?matchId=${matchId}`)
                    .then(res => res.json())
                    .then(data => {
                        // Vérifier si le tableau est vide
                        if (data.length === 0) {
                            return { matchId, rounds: [] };
                        }
                        return { matchId, rounds: data };
                    })
                    .catch(err => {
                        console.error(`Error fetching rounds for match ${matchId}:`, err);
                        return { matchId, rounds: [] };
                    })
            );

            Promise.all(fetchRoundsPromises)
                .then(results => {
                    if (results.every(result => result.rounds.length === 0)) {
                        // Ignorer si tous les tableaux sont vides
                        return;
                    }
                    const newRoundSavedData = {};
                    results.forEach(result => {
                        newRoundSavedData[result.matchId] = result.rounds;
                    });
                    setRoundSavedData(newRoundSavedData);
                })
                .catch(err => console.error('Error fetching all rounds:', err));
        }
    }, [ongoingMatches]);
    // Cette dépendance devrait être suffisante pour rafraîchir les données lors des changements

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

            <Box flex={1} p={2} >
                <Box sx={{ border: 1, borderColor: 'grey.300', p: 2, my: 2 }}>
                    <Typography variant="h4" color="primary" sx={{ textAlign: 'center' }}>Competition Day Viewer</Typography>
                </Box>
                <Select
                    value={selectedCompetition?.id || ''}
                    onChange={handleCompetitionChange}
                    fullWidth
                    displayEmpty
                    renderValue={selected => selected ? selectedCompetition.name : 'Select a competition'}
                    sx={{ marginBottom: 2 }}
                >
                    {comp && comp.map(competition => (
                        <MenuItem key={competition.id} value={competition.id} sx={{ maxHeight: '60vh', overflowY: 'auto' }}
                        >
                            {competition.name}
                        </MenuItem>
                    ))}
                </Select>
                <Button onClick={() => setIsModalOpen(!isModalOpen)}>Filter by Area</Button>
                <Tabs value={tabValue} onChange={(event, newValue) => setTabValue(newValue)}>
                    <Tab label="Ongoing Matches" />
                    <Tab label="Completed Matches" />
                </Tabs>
                <Box sx={{ maxHeight: '60vh', overflowY: 'auto', pb: 7 }}>

                    {tabValue === 0 && filteredMatches.map(match => (
                        <Paper key={match.id} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            backgroundColor: match.color,
                            padding: 2,
                            marginBottom: 1,
                            color: 'white',
                            borderRadius: 2 // Ajoute un léger arrondi aux bords du Paper
                        }}>
                            <Typography variant="h6" sx={{ fontSize: '1.5rem' }}>
                                Fight #{match.fightNumber}
                            </Typography>
                            <Avatar src={match.fighter.image} sx={{ width: 100, height: 100, marginRight: 1, backgroundColor: 'white' }} />
                            <Box sx={{ flexGrow: 1, textAlign: 'left' }}> {/* Box contenant le texte pour le contrôle du layout */}
                                <Typography variant="h6" sx={{ fontSize: '1.5rem' }}>
                                    {match.fighter.firstName} {match.fighter.lastName}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Rounds Recorded: {roundSavedData[match.id] ? roundSavedData[match.id].length : 0}
                                </Typography>
                            </Box>
                            <Button variant="outlined" sx={{ width: '100%', color: 'white', borderColor: 'white' }} onClick={() => openModal(match)}>
                                Manage Rounds
                            </Button>
                        </Paper>

                    ))}

                    {tabValue === 1 && completedMatches.map(match => (
                        <Paper key={match.id} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: match.color,
                            padding: 2,
                            marginBottom: 1,
                            color: 'white',
                            borderRadius: 2
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar src={match.fighter.image} sx={{ width: 100, height: 100, marginRight: 2, backgroundColor: 'white' }} />
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Fight #{match.fightNumber} - {match.fighter.firstName} {match.fighter.lastName}
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Result: {match.result || 'Pending'}
                                    </Typography>
                                </Box>
                            </Box>
                            {Array.isArray(roundData[match.id]) ? roundData[match.id].map(round => (
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
                            )) : (
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

                            )}
                        </Paper>

                    ))}
                    <Suspense fallback={<div>Loading...</div>}>

                        {selectedMatch && (
                            <AddRoundModal
                                open={isModalOpen}
                                onClose={closeModal}
                                match={selectedMatch}
                            />
                        )}
                    </Suspense>

                </Box>
            </Box>

        </Container>
    );
}
