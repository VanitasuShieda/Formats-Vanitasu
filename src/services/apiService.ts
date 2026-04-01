// src/services/apiService.ts

// Única fuente de verdad para la URL del script
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyh3f8DALEmFt_hNicmte0X2D2ZK3ydlbqBPtZRWQ0ny-pgGEdg12Q2jKyz18ccLNL4rQ/exec";

/**
 * Helper genérico para hacer peticiones JSONP a Google Apps Script de forma asíncrona.
 */
const fetchJSONP = <T>(params: Record<string, string>, timeoutMs: number = 20000): Promise<T> => {
  return new Promise((resolve, reject) => {
    const callbackName = "jsonp_cb_" + Math.round(1000000 * Math.random());
    const script = document.createElement("script");

    // Configurar timeout para evitar peticiones colgadas
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error("Tiempo de espera agotado"));
    }, timeoutMs);

    // Función de limpieza de DOM y memoria
    const cleanup = () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      delete (window as any)[callbackName];
    };

    // Registrar callback global al cual Google Script responderá
    (window as any)[callbackName] = (data: T) => {
      clearTimeout(timeoutId);
      cleanup();
      resolve(data);
    };

    // Manejar errores de red o CORS en el navegador
    script.onerror = () => {
      clearTimeout(timeoutId);
      cleanup();
      reject(new Error("Error de red al conectar con Google Script"));
    };

    // Preparar URL inyectando los parámetros y el callback
    const searchParams = new URLSearchParams({ ...params, callback: callbackName });
    script.src = `${GOOGLE_SCRIPT_URL}?${searchParams.toString()}`;

    document.body.appendChild(script);
  });
};

let cachedEventInfo: any = null;

export const apiService = {
  // 1. Obtener la información general del evento con manejo de CACHE
  getEventInfo: async (forceRefresh = false) => {
    if (!forceRefresh && cachedEventInfo) {
      return { status: "success", data: cachedEventInfo };
    }

    if (!forceRefresh) {
      const storedStr = sessionStorage.getItem("vanitasu_event_info");
      if (storedStr) {
        try {
          cachedEventInfo = JSON.parse(storedStr);
          return { status: "success", data: cachedEventInfo };
        } catch (e) { }
      }
    }

    const response = await fetchJSONP<any>({ action: "getInfo" });

    if (response && response.status === "success" && response.data) {
      cachedEventInfo = response.data;
      sessionStorage.setItem("vanitasu_event_info", JSON.stringify(cachedEventInfo));
    }

    return response;
  },

  // 2. Obtener el texto raw de la plantilla de Google Docs para vista previa
  getTemplateText: async () => {
    return fetchJSONP<any>({ action: "getTemplate" }, 45000); // Le damos hasta 45s por si Google tarda en despertar
  },

  // 3. Iniciar sesión administrativa
  login: async (email: string, password: string) => {
    return fetchJSONP<any>({ action: "login", email, password }, 30000);
  },

  // 4. Actualizar la información del evento administrativo y actualizar CACHE
  updateEventInfo: async (evento: string, fecha: string, lugar: string, organizador: string) => {
    const response = await fetchJSONP<any>({
      action: "updateInfo",
      evento,
      fecha,
      lugar,
      organizador
    }, 45000);

    if (response && response.status === "success") {
      cachedEventInfo = {
        EVENTO: evento,
        FECHA_EVENTO: fecha,
        LUGAR: lugar,
        ORGANIZADOR: organizador
      };
      sessionStorage.setItem("vanitasu_event_info", JSON.stringify(cachedEventInfo));
    }

    return response;
  },

  // 5. Enviar respuesta del formulario del estudiante y generar PDF
  submitStudentForm: async (data: {
    nombreAlumno: string;
    identidadAlumno: string;
    escuela: string;
    director: string;
    sexoDirector: string;
    correo?: string;
  }) => {
    // Tomará más tiempo porque crea carpeta, copia docs, renderiza PDF y manda email
    return fetchJSONP<any>({
      action: "submit",
      ...data
    }, 90000); // Le damos hasta 90s (1.5 min) porque generar y enviar un PDF pesado desde Google Drive toma tiempo
  }
};
