import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Box, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: 'linear-gradient(to bottom, #FFEE93, #FFFFFF)'
    }
  }
});

const VTCForm = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresseFacturation: '',
    descriptionVehicule: '',
    anneeVehicule: '',
    numeroImmatriculation: '',
    numeroSiren: '',
    conditions: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.palette.background.default }}>
        <Container maxWidth="sm" sx={{ backgroundColor: '#fff', p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" align="center">VTC Registration Form</Typography>

            <TextField
              label="Nom"
              variant="outlined"
              required
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              fullWidth
              sx={{ boxShadow: 3, p: 1 }}
            />

            <TextField
              label="Prénom"
              variant="outlined"
              required
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              fullWidth
              sx={{ boxShadow: 3, p: 1 }}
            />

            <TextField
              label="Adresse e-mail"
              variant="outlined"
              required
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              sx={{ boxShadow: 3, p: 1 }}
            />

            <TextField
              label="Numéro de téléphone"
              variant="outlined"
              required
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              fullWidth
              sx={{ boxShadow: 3, p: 1 }}
            />

            <TextField
              label="Adresse de facturation"
              variant="outlined"
              required
              name="adresseFacturation"
              value={formData.adresseFacturation}
              onChange={handleChange}
              fullWidth
              sx={{ boxShadow: 3, p: 1 }}
            />

            <TextField
              label="Description du véhicule"
              variant="outlined"
              required
              name="descriptionVehicule"
              value={formData.descriptionVehicule}
              onChange={handleChange}
              fullWidth
              sx={{ boxShadow: 3, p: 1 }}
            />

            <TextField
              label="Année du véhicule"
              variant="outlined"
              required
              name="anneeVehicule"
              type="number"
              value={formData.anneeVehicule}
              onChange={handleChange}
              fullWidth
              sx={{ boxShadow: 3, p: 1 }}
            />

            <TextField
              label="Numéro d'immatriculation"
              variant="outlined"
              required
              name="numeroImmatriculation"
              value={formData.numeroImmatriculation}
              onChange={handleChange}
              fullWidth
              sx={{ boxShadow: 3, p: 1 }}
            />

            <TextField
              label="Numéro de Siren"
              variant="outlined"
              required
              name="numeroSiren"
              value={formData.numeroSiren}
              onChange={handleChange}
              fullWidth
              sx={{ boxShadow: 3, p: 1 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="conditions"
                  checked={formData.conditions}
                  onChange={handleChange}
                />
              }
              label={<Typography>Jaccepte les <a href="/static/media/CGU_JOE.fbc28274f27e734cae5f.pdf" download="CGU_JOE" target="_blank" rel="noreferrer">conditions générales</a></Typography>}
            />

            <Button type="submit" variant="contained">VALIDER ET PAYER</Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default VTCForm;
