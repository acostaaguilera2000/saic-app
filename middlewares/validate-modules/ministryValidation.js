const validateCommonFields = (req, errors) => {
    const { nombre, descripcion } = req.body;

    // Validación del campo nombre (Obligatorio, mínimo de caracteres y tipo de dato)
    if (!nombre || nombre.trim() === "") {
        errors.push("El nombre del ministerio es un campo obligatorio.");
    } else {
        if (nombre.trim().length < 4) {
            errors.push("El nombre del ministerio debe contener al menos 4 caracteres.");
        }
        if (nombre.trim().length > 50) {
            errors.push("El nombre del ministerio no puede exceder los 50 caracteres.");
        }
    }

    // Validación del campo descripción (Obligatorio y longitud máxima)
    if (!descripcion || descripcion.trim() === "") {
        errors.push("La descripción del ministerio es un campo obligatorio.");
    } else {
        if (descripcion.trim().length < 10) {
            errors.push("La descripción debe ser más detallada (mínimo 10 caracteres).");
        }
        if (descripcion.trim().length > 255) {
            errors.push("La descripción no puede exceder los 255 caracteres.");
        }
    }
};

// Middleware para validar la creación de un nuevo ministerio
export const validateMinistryCreate = (req, res, next) => {
    const errors = [];

    // Ejecuta las validaciones de los campos compartidos de la entidad
    validateCommonFields(req, errors);

    // Si existen errores, se inyectan en el objeto de la petición para que el controlador los procese
    if (errors.length > 0) {
        req.validationErrors = errors;
    }

    next();
};

// Middleware para validar la actualización de un ministerio existente
export const validateMinistryUpdate = (req, res, next) => {
    const errors = [];

    // Ejecuta las validaciones de los campos compartidos de la entidad
    validateCommonFields(req, errors);

    // Si existen errores, se inyectan en el objeto de la petición para que el controlador los procese
    if (errors.length > 0) {
        req.validationErrors = errors;
    }

    next();
};

//Middleware para validar la asignación o desvinculación de miembros en un ministerio

export const validateMinistryMemberAction = (req, res, next) => {
    const { id_ministerio, id_miembro } = req.body;
    const errors = [];

    // Valida que el identificador del ministerio sea un valor numérico correcto
    if (!id_ministerio || isNaN(Number(id_ministerio))) {
        errors.push("El identificador del ministerio debe ser un número válido.");
    }

    // Valida que el identificador del miembro sea un valor numérico correcto
    if (!id_miembro || isNaN(Number(id_miembro))) {
        errors.push("El miembro que intenta gestionar debe ser un número válido.");
    }

    // Si existen errores, se inyectan en el objeto de la petición para que el controlador los procese
    if (errors.length > 0) {
        req.validationErrors = errors;
    }

    next();
};