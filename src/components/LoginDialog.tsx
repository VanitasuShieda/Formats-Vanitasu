import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyGPgPAYzGDriPqGXbwn6MfcPQNog9XqPmcMzhvldZDDDW4GAkqaMBE4aYz-4k7At4y/exec";

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginDialog({ open, onClose, onLoginSuccess }: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const callbackName = "login_callback_" + Math.round(100000 * Math.random());
    (window as any)[callbackName] = (data: any) => {
      setLoading(false);
      if (data.status === "success") {
        onLoginSuccess();
        setEmail("");
        setPassword("");
      } else {
        alert("Acceso denegado: " + data.message);
      }
      delete (window as any)[callbackName];
    };

    const script = document.createElement("script");
    const params = new URLSearchParams({
      action: "login",
      email: email,
      password: password,
      callback: callbackName
    });
    script.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
    document.body.appendChild(script);

    setTimeout(() => {
      if (script.parentNode) script.parentNode.removeChild(script);
    }, 5000);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        elevation: 1,
        sx: { width: '100%', maxWidth: 400, p: 1 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" component="span" fontWeight={700}>
          Acceso Administrativo
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleLogin}>
        <DialogContent dividers sx={{ borderBottom: 'none', borderTopColor: 'rgba(255,255,255,0.1)' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Inicia sesión para gestionar los formatos y configurar detalles del evento.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
              required
            />
            <TextField
              fullWidth
              label="Contraseña"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={onClose} color="inherit" sx={{ mr: 1, opacity: 0.8 }} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disableElevation disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
