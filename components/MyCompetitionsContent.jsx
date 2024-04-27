import React, { useState, useEffect, useCallback } from 'react';
import { Grid, IconButton, Button, Container, Typography, Select, MenuItem, List, ListItem, ListItemText, Paper, Avatar, Box } from '@mui/material';
import AddFightModal from './AddFightModal';
import AddCompetitionModal from './AddCompetitionModal';
import DeleteMatchDialog from './DeleteMatchDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModifyMatchModal from './ModifyMatchModal';


const MyCompetitionsContent = () => {
    const [competitions, setCompetitions] = useState([]);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [fighters, setFighters] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [openCompetitionModal, setOpenCompetitionModal] = useState(false);
    const [match, setMatch] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isModifyOpen, setIsModifyOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [matchId, setMatchId] = useState(null);

    useEffect(() => {
        fetch("/api/competitions", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
            .then((res) => res.json())
            .then(setCompetitions)
            .catch(console.error);
    }, []);

    const loadFighters = useCallback(() => {
        if (selectedCompetition) {
            fetch(
                `/api/match/fightersByCompetition?competitionId=${selectedCompetition.id}`
            )
                .then((res) => res.json())
                .then(setFighters)
                .catch(console.error);
                console.log("fighters", fighters)
        } else {
            setFighters([]);
        }
    }, [fighters, selectedCompetition]);

    const handleOpenCompetitionModal = () => setOpenCompetitionModal(true);
    const handleCloseCompetitionModal = () => setOpenCompetitionModal(false);

    useEffect(() => {
        if (selectedCompetition) {
            fetch(
                `/api/match/fightersByCompetition?competitionId=${selectedCompetition.id}`
            )
                .then((res) => res.json())
                .then(setFighters)

                .catch(console.error);
            console.log("fighters", fighters)

        } else {
            setFighters([]);
        }
        loadFighters();
    }, [fighters, loadFighters, selectedCompetition]);

    const handleSelectCompetition = (event) => {
        const competition = competitions.find((c) => c.id === event.target.value);
        setSelectedCompetition(competition);
    };
    const handleOpenDelete = (match) => {
        setMatchId(match.matchId);
        setSelectedMatch(match);
        setIsDeleteOpen(true);
    };

    const handleOpenModify = (match) => {
        console.log("matchcontent", match);
        setMatchId(match.matchId);
        setSelectedMatch(match);
        setIsModifyOpen(true);
    };
    const handleOpenModal = () => setModalOpen(true);

    const handleCloseModal = (modified = false) => {
        setIsModifyOpen(false);
        setIsDeleteOpen(false);
        if (modified) {
            loadFighters(); // Recharge les combattants après une modification ou suppression
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ border: 1, borderColor: "grey.300", p: 2, my: 2 }}>
                <Typography variant="h4" color="primary" sx={{ textAlign: "center" }}>
                    Organise my fight
                </Typography>
            </Box>
            <Button
                sx={{ marginBottom: 2 }}
                variant="contained"
                color="primary"
                onClick={handleOpenCompetitionModal}
            >
                Add Competition
            </Button>
            <Select
                value={selectedCompetition?.id || ""}
                onChange={handleSelectCompetition}
                fullWidth
            >
                {competitions &&
                    competitions[0] &&
                    competitions.map((competition) => (
                        <MenuItem key={competition.id} value={competition.id}>
                            {competition.name}
                        </MenuItem>
                    ))}
            </Select>
            <Button
                variant="contained"
                color="primary"
                sx={{ border: 1, borderColor: "grey.300", p: 2, my: 2 }}
                onClick={handleOpenModal}
            >
                Add Fighter from List
            </Button>
            {selectedCompetition && (
                <AddFightModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    competitionId={selectedCompetition.id}
                />
            )}
            <List
                sx={{
                    mt: 2,
                    overflow: "auto", // Enable scrolling
                    maxHeight: "calc(100vh - 500px)", // Adjust the height accordingly
                }}
            >
                {fighters.map((fighter) => (
                    <Paper
                        key={fighter.id}
                        elevation={3}
                        sx={{ my: 2, p: 2, borderRadius: 2 }}
                    >
                        <Paper
                            key={fighter.id}
                            elevation={3}
                            sx={{
                                my: 2,
                                p: 2,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Avatar
                                src={fighter.image}
                                alt={fighter.firstName}
                                sx={{ width: 100, height: 100, marginRight: 2 }}
                            />
                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                {fighter.firstName} {fighter.lastName} - {fighter.category}
                            </Typography>
                        </Paper>

                        {fighter.matches.map((match) => (
                            <ListItem
                                key={match.matchId}
                                sx={{
                                    backgroundColor: match.color,
                                    mt: 1,
                                    borderRadius: 2,
                                    color: "white",
                                }}
                            >
                                <ListItemText
                                    primary={`Match #${match.fightNumber} - ${match.color
                                        } - Result: ${match.result || "Pending"}`}
                                />
                                <Grid item>

                                    <IconButton
                                        color="primary.dark"
                                        onClick={() => handleOpenModify(match)}
                                        style={{ border: '2px solid white', marginRight: '10px' }}


                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="primary.dark"
                                        onClick={() => handleOpenDelete(match)}
                                        style={{ border: '2px solid white' }}

                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </ListItem>
                        ))}
                    </Paper>
                ))}
            </List>
            {selectedMatch && (
                <>
                    <ModifyMatchModal
                        match={selectedMatch}
                        competitionId={selectedCompetition.id}
                        matchId={matchId}
                        fighters={fighters}
                        open={isModifyOpen}
                        onClose={() => handleCloseModal(true)}
                    />
                    <DeleteMatchDialog
                        match={selectedMatch}
                        matchId={matchId}
                        open={isDeleteOpen}
                        onClose={handleCloseModal}
                    />
                </>
            )}
            <AddCompetitionModal
                open={openCompetitionModal}
                handleClose={handleCloseCompetitionModal}
            />
        </Container>
    );
};

export default MyCompetitionsContent;
