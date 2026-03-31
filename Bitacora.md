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

---
**Nota Técnica:** Todas las operaciones con Google Apps Script utilizan ahora `GET` + `callback` (JSONP), lo que elimina los errores de "Preflight" y asegura compatibilidad total con el entorno de producción.
