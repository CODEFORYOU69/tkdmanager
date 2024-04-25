import { useState, useEffect, useCallback } from 'react';
import { Button, Grid, Typography, CircularProgress, Modal, Box } from '@mui/material';
import CompetitionDetails from './CompetitionDetails';

const SocialMedia = () => {
    const [competitions, setCompetitions] = useState(null);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);

    const fetchData = useCallback(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            setLoading(false);
            return;
        }

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
            if (!Array.isArray(data)) {
                throw new Error('Data format is incorrect');
            }
            setCompetitions(data);
        })
        .catch(error => {
            console.error('Error fetching competitions:', error.message);
            setError('Failed to load competitions');
        })
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpen = (competition) => {
        setSelectedCompetition(competition);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Grid container spacing={2} mt={2} direction="column" alignItems="center">
            <Box sx={{ border: 1, borderColor: 'grey.300', p: 2, my: 2 }}>
                    <Typography variant="h4" color="primary" sx={{ textAlign: 'center' }}>Social Media Image</Typography>
                </Box> 
            {loading && (
                <CircularProgress />
            )}
            {error && (
                <Typography color="error">{error}</Typography>
            )}
            {competitions && competitions.map(competition => (
                <Grid item xs={12} sm={6} md={8} key={competition.id} sx={{ width: '90%' }}>
                    <Button variant="contained" color="primary" fullWidth onClick={() => handleOpen(competition)}>
                        {competition.name} generate images
                    </Button>
                </Grid>
            ))}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4
                }}>
                    {selectedCompetition && (
                        <CompetitionDetails competition={selectedCompetition} />
                    )}
                </Box>
            </Modal>
        </Grid>
    );
};

export default SocialMedia;
