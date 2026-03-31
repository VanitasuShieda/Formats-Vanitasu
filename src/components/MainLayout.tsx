import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginDialog from "./LoginDialog";
import StudentForm from "./StudentForm";
import AdminPanel from "./AdminPanel";

export default function MainLayout() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleOpenLogin = () => setLoginOpen(true);
  const handleCloseLogin = () => setLoginOpen(false);
  const handleLogout = () => setIsAdmin(false);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setLoginOpen(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="fixed" elevation={0} sx={{ top: 0 }}>
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #7b61ff 0%, #4facfe 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: 20,
                color: "white",
                boxShadow: "0 4px 14px rgba(123, 97, 255, 0.5)",
              }}
            >
              V
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{ color: "white", fontWeight: 700 }}
            >
              Generador de Constancias Tlacuaches
            </Typography>
          </Box>

          {isAdmin ? (
            <Button
              color="error"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ borderRadius: "12px", border: "1px solid rgba(255,0,0,0.2)" }}
            >
              Cerrar Sesión
            </Button>
          ) : (
            <Button
              color="inherit"
              onClick={handleOpenLogin}
              startIcon={<LoginIcon />}
              sx={{
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Ingresar
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 12, md: 16 },
          pb: 8,
        }}
      >
        <Container maxWidth="md">
          {isAdmin ? <AdminPanel onLogout={handleLogout} /> : <StudentForm />}
        </Container>
      </Box>

      {/* Login Dialog */}
      <LoginDialog 
        open={loginOpen} 
        onClose={handleCloseLogin} 
        onLoginSuccess={handleLoginSuccess}
      />
    </Box>
  );
}
