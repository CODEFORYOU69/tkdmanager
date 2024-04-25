import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import Image from 'next/image';

const CompetitionDetails = ({ competition }) => {
    const [fighters, setFighters] = useState([]);
    const [compositeImages, setCompositeImages] = useState({});

    useEffect(() => {
        fetch(`/api/match/fighters?competitionId=${competition.id}`)
            .then(res => res.json())
            .then(data => {
                setFighters(data.map(fighter => ({
                    ...fighter,
                    imageUrl: fighter.image
                })));
            })
            .catch(err => console.error('Failed to load fighters', err));

    }, [competition]);

    return (
        <div>
            <Typography variant="h4" color="primary" gutterBottom>
                Fighters in {competition.name}
            </Typography>
            {fighters.map(fighter => (
                <Card key={fighter.id} sx={{ marginBottom: 2 }}>
                    <CardContent>
                       
                        <div >
    <Image src={competition.image} fill={true}  alt="Background" class="absolute w-full h-full object-fit"/>
    <Image src={fighter.image} fill={true} z-10 alt="Overlay" class="absolute w-full h-full object-cover "/>
                       </div>
                    </CardContent>
                </Card>
            ))}
            <Button variant="contained" color="primary" disabled={fighters.length === 0}>
                Generate Images
            </Button>
        </div>
    );
};

export default CompetitionDetails;

