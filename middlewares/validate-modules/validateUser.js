// Validaciones comunes para evitar repetición de código
const validateCommonFields = (req, errors) => {
    const { username, email, rol, id_miembro } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        errors.push("Debe ingresar un email válido.");
    }

    const allowedRoles = ["admin", "tesorero", "lider", "miembro"];
    if (!rol || !allowedRoles.includes(rol)) {
        errors.push("Debe seleccionar un rol válido.");
    }

    if (id_miembro && isNaN(Number(id_miembro))) {
        errors.push("El miembro asociado debe ser un número válido.");
    }


    if (!username || username.trim() === "") {
        errors.push("El nombre de usuario es un campo obligatorio.");
    } else {
        if (username.trim().length < 3) {
            errors.push("El nombre de usuario debe contener al menos 3 caracteres.");
        }
        // Expresión regular para validar caracteres permitidos en el username
        const usernameRegex = /^[a-zA-Z0-9_.]+$/;
        if (!usernameRegex.test(username.trim())) {
            errors.push("El nombre de usuario solo puede contener letras, números, puntos o guiones bajos.");
        }
    }

};

// Middleware para validar la creación de un usuario (Contraseña Obligatoria)

export const validateUserCreate = (req, res, next) => {
    const { password } = req.body;
    const errors = [];

    validateCommonFields(req, errors);

    if (!password || password.length < 6) {
        errors.push("La contraseña es obligatoria y debe tener al menos 6 caracteres.");
    }

    if (errors.length > 0) {
        req.validationErrors = errors;
    }
    next();
};

// Middleware para validar la actualización de un usuario (Contraseña Opcional)

export const validateUserUpdate = (req, res, next) => {
    const { password } = req.body;
    const errors = [];

    validateCommonFields(req, errors);

    // En la actualización, solo se valida la longitud si el usuario ingresó algo en el campo
    if (password && password.trim().length < 6) {
        errors.push("La nueva contraseña debe tener al menos 6 caracteres.");
    }

    if (errors.length > 0) {
        req.validationErrors = errors;
    }
    next();
};