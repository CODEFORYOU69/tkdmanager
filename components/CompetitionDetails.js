import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import Image from 'next/image';
import styles from './CompetitionDetails.module.css'; // Importer le fichier CSS

const CompetitionDetails = ({ competition }) => {
    const [fighters, setFighters] = useState([]);

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
                        <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                            <Image
                                src={competition.image}
                                layout="fill"
                                objectFit="cover"
                                alt="Background"
                            />
                            <div className={styles.fighterImage }>
                                 <div className={styles.fighterImage2 }>

                                <Image
                                    src={fighter.image}
                                    layout="fill"
                                    objectFit="cover"
                                    alt="Fighter"
                                    Zindex="1"
                                />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CompetitionDetails;
