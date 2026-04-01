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

### Fase 2: Desarrollo Frontend, Panel Admin y Estabilidad CORS (Marzo 2026)
- **Implementación JSONP**: Superadas las limitaciones de CORS mediante una arquitectura de `doGet` + `callbacks` en Google Apps Script, permitiendo lectura y escritura fluida desde el navegador.
- **UX Optimizada**:
    - Agregada **Vista de Carga Humorística** con mensajes dinámicos para reducir el abandono durante la generación del PDF.
    - Implementada **Descarga Directa**: El sistema ahora devuelve la URL del PDF, permitiendo al usuario verlo o bajarlo al instante.
- **Panel Administrativo**:
    - Creado panel de control protegido para editar la información del evento (`InfoEvento`) directamente en Google Sheets.
    - Selector de fecha (**DatePicker**) integrado para asegurar compatibilidad total con Excel.
- **Seguridad**: Sistema de login simple basado en la hoja `OAUsers` con validación de correo insensible a mayúsculas.
- **Localización Completa**: 
    - Corregido el formato de fechas: Ahora se muestran en español ("31 de marzo de 2026") tanto en la web como en los documentos PDF generados.
    - Implementada lógica de zona horaria en el backend para asegurar que la "fecha de hoy" siempre sea precisa según la configuración del script.
- **Despliegue**: Aplicación publicada y funcional en GitHub Pages.

### Fase 3: Optimización, Caché y Previsualización Dinámica (Abril 2026 - v2.1.0)
- **Vista Previa de Plantilla en Tiempo Real**: 
    - Integración de llamada asíncrona para descargar el formato base original desde Google Docs y procesarlo dentro del Panel Administrativo de React.
    - Se desarrollaron heurísticas CSS a medida y logotipos flotantes (absolutos) para calcar fielmente el diseño de impresión (centrado, justificado al vuelo y simulaciones de nombres/género).
- **Servicio Centralizado (`apiService.ts`)**: 
    - Refactorización drástica donde toda la comunicación con el backend pasó a ser gestionada a través de un servicio inyector de JSONP basado en Promesas (`async/await`). Centralizando la URL única de ejecución.
- **Implementación de Caché (Rendimiento)**: 
    - Se instaló memoria caché (RAM y `sessionStorage`) en el frontend para almacenar la meta-información del evento. Ahora el panel carga al instante reduciendo al mínimo las cuotas consumidas en Google Servers.
    - Se ató el estado del login del administrador a `localStorage` para evitar pedir contraseñas incesantemente tras cerrar la pestaña.
- **Resiliencia de Conexión y Corrección de Bugs**:
    - **Solución Silenciosa de JSONP**: Se implementó una destructora de caracteres en Google Apps Script para limpiar retornos de carro invisibles (`\u2028`, `\u2029`) de Google Docs que paralizaban la ejecución en el navegador.
    - **Tolerancia a Cold-Starts**: Los límites de tiempo (timeouts) de red fueron re-ajustados masivamente (hasta 90s) para asegurar respuesta incluso cuando los servidores de Google se "duermen" por inactividad.
- **Versionado Dinámico Visual**: Integrada una viñeta en el encabezado izquierdo que lee la última versión productiva en tiempo real del archivo `package.json` (ej: v2.1.0).

---
**Nota Técnica:** Todas las operaciones con Google Apps Script utilizan ahora `GET` + `callback` (JSONP), lo que elimina los errores de "Preflight" y asegura compatibilidad total con el entorno de producción.
