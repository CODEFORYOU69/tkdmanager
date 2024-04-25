"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import Image from 'next/image';

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

const downloadImage = async (backgroundUrl, overlayUrl, filename) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 600;

    const loadImg = src => new Promise((resolve, reject) => {
        const img = new window.Image(); // Use the standard Image constructor from the window object
        img.crossOrigin = 'anonymous'; // Necessary for loading images from external URLs
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

    try {
        const background = await loadImg(backgroundUrl);
        const overlay = await loadImg(overlayUrl);

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link); // Append the link to the body temporarily
        link.click();
        document.body.removeChild(link); // Remove the link after triggering the download
    } catch (err) {
        console.error('Error generating image:', err);
    }
};


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
                            <Image
                                src={fighter.image}
                                layout="fill"
                                objectFit="cover"
                                alt="Fighter"
                                style={{ position: 'absolute', top: 0, left: 0 }}
                            />
                            <Button variant="contained" color="primary" onClick={() => downloadImage(competition.image, fighter.image, `Fighter_${fighter.firstName}_${fighter.lastName}_in_${competition.name}.png`)} disabled={fighters.length === 0}>
    Download Image
</Button>

                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CompetitionDetails;
