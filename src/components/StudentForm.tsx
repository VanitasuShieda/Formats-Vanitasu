import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';

export default function StudentForm() {
  const [formData, setFormData] = useState({
    nombreAlumno: '',
    identidadAlumno: '',
    escuela: '',
    director: '',
    sexoDirector: '',
    correo: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating API call to Google Apps Script
    setTimeout(() => {
      console.log('Datos enviados:', formData);
      setLoading(false);
      setSuccess(true);
      setFormData({
        nombreAlumno: '',
        identidadAlumno: '',
        escuela: '',
        director: '',
        sexoDirector: '',
        correo: '',
      });
    }, 1500);
  };

  return (
    <>
      <Card elevation={1}>
        <Box sx={{ 
          p: 4, 
          pb: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(123, 97, 255, 0.1) 0%, transparent 100%)'
        }}>
          <Box sx={{ 
            p: 2, 
            borderRadius: '50%', 
            backgroundColor: 'rgba(123, 97, 255, 0.2)',
            mb: 2,
            display: 'inline-flex'
          }}>
            <SchoolIcon color="primary" sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h4" gutterBottom>
            Constancia de Participación
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth={600}>
            Generador automático de documentos justificativos para el evento de **Tlacuaches Marching Band**. Llena los datos a continuación para recibir el PDF en tu correo.
          </Typography>
        </Box>

        <Divider sx={{ opacity: 0.1 }} />

        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Sección Alumno */}
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <PersonIcon color="secondary" />
                  <Typography variant="h6" color="secondary.main">
                    Datos del Estudiante
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Nombre completo de Alumno(a)"
                      name="nombreAlumno"
                      value={formData.nombreAlumno}
                      onChange={handleChange}
                      required
                      placeholder="Ej. Juan Pérez García"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      fullWidth
                      label="Identidad del alumno"
                      name="identidadAlumno"
                      value={formData.identidadAlumno}
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="Masculino">Masculino</MenuItem>
                      <MenuItem value="Femenino">Femenino</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="email"
                      label="Dirección de correo electrónico"
                      name="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      required
                      placeholder="Correo donde recibirás el documento PDF"
                      helperText="Asegúrate que sea un correo válido y accesible."
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Sección Escuela */}
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={1} mb={2} mt={2}>
                  <WorkIcon color="primary" />
                  <Typography variant="h6" color="primary.main">
                    Datos de la Institución
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nombre de la escuela"
                      name="escuela"
                      value={formData.escuela}
                      onChange={handleChange}
                      required
                      placeholder="Ej. Secundaria General No. 1"
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Nombre completo del director(a)"
                      name="director"
                      value={formData.director}
                      onChange={handleChange}
                      required
                      placeholder="Ej. María López Hernández"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      fullWidth
                      label="Sexo del director"
                      name="sexoDirector"
                      value={formData.sexoDirector}
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="Masculino">Masculino</MenuItem>
                      <MenuItem value="Femenino">Femenino</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  endIcon={<SendIcon />}
                  sx={{ py: 1.5, fontSize: '1.1rem' }}
                >
                  {loading ? 'Generando PDF...' : 'Generar y Enviar Documento'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Datos enviados con éxito. Revisa tu correo electrónico para descargar el PDF.
        </Alert>
      </Snackbar>
    </>
  );
}
