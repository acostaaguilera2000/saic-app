import ServicePlatformService from "../services/ServicePlatformService.js";
import Member from "../models/Member.js";
import errorHandler from "../middlewares/error.js";

class ServicePlatformController {

    static async getAllServices(req, res) {
        try {
            const cultos = await ServicePlatformService.getAllServices();
            res.render("service-views/index", { cultos });
        } catch (err) {
            console.error("Error en ServicePlatformController.getAllServices:", err);
            errorHandler.error500(req, res, "No se pudo recuperar la agenda de cultos.");
        }
    }

    static async renderCreateForm(req, res) {
        try {
            const availableMembers = await Member.findAllActive(); 
            res.render("service-views/create", { valores: {}, miembros: availableMembers });
        } catch (err) {
            console.error("Error en ServicePlatformController.renderCreateForm:", err);
            errorHandler.error500(req, res, "Error al cargar el formulario de cultos.");
        }
    }

    static async processCreateService(req, res) {
        try {
            if (req.validationErrors) {
                const availableMembers = await Member.findAllActive();
                // Almacenamos el listado de errores en flash para que tu partial global los renderice
                req.flash('error_msg', req.validationErrors); 
                
                return res.status(400).render("service-views/create", {
                    valores: req.body, // Contiene el array 'cultos' para persistir los valores del usuario
                    miembros: availableMembers
                });
            }

            await ServicePlatformService.registerService(req.body);
            req.flash('success_msg', 'Cultos programados exitosamente en la agenda.');
            res.redirect("/service");

        } catch (err) {
            if (err.name === "BusinessValidationError") {
                const availableMembers = await Member.findAllActive();
                req.flash('error_msg', err.message);
                
                return res.status(400).render("service-views/create", {
                    valores: req.body,
                    miembros: availableMembers
                });
            }
            console.error("Error en ServicePlatformController.processCreateService:", err);
            req.flash('error_msg', 'Error inesperado al registrar los cultos.');
            res.redirect("/service/create");
        }
    }

    static async renderEditForm(req, res) {
        try {
            const { id } = req.params;
            const cultoToEdit = await ServicePlatformService.getServiceById(id);
            const availableMembers = await Member.findAllActive();

            res.render("service-views/edit", { cultoToEdit, miembros: availableMembers });
        } catch (err) {
            if (err.name === "NotFoundError") {
                req.flash('error_msg', err.message);
                return res.redirect("/service");
            }
            console.error("Error en ServicePlatformController.renderEditForm:", err);
            errorHandler.error500(req, res, "Error al recuperar los datos del culto.");
        }
    }

    static async processUpdateService(req, res) {
        const { id } = req.params;
        try {
            if (req.validationErrors) {
                const availableMembers = await Member.findAllActive();
                req.flash('error_msg', req.validationErrors);

                return res.status(400).render("service-views/edit", {
                    cultoToEdit: { ...req.body, id_culto: id },
                    miembros: availableMembers
                });
            }

            await ServicePlatformService.updateServiceInfo(id, req.body);
            req.flash('success_msg', 'Información del culto actualizada correctamente.');
            res.redirect("/service");

        } catch (err) {
            if (err.name === "BusinessValidationError" || err.name === "NotFoundError") {
                const availableMembers = await Member.findAllActive();
                req.flash('error_msg', err.message);

                return res.status(400).render("service-views/edit", {
                    cultoToEdit: { ...req.body, id_culto: id },
                    miembros: availableMembers
                });
            }
            console.error("Error en ServicePlatformController.processUpdateService:", err);
            req.flash('error_msg', 'Error interno al intentar actualizar el culto.');
            res.redirect("/service");
        }
    }

    static async deleteService(req, res) {
        try {
            const { id } = req.params;
            await ServicePlatformService.removeService(id);

            req.flash('success_msg', 'El culto ha sido removido de la agenda permanentemente.');
            res.redirect("/service");
        } catch (err) {
            if (err.name === "NotFoundError") {
                req.flash('error_msg', err.message);
                return res.redirect("/service");
            }
            console.error("Error en ServicePlatformController.deleteService:", err);
            req.flash('error_msg', 'Error al intentar eliminar el culto.');
            res.redirect("/service");
        }
    }
}

export default ServicePlatformController;