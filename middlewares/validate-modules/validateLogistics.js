/**
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {void}
 */
const validateLogistics = (req, res, next) => {
    const errores = [];
    const { id_sonido, id_multimedia, id_aseo, observaciones } = req.body;

    // Validaciones de tipos de datos para los selectores
    if (id_sonido && isNaN(Number(id_sonido))) errores.push("El encargado de sonido seleccionado no es válido.");
    if (id_multimedia && isNaN(Number(id_multimedia))) errores.push("El encargado de multimedia seleccionado no es válido.");
    if (id_aseo && isNaN(Number(id_aseo))) errores.push("El encargado de aseo seleccionado no es válido.");

    if (observaciones && observaciones.length > 500) {
        errores.push("Las observaciones son demasiado extensas (máximo 500 caracteres).");
    }

    if (errores.length > 0) {
        req.validationErrors = errores;
    }

    next();
};

export default validateLogistics;