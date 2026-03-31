import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
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
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyGPgPAYzGDriPqGXbwn6MfcPQNog9XqPmcMzhvldZDDDW4GAkqaMBE4aYz-4k7At4y/exec";

export default function StudentForm() {
  const [formData, setFormData] = useState({
    nombreAlumno: "",
    identidadAlumno: "",
    escuela: "",
    director: "",
    sexoDirector: "",
    correo: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Iniciando solicitud...");

  const funnyMessages = [
    "Despertando al director para que firme...",
    "Buscando tinta para la pluma digital...",
    "Verificando que no seas un robot con mochila...",
    "Validando tu existencia en el sistema escolar...",
    "Contactando al encargado de los sellos raros...",
    "Convenciendo a la secretaria de que lo autorice...",
    "Afilando los pixeles de tu constancia...",
    "Buscando tu expediente en el archivero infinito...",
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      let index = 0;
      interval = setInterval(() => {
        setLoadingMessage(funnyMessages[index]);
        index = (index + 1) % funnyMessages.length;
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const [eventInfo, setEventInfo] = useState<any>({
    EVENTO: "Tlacuaches Marching Band",
    FECHA_EVENTO: "Próximamente",
    LUGAR: "Por definir",
    ORGANIZADOR: "Secundaria del Deporte",
  });
  const [loadingInfo, setLoadingInfo] = useState(true);

  useEffect(() => {
    // Función para manejar JSONP y evitar errores de CORS en el GET
    const fetchEventDataJSONP = () => {
      const callbackName =
        "jsonp_callback_" + Math.round(100000 * Math.random());

      // Creamos la función global que llamará Google Apps Script
      (window as any)[callbackName] = (data: any) => {
        if (data.status === "success" && data.data) {
          setEventInfo(data.data);
          setLoadingInfo(false);
        }
        // Limpieza de la función del objeto window
        delete (window as any)[callbackName];
      };

      // Inyectamos el script en el HTML
      const script = document.createElement("script");
      script.src = `${GOOGLE_SCRIPT_URL}${GOOGLE_SCRIPT_URL.includes("?") ? "&" : "?"}callback=${callbackName}`;

      script.onerror = () => {
        console.warn("JSONP error: Usando información de respaldo.");
        setLoadingInfo(false);
        delete (window as any)[callbackName];
      };

      document.body.appendChild(script);

      // Limpieza del tag script después de la ejecución
      setTimeout(() => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }, 5000);
    };

    fetchEventDataJSONP();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setSuccess(false);
    setGeneratedPdfUrl(null);
    setLoading(false);
    setFormData({
      nombreAlumno: "",
      identidadAlumno: "",
      escuela: "",
      director: "",
      sexoDirector: "",
      correo: "",
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedPdfUrl(null);
    setLoadingMessage("Iniciando solicitud...");

    // Mapeo exacto de los campos requeridos en el Apps Script para la URL
    const params = new URLSearchParams({
      action: "submit",
      nombreAlumno: formData.nombreAlumno,
      identidadAlumno: formData.identidadAlumno,
      escuela: formData.escuela,
      director: formData.director,
      sexoDirector: formData.sexoDirector,
      correo: formData.correo || "", // Opcional
    });

    const callbackName = "submit_callback_" + Math.round(100000 * Math.random());

    // Manejador del resultado del envío vía JSONP
    (window as any)[callbackName] = (data: any) => {
      if (data.status === "success") {
        setGeneratedPdfUrl(data.pdfUrl);
        setSuccess(true);
        setLoading(false);
      } else {
        alert("Error de Google Script: " + (data.message || "Desconocido"));
        setLoading(false);
      }
      delete (window as any)[callbackName];
    };

    // Crear e inyectar el script para el envío
    const script = document.createElement("script");
    script.src = `${GOOGLE_SCRIPT_URL}${GOOGLE_SCRIPT_URL.includes("?") ? "&" : "?"}${params.toString()}&callback=${callbackName}`;

    script.onerror = () => {
      setLoading(false);
      alert("Error de red al intentar generar el PDF.");
      delete (window as any)[callbackName];
    };

    document.body.appendChild(script);

    // Limpieza
    setTimeout(() => {
      if (script.parentNode) script.parentNode.removeChild(script);
    }, 12000);
  };

  return (
    <>
      <Card elevation={1}>
        {success ? (
          /* VISTA DE ÉXITO */
          <Box
            sx={{
              p: { xs: 4, md: 8 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              minHeight: 400,
              justifyContent: "center",
            }}
          >
            <CheckCircleIcon 
              sx={{ 
                fontSize: 80, 
                color: "success.main",
                filter: "drop-shadow(0 0 20px rgba(46, 125, 50, 0.4))",
                mb: 3 
              }} 
            />
            <Typography variant="h3" fontWeight={700} gutterBottom>
              ¡PDF Generado!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: 450 }}>
              La constancia para <b>{formData.nombreAlumno}</b> ha sido creada con éxito. 
              {formData.correo && " También se ha enviado una copia a tu correo electrónico."}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, width: "100%", justifyContent: "center" }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<DownloadIcon />}
                href={generatedPdfUrl || "#"}
                target="_blank"
                sx={{ 
                  py: 2, 
                  px: 4, 
                  fontSize: "1.1rem",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0, 242, 254, 0.3)"
                }}
              >
                Descargar Constancia
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
                sx={{ py: 2, px: 4, borderRadius: 3 }}
              >
                Generar otro
              </Button>
            </Box>
          </Box>
        ) : loading ? (
          /* VISTA DE CARGA (HUMORÍSTICA) */
          <Box
            sx={{
              p: { xs: 4, md: 8 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              minHeight: 400,
              justifyContent: "center",
            }}
          >
            <CircularProgress 
              size={70} 
              thickness={2}
              sx={{ 
                mb: 4,
                color: "primary.main",
                filter: "drop-shadow(0 0 15px rgba(0, 242, 254, 0.5))"
              }} 
            />
            <Typography 
              variant="h5" 
              color="text.primary" 
              fontWeight={600} 
              sx={{ 
                mb: 1,
                // Animación simple de desvanecimiento para el cambio de mensajes
                transition: "all 0.3s ease",
                minHeight: "1.2em"
              }}
            >
              {loadingMessage}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Estamos procesando tu documentación oficial. Por favor no cierres la ventana.
            </Typography>
          </Box>
        ) : (
          /* VISTA DE FORMULARIO */
          <>
            <Box
              sx={{
                p: 4,
                pb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                textAlign: "center",
                background:
                  "linear-gradient(180deg, rgba(123, 97, 255, 0.1) 0%, transparent 100%)",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: "50%",
                  backgroundColor: "rgba(123, 97, 255, 0.2)",
                  mb: 2,
                  display: "inline-flex",
                }}
              >
                <SchoolIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" gutterBottom>
                {loadingInfo
                  ? "Cargando Evento..."
                  : eventInfo?.EVENTO || "Constancia de Participación"}
              </Typography>

              <Box
                sx={{
                  mt: 3,
                  mb: 1,
                  textAlign: "left",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid rgba(255,255,255,0.05)",
                  width: "100%",
                  maxWidth: 600,
                }}
              >
                {loadingInfo ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={2}
                  >
                    <CircularProgress size={32} />
                    <Typography variant="body1">
                      Buscando detalles del evento...
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      📢 <b>Evento:</b> {eventInfo?.EVENTO}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      📅 <b>Fecha:</b> {eventInfo?.FECHA_EVENTO}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      📍 <b>Lugar:</b> {eventInfo?.LUGAR}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      🏢 <b>Organiza:</b> {eventInfo?.ORGANIZADOR}
                    </Typography>

                    <Divider sx={{ my: 2, opacity: 0.2 }} />

                    <Typography
                      variant="body2"
                      color="secondary.main"
                      sx={{ fontStyle: "italic", textAlign: "center" }}
                    >
                      Por favor llena correctamente la información a continuación.
                    </Typography>
                  </>
                )}
              </Box>
            </Box>

            <Divider sx={{ opacity: 0.1 }} />

            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                  {/* Sección Alumno */}
                  <Grid size={{ xs: 12 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <PersonIcon color="secondary" />
                      <Typography variant="h6" color="secondary.main">
                        Datos del Estudiante
                      </Typography>
                    </Box>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 8 }}>
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
                      <Grid size={{ xs: 12, md: 4 }}>
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
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          type="email"
                          label="Dirección de correo electrónico"
                          name="correo"
                          value={formData.correo}
                          onChange={handleChange}
                          placeholder="Opcional: Correo donde recibirás el documento"
                          helperText="Si no tienes correo o no te llega, podrás descargarlo aquí al finalizar."
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Sección Escuela */}
                  <Grid size={{ xs: 12 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2} mt={2}>
                      <WorkIcon color="primary" />
                      <Typography variant="h6" color="primary.main">
                        Datos de la Institución
                      </Typography>
                    </Box>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
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
                      <Grid size={{ xs: 12, md: 8 }}>
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
                      <Grid size={{ xs: 12, md: 4 }}>
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

                  <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      endIcon={<SendIcon />}
                      sx={{ py: 1.5, fontSize: "1.1rem" }}
                    >
                      {loading ? "Generando PDF..." : "Generar y Enviar Documento"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </>
        )}
      </Card>

      <Snackbar
        open={success}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%", alignItems: "center" }}
        >
          ¡Documento listo para descargar!
        </Alert>
      </Snackbar>
    </>
  );
}
