// Expresión regular para verificar que una cadena contenga solo números
const numericoRegex = /^\d+$/;

// Middleware para validación al CREAR un miembro
export const validate = (req, res, next) => {
    const { nombre, apellido, documento, fecha_registro, fecha_bautismo } = req.body;
    const errors = [];

    // 1. Validar nombre
    if (!nombre || nombre.trim() === "") {
        errors.push("El nombre es obligatorio y no puede estar vacío.");
    }

    // 2. Validar apellido
    if (!apellido || apellido.trim() === "") {
        errors.push("El apellido es obligatorio y no puede estar vacío.");
    }

    // 3. Validar documento (Numérico y con longitud válida de C.C.)
    if (!documento || documento.trim() === "") {
        errors.push("El documento de identidad es obligatorio.");
    } else {
        const docTrim = documento.trim();
        if (!numericoRegex.test(docTrim)) {
            errors.push("El documento de identidad debe contener únicamente números.");
        }
        if (docTrim.length < 8 || docTrim.length > 10) {
            errors.push("El documento de identidad (C.C.) debe tener entre 8 y 10 dígitos.");
        }
    }

    // 4. Validar fecha de registro (Obligatoria en la creación)
    if (!fecha_registro || fecha_registro.trim() === "") {
        errors.push("Debe ingresar una fecha de registro válida.");
    }


    // Si hay errores, los inyectamos en el objeto request
    if (errors.length > 0) {
        req.validationErrors = errors;
    }

    next();
};

// Middleware para validación al ACTUALIZAR un miembro
export const validateMemberUpdate = (req, res, next) => {
    const { nombre, apellido, documento, fecha_registro } = req.body;
    const errors = [];

    // 1. Validar nombre si se envía
    if (nombre !== undefined && (!nombre || nombre.trim() === "")) {
        errors.push("El nombre modificado no puede quedar vacío.");
    }

    // 2. Validar apellido si se envía
    if (apellido !== undefined && (!apellido || apellido.trim() === "")) {
        errors.push("El apellido modificado no puede quedar vacío.");
    }

    // 3. Validar documento si se envía (Misma regla de formato y longitud)
    if (documento !== undefined) {
        if (!documento || documento.trim() === "") {
            errors.push("El documento de identidad modificado no puede quedar vacío.");
        } else {
            const docTrim = documento.trim();
            if (!numericoRegex.test(docTrim)) {
                errors.push("El documento de identidad debe contener únicamente números.");
            }
            if (docTrim.length < 8 || docTrim.length > 10) {
                errors.push("El documento de identidad (C.C.) debe tener entre 8 y 10 dígitos.");
            }
        }
    }

    // 4. Validar fecha de registro si se envía
    if (fecha_registro !== undefined && (!fecha_registro || fecha_registro.trim() === "")) {
        errors.push("La fecha de registro modificada debe ser una fecha válida.");
    }

    // Si hay errores, los adjuntamos
    if (errors.length > 0) {
        req.validationErrors = errors;
    }

    next();
};