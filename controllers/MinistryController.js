import Ministry from "../models/ministry.js";
import MinistryService from "../services/MinistryService.js";
import errorHandler from "../middlewares/error.js";

class MinistryController {

    // Recupera y despliega la lista global de ministerios en el sistema

    static async getAllMinistries(req, res) {
        try {
            // Invocación del servicio encargado de recopilar el listado de ministerios
            const ministries = await MinistryService.getMinistriesDashboard();

            // Mantiene el envío de la variable 'datos' en español para la vista index.pug
            res.render("ministries-views/index", { datos: ministries });
        } catch (err) {
            console.error("Error in MinistryController.getAllMinistries:", err);
            errorHandler.error500(req, res, "No se pudo recuperar la lista de ministerios en este momento.");
        }
    }

    // Recupera el detalle completo de un ministerio, sus integrantes y los candidatos aptos
    static async getMinistryDetails(req, res) {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                req.flash("error_msg", "El identificador del ministerio no es válido.");
                return res.redirect("/ministries");
            }

            // Invocación del servicio encargado de consolidar los miembros y candidatos disponibles
            const ministryDetails = await MinistryService.getMinistryDetails(Number(id));
            if (!ministryDetails) {
                req.flash("error_msg", "No se encontró el ministerio solicitado.");
                return res.redirect("/ministries");
            }

            // Pasa la variable exacta 'datos' requerida por la vista detail.pug
            res.render("ministries-views/detail", { datos: ministryDetails });
        } catch (err) {
            console.error("Error in MinistryController.getMinistryDetails:", err);
            errorHandler.error500(req, res, "Error al cargar la información detallada del ministerio.");
        }
    }

    // Procesa el registro de un nuevo ministerio evaluando el estado de las validaciones
    static async processCreateMinistry(req, res) {
        try {
            // Si el middleware de validación sintáctica detectó errores, frena el flujo
            if (req.validationErrors) {
                const ministries = await MinistryService.getMinistriesDashboard();
                return res.status(400).render("ministries-views/index", {
                    errores: req.validationErrors,
                    datos: ministries,
                    valores: req.body
                });
            }

            // Delega el flujo a la capa de servicios con las reglas de negocio
            await MinistryService.createMinistry(req.body);

            req.flash("success_msg", "Ministerio registrado exitosamente en el sistema.");
            res.redirect("/ministries");
        } catch (err) {
            if (err.name === "BusinessValidationError") {
                const ministries = await MinistryService.getMinistriesDashboard();
                return res.status(400).render("ministries-views/index", {
                    errores: [err.message],
                    datos: ministries,
                    valores: req.body
                });
            }
            console.error("Error in MinistryController.processCreateMinistry:", err);
            req.flash("error_msg", "Ocurrió un error inesperado al registrar el ministerio.");
            res.redirect("/ministries");
        }
    }

    //Procesa la vinculación relacional de un miembro con un ministerio específico

    static async processAddMember(req, res) {
        const { id_ministerio, id_miembro } = req.body;
        try {
            // Invocación del servicio encargado de aplicar las reglas de asignación relacional
            await MinistryService.assignMemberToMinistry(Number(id_miembro), Number(id_ministerio));

            req.flash("success_msg", "Miembro asignado al ministerio correctamente.");
            res.redirect(`/ministries/${id_ministerio}`);
        } catch (err) {
            if (err.name === "BusinessValidationError" || err.name === "NotFoundError") {
                req.flash("error_msg", err.message);
                return res.redirect(`/ministries/${id_ministerio}`);
            }
            console.error("Error in MinistryController.processAddMember:", err);
            req.flash("error_msg", "Error interno al intentar asignar el miembro al ministerio.");
            res.redirect("/ministries");
        }
    }

    // Rompe el vínculo relacional entre un integrante y su ministerio asignado

    static async processRemoveMember(req, res) {
        const { id_ministerio, id_miembro } = req.body;
        try {
            // Invocación del servicio encargado de revocar el acceso del miembro al ministerio
            await MinistryService.removeMemberFromMinistry(Number(id_miembro), Number(id_ministerio));

            req.flash("success_msg", "Miembro desvinculado del ministerio correctamente.");
            res.redirect(`/ministries/${id_ministerio}`);
        } catch (err) {
            console.error("Error in MinistryController.processRemoveMember:", err);
            req.flash("error_msg", "No se pudo desvincular al miembro en este momento.");
            res.redirect(`/ministries/${id_ministerio}`);
        }
    }
}

export default MinistryController;