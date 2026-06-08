/**
 * Middleware de validación y sanitización monetaria colombiana
 */
const validateDonationInput = (req, res, next) => {
    let { procedencia, id_miembro, nombre_externo, monto, fecha } = req.body;
    const errors = [];

    if (!monto || monto.trim() === '') {
        errors.push("El monto de la transacción es obligatorio.");
    } else {
        // 🇨🇴 SOLUCIÓN AL PUNTO DE MILES:
        // Si el usuario escribe "5.000", removemos el punto para convertirlo en "5000"
        // Si escribe "5.000.50", lo transforma en "5000.50" (respetando centavos si los hay)
        let montoSanitizado = monto.replace(/\.(?=\d{3}(\D|$))/g, ""); 
        
        // Por si usó comas como separador de miles
        montoSanitizado = montoSanitizado.replace(/,/g, ""); 

        const valorNumerico = parseFloat(montoSanitizado);

        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            errors.push("El monto debe ser un valor numérico válido y mayor a cero.");
        } else {
            // Reemplazamos el valor crudo en el req.body por el número limpio para el servicio
            req.body.monto = valorNumerico;
        }
    }

    if (!fecha || fecha.trim() === '') {
        errors.push("La fecha de registro del ingreso financiero es requerida.");
    }

    if (procedencia === 'interno') {
        if (!id_miembro || id_miembro.trim() === '') {
            errors.push("Debe seleccionar un miembro válido de la lista.");
        }
    } else if (procedencia === 'externo') {
        if (!nombre_externo || nombre_externo.trim() === '') {
            errors.push("El nombre completo o razón social del donante externo es obligatorio.");
        }
    } else {
        errors.push("El tipo de procedencia seleccionado no es válido.");
    }

    req.validationErrors = errors;
    next();
};

export { validateDonationInput };