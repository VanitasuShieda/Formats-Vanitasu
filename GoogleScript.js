//id de hoja de excel con los datos
const SPREADSHEET_ID = "1EYJiuhOEnd-ISdMXGBqYOsOlDZG2T5bXpXnH1mdj9A0";
//id de documento plantilla
const templateId = "1JOT2CU6m58c0d_GwCA-sevmnVftuiZEx_BHjQgqs2AM";
//Id de carpeta Respaldo (Donde se guardan los PDF generados)
const ROOT_BK_FOLDER_ID = "1LT9Z-0NHMs2LcSxcFeu6spTjBn0K6Fjb";


function getOrCreateFolder(evento, fecha) {
    const root = DriveApp.getFolderById(ROOT_BK_FOLDER_ID);

    // Normalizar fecha
    const fechaObj = new Date(fecha);
    const fechaNormalizada = Utilities.formatDate(
        fechaObj,
        Session.getScriptTimeZone(),
        "yyyy-MM-dd"
    );

    // Normalizar evento
    const eventoNormalizado = evento.trim().replace(/\s+/g, "_");

    const folderName = `${eventoNormalizado}_${fechaNormalizada}`;

    const folders = root.getFoldersByName(folderName);

    if (folders.hasNext()) {
        return folders.next();
    }

    return root.createFolder(folderName);
}

//lee el excel donde guardo la info del evento
function getInfoEvento() {

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName("InfoEvento");
    const data = sheet.getDataRange().getValues();

    const info = {};

    for (let i = 1; i < data.length; i++) {
        const key = data[i][0];
        const value = data[i][1];

        if (key && typeof key === "string") {
            info[key.trim()] = value;
        }
    }

    //Logger.log("Resultado final:");
    //Logger.log(JSON.stringify(info));

    return info;
}

function doGet(e) {
    const callback = e.parameter.callback;

    try {
        const action = e.parameter.action;
        const ss = SpreadsheetApp.openById(SPREADSHEET_ID)

        // 🔐 ACCIÓN: LOGIN (Simple)
        if (action === "login") {
            const email = (e.parameter.email || "").toLowerCase();
            const pass = e.parameter.password;
            const sheet = ss.getSheetByName("OAUsers");
            const data = sheet.getDataRange().getValues();

            let authorized = false;
            // Empezamos en 1 para saltar cabeceras
            for (let i = 1; i < data.length; i++) {
                const sheetEmail = (data[i][0] || "").toString().toLowerCase();
                if (sheetEmail === email && String(data[i][1]) === pass) {
                    authorized = true;
                    break;
                }
            }

            const response = JSON.stringify({ status: authorized ? "success" : "error", message: authorized ? "Acceso concedido" : "Credenciales inválidas" });
            return ContentService.createTextOutput(callback ? callback + "(" + response + ");" : response)
                .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
        }

        // 📝 ACCIÓN: UPDATE INFO (Actualizar datos del evento)
        if (action === "updateInfo") {
            const sheet = ss.getSheetByName("InfoEvento");
            const data = sheet.getDataRange().getValues();

            // Mapeo de parámetros recibidos
            const updates = {
                "EVENTO": e.parameter.evento,
                "FECHA_EVENTO": e.parameter.fecha,
                "LUGAR": e.parameter.lugar,
                "ORGANIZADOR": e.parameter.organizador
            };

            for (let i = 1; i < data.length; i++) {
                const key = data[i][0] ? data[i][0].trim() : "";
                if (updates[key]) {
                    sheet.getRange(i + 1, 2).setValue(updates[key]);
                }
            }

            const response = JSON.stringify({ status: "success", message: "Información actualizada correctamente" });
            return ContentService.createTextOutput(callback ? callback + "(" + response + ");" : response)
                .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
        }

        // 📤 ACCIÓN: SUBMIT (Generar PDF )
        if (action === "submit") {
            const nombreAlumno = e.parameter.nombreAlumno;
            const identidadAlumno = e.parameter.identidadAlumno;
            const escuela = e.parameter.escuela.toUpperCase();
            const director = e.parameter.director;
            const sexoDirector = e.parameter.sexoDirector;
            const correo = e.parameter.correo; // Puede ser opcional

            const info = getInfoEvento();
            const evento = info.EVENTO;
            const rawFechaEvento = info.FECHA_EVENTO;
            const fechaEventoFormateada = rawFechaEvento instanceof Date
                ? formatDateSpanish(rawFechaEvento)
                : rawFechaEvento;
            const organizador = info.ORGANIZADOR;
            const lugar = info.LUGAR;

            const fechaHoy = formatDateSpanish(new Date());

            const folder = getOrCreateFolder(evento, rawFechaEvento);

            // Textos dinámicos
            const titulo = sexoDirector === "Masculino" ? "DIRECTOR DE" : "DIRECTORA DE";
            const saludo = sexoDirector === "Masculino" ? "Apreciable director" : "Apreciable directora";
            let tAlumno = identidadAlumno === "Masculino" ? "alumno" : (identidadAlumno === "Femenino" ? "alumna" : "estudiante");

            // DOC
            const copy = DriveApp.getFileById(templateId).makeCopy();
            const doc = DocumentApp.openById(copy.getId());
            const body = doc.getBody();

            body.replaceText("{{NOMBRE_ALUMNO}}", nombreAlumno);
            body.replaceText("{{T_ALUMNO}}", tAlumno);
            body.replaceText("{{DIRECTOR}}", director);
            body.replaceText("{{TITULO}}", titulo);
            body.replaceText("{{SALUDO}}", saludo);
            body.replaceText("{{ESCUELA}}", escuela.toUpperCase());
            body.replaceText("{{FECHA}}", fechaHoy);
            body.replaceText("{{FECHAEVENTO}}", fechaEventoFormateada);
            body.replaceText("{{EVENTO}}", evento);
            body.replaceText("{{ORGANIZADOREVENTO}}", organizador);
            body.replaceText("{{LUGAREVENTO}}", lugar);

            doc.saveAndClose();

            // PDF
            const pdf = DriveApp.getFileById(copy.getId()).getAs("application/pdf");
            const fileName = `Carta_${nombreAlumno.replace(/\s+/g, "_")}.pdf`;
            const pdfFile = folder.createFile(pdf).setName(fileName);
            pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            const pdfUrl = pdfFile.getUrl();

            // EMAIL OPCIONAL
            if (correo && correo.trim() !== "") {
                MailApp.sendEmail({
                    to: correo,
                    subject: `Constancia - ${evento}`,
                    htmlBody: `
            <p>Hola ${nombreAlumno},</p>
            <p>Adjunto encontrarás tu constancia.</p>
            <p><a href="${pdfUrl}" target="_blank">Ver PDF</a></p>
          `,
                    attachments: [pdfFile.getBlob()]
                });
            }

            // Limpieza
            copy.setTrashed(true);

            const responseData = JSON.stringify({
                status: "success",
                pdfUrl: pdfUrl
            });

            return ContentService.createTextOutput(callback ? callback + "(" + responseData + ");" : responseData)
                .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
        }

        // 📄 ACCIÓN: GET TEMPLATE (Obtener texto de la plantilla)
        if (action === "getTemplate") {
            const doc = DocumentApp.openById(templateId);
            const text = doc.getBody().getText();

            let responseData = JSON.stringify({
                status: "success",
                text: text
            });

            // Corrección CRÍTICA: Google Docs usa caracteres de retorno invisibles 
            // (\u2028 y \u2029) que ROMPEN los scripts JSONP de forma silenciosa.
            responseData = responseData.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

            return ContentService.createTextOutput(callback ? callback + "(" + responseData + ");" : responseData)
                .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
        }

        // Si no hay acción o es info, devolvemos la info del evento
        const infoEvento = getInfoEvento();
        const dataInfo = JSON.stringify({
            status: "success",
            data: infoEvento
        });

        if (callback) {
            return ContentService.createTextOutput(callback + "(" + dataInfo + ");")
                .setMimeType(ContentService.MimeType.JAVASCRIPT);
        }
        return ContentService.createTextOutput(dataInfo).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        const errObj = JSON.stringify({ status: "error", message: error.message });
        return ContentService.createTextOutput(callback ? callback + "(" + errObj + ");" : errObj)
            .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
    }
}

/**
 * Formatea una fecha en formato "d de MMMM de yyyy" en español.
 * @param {Date} date 
 * @returns {string}
 */
function formatDateSpanish(date) {
    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    const tz = Session.getScriptTimeZone();
    const d = new Date(date);

    // Obtenemos día, número de mes (1-12) y año respetando la zona horaria del script
    const dia = Utilities.formatDate(d, tz, "d");
    const mesIndex = parseInt(Utilities.formatDate(d, tz, "M")) - 1;
    const anio = Utilities.formatDate(d, tz, "yyyy");

    return `${dia} de ${meses[mesIndex]} de ${anio}`;
}
