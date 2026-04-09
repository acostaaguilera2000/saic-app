// middlewares/validateUser.js
export const validateUser = (req, res, next) => {
  const { email, password, rol, id_miembro } = req.body;
  const errors = [];

  // Validar email con regex básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Debe ingresar un email válido.");
  }

  // Validar password
  if (!password || password.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres.");
  }

  // Validar rol
  const rolesPermitidos = ["admin", "tesorero", "lider", "miembro"];
  if (!rol || !rolesPermitidos.includes(rol)) {
    errors.push("Debe seleccionar un rol válido.");
  }

  // Validar id_miembro (opcional, pero debe ser número si viene)
  if (id_miembro && isNaN(Number(id_miembro))) {
    errors.push("El miembro asociado debe ser un número válido.");
  }

  // Si hay errores, devolver respuesta
  if (errors.length > 0) {
    req.validationErrors = errors;
  }

  next();
};
