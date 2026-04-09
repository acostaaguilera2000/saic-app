export const validateUpdateUser = (req, res, next) => {
    const { username, email, password, rol } = req.body;
    const errores = [];

    // Email siempre debe ser válido si se envía
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errores.push("El email no tiene un formato válido.");
    }

    // Username opcional, pero si llega debe tener mínimo 3 caracteres
    if (username && username.length < 3) {
        errores.push("El username debe tener al menos 3 caracteres.");
    }

    // Password opcional, pero si llega debe tener mínimo 6 caracteres
    if (password && password.length < 6) {
        errores.push("La contraseña debe tener al menos 6 caracteres.");
    }

    // Rol obligatorio en update si se envía
    const rolesPermitidos = ["admin", "tesorero", "lider", "miembro"];
    if (rol && !rolesPermitidos.includes(rol)) {
        errores.push("El rol seleccionado no es válido.");
    }

    // Si hay errores, devolver respuesta
    if (errores.length > 0) {
        req.validationErrors = errores;
    }


    next();
}
