import { Card, CardContent, Typography, Box, Avatar, Divider, Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from "@mui/icons-material/Info";
import logoCircle from "../assets/logocircle.png";

interface AboutPageProps {
  onBack: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box display="flex" alignItems="center" gap={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} color="inherit" sx={{ opacity: 0.8, textTransform: "none", fontSize: "1.1rem" }}>
          Volver
        </Button>
      </Box>


      {/* Tarjeta de Información del Proyecto */}
      <Card elevation={4} sx={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ p: 4, background: "linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, transparent 100%)", display: "flex", alignItems: "center", gap: 2 }}>
          <InfoIcon color="info" sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight={700}>Acerca del Proyecto</Typography>
        </Box>
        <Divider sx={{ opacity: 0.1 }} />
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: "1.1rem", color: "text.secondary" }}>
            Sistema web diseñado para la generación automática de documentos PDF para alumnos. Este sistema, construido con React y Google Apps Script, fue arquitectado para ser accesible directamente desde cualquier navegador web moderno, eliminando por completo la necesidad de instalar software adicional en los equipos de los usuarios finales y garantizando un flujo robusto en la nube.
          </Typography>
        </CardContent>
      </Card>


      {/* Tarjeta del Desarrollador */}
      <Card elevation={4} sx={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 3 }}>
        <Box sx={{ p: { xs: 3, md: 5 }, display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 4, md: 6 }, alignItems: { xs: "center", md: "flex-start" } }}>
          <Avatar
            src={logoCircle}
            alt="Marco Antonio Aguayo"
            sx={{ width: 180, height: 180, border: "4px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
          />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, textAlign: { xs: "center", md: "left" } }}>
            <Box>
              <Typography variant="h4" fontWeight={800}>Marco Antonio Aguayo</Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5, fontSize: "1.2rem" }}>VanitasuShieda</Typography>
            </Box>

            <Typography variant="body1" sx={{ lineHeight: 1.7, maxWidth: 600 }}>
              Hi, I'm Marco. I think too much, sleep too little, and use Linux... draw your own conclusions. I like well-written code, anime that hits, strong gym, music.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2, color: "text.secondary" }}>
              <Box display="flex" alignItems="center" gap={1.5} justifyContent={{ xs: "center", md: "flex-start" }}>
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">Aguascalientes, Mexico</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1.5} justifyContent={{ xs: "center", md: "flex-start" }}>
                <XIcon fontSize="small" />
                <Typography variant="body2">@VanitasuGrenore</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1.5} justifyContent={{ xs: "center", md: "flex-start" }}>
                <InstagramIcon fontSize="small" />
                <Typography variant="body2">straynight.vanitasu</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1.5} justifyContent={{ xs: "center", md: "flex-start" }}>
                <YouTubeIcon fontSize="small" />
                <Typography variant="body2">@VanitasuGrenore</Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: { xs: "center", md: "flex-start" } }}>
              <Button
                variant="outlined"
                startIcon={<GitHubIcon />}
                href="https://github.com/VanitasuShieda"
                target="_blank"
                sx={{ borderRadius: 8, textTransform: "none", fontWeight: 600, px: 3 }}
              >
                Perfil de GitHub
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
