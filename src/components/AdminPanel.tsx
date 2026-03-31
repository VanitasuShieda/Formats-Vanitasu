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
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import LogoutIcon from "@mui/icons-material/Logout";
import EditNoteIcon from "@mui/icons-material/EditNote";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyGPgPAYzGDriPqGXbwn6MfcPQNog9XqPmcMzhvldZDDDW4GAkqaMBE4aYz-4k7At4y/exec";

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

  useEffect(() => {
    // Cargar info actual via JSONP
    const callbackName = "admin_get_info_" + Math.round(100000 * Math.random());
    (window as any)[callbackName] = (data: any) => {
      if (data.status === "success" && data.data) {
        setEventData({
          evento: data.data.EVENTO || "",
          fecha: data.data.FECHA_EVENTO || "",
          lugar: data.data.LUGAR || "",
          organizador: data.data.ORGANIZADOR || "",
        });
      }
      setLoading(false);
      delete (window as any)[callbackName];
    };

    const script = document.createElement("script");
    script.src = `${GOOGLE_SCRIPT_URL}?action=getInfo&callback=${callbackName}`;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    setUpdating(true);
    const callbackName = "admin_update_" + Math.round(100000 * Math.random());
    
    (window as any)[callbackName] = (data: any) => {
      setUpdating(false);
      if (data.status === "success") {
        setStatus({ type: "success", msg: "¡Información del evento actualizada!" });
      } else {
        setStatus({ type: "error", msg: "Error al actualizar: " + data.message });
      }
      delete (window as any)[callbackName];
    };

    const params = new URLSearchParams({
      action: "updateInfo",
      evento: eventData.evento,
      fecha: eventData.fecha,
      lugar: eventData.lugar,
      organizador: eventData.organizador,
      callback: callbackName
    });

    const script = document.createElement("script");
    script.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
    document.body.appendChild(script);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
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
  );
}
