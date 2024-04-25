import React from 'react';
import { Card, CardContent, Typography, Avatar } from '@mui/material';
import { useAuth } from './AuthProvider'; // Assurez-vous que le chemin d'importation est correct

const ProfileCard = () => {
    const { profile } = useAuth();

    if (!profile) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="body1">Loading profile...</Typography>
                </CardContent>
            </Card>
        );
    }

    // Gérer l'affichage conditionnel lorsque les données du profil ne sont pas encore chargées
   

    return (
        <Card>
            <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={profile.imageUrl} alt="Profile Image" />
                    <Typography variant="h6" style={{ marginLeft: 8 }}>{profile.name}</Typography>
                </div>
                {profile.role === 'club' ? (
                    <div>
                        <Typography variant="subtitle1">Club Profile</Typography>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {profile.clubName && <Typography variant="subtitle1">{profile.clubName}</Typography>}
                        {profile.clubImageUrl && <Avatar src={profile.clubImageUrl} alt="Club Image" sx={{ m: 1, marginLeft: 8 }} />}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ProfileCard;
