import { useState } from "react";
import packageJson from "../../package.json";
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
import AboutPage from "./AboutPage";

export default function MainLayout() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [view, setView] = useState<"main" | "about">("main");
  // Inicializar estado leyendo localStorage para mantener la sesión
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem("vanitasu_isAdmin") === "true");

  const handleOpenLogin = () => setLoginOpen(true);
  const handleCloseLogin = () => setLoginOpen(false);
  
  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("vanitasu_isAdmin");
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    localStorage.setItem("vanitasu_isAdmin", "true");
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
              sx={{ color: "white", fontWeight: 700, display: "flex", alignItems: "center" }}
            >
              Generador de Constancias Tlacuaches 
              <Typography 
                component="span" 
                sx={{ 
                  fontSize: "0.55em", 
                  fontWeight: 500, 
                  opacity: 0.8, 
                  bgcolor: "rgba(255,255,255,0.15)", 
                  px: 1, 
                  py: 0.2, 
                  borderRadius: 1,
                  ml: 1.5
                }}
              >
                v{packageJson.version}
              </Typography>
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
          pb: 4,
        }}
      >
        <Container maxWidth="md">
          {view === "about" ? (
            <AboutPage onBack={() => setView("main")} />
          ) : isAdmin ? (
            <AdminPanel onLogout={handleLogout} />
          ) : (
            <StudentForm />
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 3, textAlign: "center", mt: "auto", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Button 
          variant="text" 
          color="inherit" 
          sx={{ textTransform: "none", opacity: 0.5, fontSize: "0.85rem", "&:hover": { opacity: 1, bgcolor: "rgba(255,255,255,0.05)" } }} 
          onClick={() => setView(view === "about" ? "main" : "about")}
        >
          {view === "about" ? "Volver al generador" : "Acerca del Desarrollador e Información del Proyecto"}
        </Button>
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
