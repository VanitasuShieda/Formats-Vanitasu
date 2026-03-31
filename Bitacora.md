# Bitácora de Proyecto: Formats-Vanitasu

Esta bitácora documenta el inicio, progreso y desarrollo del sistema web para la generación automática de documentos PDF para alumnos.

---

## 🚀 Visión General del Proyecto

**Descripción Inicial:**  
Sistema web para la generación automática de documentos PDF para alumnos. Este sistema está diseñado para ser accesible directamente desde cualquier navegador web, eliminando por completo la necesidad de instalar software adicional en los equipos de los usuarios finales.

### 🏗️ Arquitectura Propuesta (Stack Tecnológico)

El flujo de trabajo y la comunicación de datos se estructuran de la siguiente manera:

1. **Frontend (Interfaz de Usuario)**
   * **Tecnología:** React.
   * **Hosting:** GitHub Pages.
   * **Rol:** Capturar la información del alumno e interactuar con el usuario.

2. **Backend (Lógica de Negocio e Integración)**
   * **Tecnología:** Google Apps Script.
   * **Rol:** Recibir los datos del frontend, orquestar la generación del documento y guardarlo. Funciona como puente.

3. **Base de Datos (Registro de Datos)**
   * **Tecnología:** Google Sheets.
   * **Rol:** Almacenar de manera persistente los registros de los alumnos y la información sometida por el sistema.

4. **Almacenamiento de Archivos (Gestión Documental)**
   * **Tecnología:** Google Drive.
   * **Rol:** Almacenamiento seguro y definitivo de los documentos PDF generados automáticamente.

***Flujo General:** Frontend (React) ➔ Backend (Google Apps Script) ➔ Google Sheets (Registro) ➔ Google Drive (Almacenamiento PDF).*

---

## 📅 Historial de Progreso

### Fase 1: Concepción y Diseño Inicial (Marzo 2026)
- **Inicio de Proyecto:** Se define la arquitectura de despliegue gratuito y la pila tecnológica usando herramientas del ecosistema de Google y React.
- **Siguientes pasos:** 
  - Inicializar proyecto React.
  - Diseñar la hoja de cálculo en Google Sheets.
  - Crear el script en Google Apps Script (Webhook/API).
