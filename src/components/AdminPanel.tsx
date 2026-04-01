import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import LogoutIcon from "@mui/icons-material/Logout";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { apiService } from "../services/apiService";

// Utility to format ISO dates to Spanish
const formatDateSpanish = (dateStr: string) => {
  if (!dateStr || dateStr === "Próximamente") return dateStr;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date);
};

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [eventData, setEventData] = useState({
    evento: "",
    fecha: "",
    lugar: "",
    organizador: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [templateText, setTemplateText] = useState("");
  const [loadingTemplate, setLoadingTemplate] = useState(true);

  const [testStudentGender, setTestStudentGender] = useState("M");
  const [testDirectorGender, setTestDirectorGender] = useState("M");

  useEffect(() => {
    // 1. Cargar rápido los datos del formulario (usa caché)
    apiService.getEventInfo().then(infoRes => {
      if (infoRes.status === "success" && infoRes.data) {
        setEventData({
          evento: infoRes.data.EVENTO || "",
          fecha: (infoRes.data.FECHA_EVENTO || "").toString().split("T")[0],
          lugar: infoRes.data.LUGAR || "",
          organizador: infoRes.data.ORGANIZADOR || "",
        });
      }
      setLoading(false);
    }).catch(err => {
      console.warn("Error cargando info de evento:", err);
      setLoading(false);
    });

    // 2. Cargar lento la plantilla en segundo plano
    apiService.getTemplateText().then(templateRes => {
      if (templateRes.status === "success" && templateRes.text) {
        setTemplateText(templateRes.text);
      }
      setLoadingTemplate(false);
    }).catch(err => {
      console.warn("Error cargando plantilla:", err);
      setLoadingTemplate(false);
    });
  }, []);

  const renderTemplatePreview = () => {
    if (!templateText) return null;

    const studentName = testStudentGender === "M" ? "Juan Pérez García" : "María López Díaz";
    const studentType = testStudentGender === "M" ? "alumno" : "alumna";

    const directorName = testDirectorGender === "M" ? "Prof. Roberto Gómez" : "Mtra. Ana Martínez";
    const directorTitle = testDirectorGender === "M" ? "DIRECTOR DE" : "DIRECTORA DE";
    const directorSaludo = testDirectorGender === "M" ? "Apreciable director" : "Apreciable directora";

    let previewText = templateText
      .replace(/{{NOMBRE_ALUMNO}}/g, studentName)
      .replace(/{{T_ALUMNO}}/g, studentType)
      .replace(/{{DIRECTOR}}/g, directorName)
      .replace(/{{TITULO}}/g, directorTitle)
      .replace(/{{SALUDO}}/g, directorSaludo)
      .replace(/{{ESCUELA}}/g, "SECUNDARIA DEL DEPORTE")
      .replace(/{{FECHA}}/g, formatDateSpanish(new Date().toISOString()))
      .replace(/{{FECHAEVENTO}}/g, eventData.fecha ? formatDateSpanish(eventData.fecha) : "[FECHA_EVENTO]")
      .replace(/{{EVENTO}}/g, eventData.evento || "[EVENTO]")
      .replace(/{{ORGANIZADOREVENTO}}/g, eventData.organizador || "[ORGANIZADOR]")
      .replace(/{{LUGAREVENTO}}/g, eventData.lugar || "[LUGAR]")
      .replace(/__________________________________/g, "__________________________________\n"); // Enter forzado entre línea y nombre

    const paragraphs = previewText.split('\n').filter(p => p.trim() !== '');

    return (
      <Box>
        {paragraphs.map((p, i) => {
          // Heurística de alineación:
          const isHeader = i < 2; // Las primeras 2 líneas al centro
          const isDate = p.includes(formatDateSpanish(new Date().toISOString()));
          
          // La sección de firma final debe ir centrada
          const isFooterSignature = 
            p.includes("________________") || 
            p.includes("Luis Guillermo") || 
            p.toLowerCase().includes("director de tlacuaches") || 
            p.toLowerCase().includes("tel.") || 
            p.includes("ATENTAMENTE");
          
          let align: 'left' | 'center' | 'right' | 'justify' = 'justify';
          
          // Nombres del director al inicio van a la izquierda
          if (p.includes(directorName) || p.includes(directorTitle)) {
            align = 'left';
          }

          if (isHeader || isFooterSignature) align = 'center';
          if (isDate) align = 'right';

          const isBold = p.includes("A QUIEN CORRESPONDA") || p.includes("P R E S E N T E") || isFooterSignature;

          return (
            <Typography key={i} fontSize={16} fontWeight={isBold ? 700 : 400} sx={{ textAlign: align, lineHeight: 1.8, mb: 2, whiteSpace: "pre-wrap" }}>
              {p.replace(/\t/g, '')}
            </Typography>
          );
        })}
      </Box>
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const resp = await apiService.updateEventInfo(
        eventData.evento,
        eventData.fecha,
        eventData.lugar,
        eventData.organizador
      );

      if (resp.status === "success") {
        setStatus({ type: "success", msg: "¡Información del evento actualizada!" });
      } else {
        setStatus({ type: "error", msg: "Error al actualizar: " + resp.message });
      }
    } catch (err: any) {
      setStatus({ type: "error", msg: err.message || "Error al actualizar" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Card elevation={4} sx={{ border: "1px solid rgba(255,255,255,0.1)" }}>
        <Box sx={{ p: 4, background: "linear-gradient(135deg, rgba(255, 183, 77, 0.1) 0%, transparent 100%)" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <EditNoteIcon color="warning" sx={{ fontSize: 32 }} />
              <Typography variant="h5" fontWeight={700}>Configuración del Evento</Typography>
            </Box>
            <Button startIcon={<LogoutIcon />} color="inherit" onClick={onLogout}>Salir</Button>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Modifica los datos que aparecerán automáticamente en el formulario de los alumnos y en los PDF generados.
          </Typography>
        </Box>
        <Divider sx={{ opacity: 0.1 }} />
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Nombre del Evento"
                name="evento"
                value={eventData.evento}
                onChange={handleChange}
                placeholder="Ej. Tlacuaches Marching Band"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha del Evento"
                name="fecha"
                value={eventData.fecha}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                helperText="Formato para Excel: YYYY-MM-DD"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Lugar / Ciudad"
                name="lugar"
                value={eventData.lugar}
                onChange={handleChange}
                placeholder="Ej. Auditorio Estatal"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Organización / Responsable"
                name="organizador"
                value={eventData.organizador}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="warning"
                size="large"
                startIcon={updating ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={updating}
                onClick={handleUpdate}
                sx={{ py: 1.5, fontWeight: 700 }}
              >
                {updating ? "Actualizando Excel..." : "Guardar Cambios en Google Sheets"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>

        <Snackbar open={!!status} autoHideDuration={4000} onClose={() => setStatus(null)}>
          <Alert severity={status?.type} variant="filled" sx={{ width: "100%" }}>
            {status?.msg}
          </Alert>
        </Snackbar>
      </Card>

      {/* Vista Previa del Documento: Mostrar cargando o el resultado */}
      {loadingTemplate ? (
        <Card elevation={4} sx={{ border: "1px solid rgba(255,255,255,0.1)", p: 4, display: "flex", justifyContent: "center", gap: 2, alignItems: "center" }}>
          <CircularProgress size={24} color="info" />
          <Typography color="text.secondary" fontWeight={500}>Descargando plantilla original desde Google Docs...</Typography>
        </Card>
      ) : templateText ? (
        <Card elevation={4} sx={{ border: "1px solid rgba(255,255,255,0.1)", overflow: 'hidden' }}>
          <Box sx={{ p: 3, background: "linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, transparent 100%)", display: "flex", alignItems: "center", gap: 1 }}>
            <VisibilityIcon color="info" />
            <Typography variant="h6" fontWeight={600}>Vista Previa del Documento (Aproximada)</Typography>
          </Box>
          <Divider sx={{ opacity: 0.1 }} />
          <CardContent sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default" }}>

            {/* Controles de Testing Dinámico (Con colores corregidos usando Paper en lugar de Box transparente) */}
            <Paper elevation={2} sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4, p: 3, borderRadius: 2 }}>
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel>Género del Alumno (Prueba)</InputLabel>
                <Select
                  value={testStudentGender}
                  label="Género del Alumno (Prueba)"
                  onChange={(e) => setTestStudentGender(e.target.value)}
                >
                  <MenuItem value="M">Masculino (alumno)</MenuItem>
                  <MenuItem value="F">Femenino (alumna)</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel>Género Director(a) (Prueba)</InputLabel>
                <Select
                  value={testDirectorGender}
                  label="Género Director(a) (Prueba)"
                  onChange={(e) => setTestDirectorGender(e.target.value)}
                >
                  <MenuItem value="M">Masculino (Director)</MenuItem>
                  <MenuItem value="F">Femenino (Directora)</MenuItem>
                </Select>
              </FormControl>
            </Paper>

            <Paper elevation={3} sx={{
              p: { xs: 4, md: 8 },
              bgcolor: "white",
              color: "black",
              maxWidth: 950,
              mx: "auto",
              minHeight: { xs: 'auto', md: 800 },
              fontFamily: '"Times New Roman", Times, serif',
              position: 'relative'
            }}>
              {/* Logotipos Absolutos */}
              <Box sx={{ position: 'absolute', top: 40, left: { xs: 20, md: 50 }, width: 100, height: 100, border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 12 }}>
                Logotipo Izq
              </Box>
              <Box sx={{ position: 'absolute', top: 40, right: { xs: 20, md: 50 }, width: 100, height: 100, border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 12 }}>
                Logotipo Der
              </Box>

              {/* Contenido principal expandido hacia los laterales */}
              <Box sx={{ pt: 1, px: { xs: 0, md: 4 } }}>
                {renderTemplatePreview()}
              </Box>
            </Paper>
          </CardContent>
        </Card>
      ) : (
        <Card elevation={4} sx={{ border: "1px solid rgba(255,255,255,0.1)", p: 4, textAlign: "center", bgcolor: "rgba(255, 0, 0, 0.05)" }}>
          <Typography color="error" fontWeight={600}>⚠️ No se pudo cargar la vista previa</Typography>
          <Typography color="text.secondary" variant="body2" mt={1}>Asegúrate de que la URL publicada "Ejecutar como" esté configurada a tu correo y que el ID del documento sea correcto.</Typography>
        </Card>
      )}
    </Box>
  );
}
