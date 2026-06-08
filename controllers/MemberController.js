import Member from "../models/Member.js";
import MemberService from "../services/MemberService.js";
import errorHandler from "../middlewares/error.js";

class MemberController {

    // Recupera y despliega la lista global de miembros en el sistema
    static async getAllMembers(req, res) {
        try {
            const members = await Member.findAll();
            // Mantiene el envío de la variable 'miembros' para la vista index.pug
            res.render("members-views/index", { miembros: members });
        } catch (err) {
            console.error("Error in MemberController.getAllMembers:", err);
            errorHandler.error500(req, res, "No se pudo recuperar la lista de miembros en este momento.");
        }
    }


    static renderCreateForm(req, res) {
        res.render("members-views/create", { valores: {}, errores: null });
    }

    static async processCreateMember(req, res) {
        try {
            // Si el middleware de validación sintáctica detectó errores, frena el flujo
            if (req.validationErrors) {
                return res.status(400).render("members-views/create", {
                    errores: req.validationErrors,
                    valores: req.body
                });
            }

            // Delega el flujo a la capa de servicios con las reglas de negocio
            await MemberService.createNewMember(req.body);

            req.flash('success_msg', 'Miembro registrado exitosamente en el sistema.');
            res.redirect("/members");
        } catch (err) {
            if (err.name === "BusinessValidationError") {
                return res.status(400).render("members-views/create", {
                    errores: [err.message],
                    valores: req.body
                });
            }
            console.error("Error in MemberController.processCreateMember:", err);
            req.flash('error_msg', 'Ocurrió un error inesperado al registrar el miembro.');
            res.redirect("/members/create");
        }
    }


    static async renderEditForm(req, res) {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                req.flash('error_msg', 'El identificador del miembro no es válido.');
                return res.redirect("/members");
            }

            // Busca al miembro por su ID único utilizando el modelo
            const memberToEdit = await Member.findById(id);
            if (!memberToEdit) {
                req.flash('error_msg', 'No se encontró el miembro solicitado.');
                return res.redirect("/members");
            }

            // Pasa la variable exacta 'miembroToEdit' requerida por la vista edit.pug
            res.render("members-views/edit", { miembroToEdit: memberToEdit, errores: null });
        } catch (err) {
            console.error("Error in MemberController.renderEditForm:", err);
            errorHandler.error500(req, res, "Error al cargar la información del miembro.");
        }
    }


    static async processUpdateMember(req, res) {
        const { id } = req.params;
        try {
            // Si el validador detiene la petición, renderizamos manteniendo la data 
            if (req.validationErrors) {
                return res.status(400).render("members-views/edit", {
                    errores: req.validationErrors,
                    // Fusionamos el req.body con el ID para no romper los inputs del formulario
                    miembroToEdit: { ...req.body, id_miembro: id }
                });
            }

            // Envía la actualización a la capa de servicios con el req.body intacto 
            await MemberService.updateMemberDetails(id, req.body);

            req.flash('success_msg', 'Información del miembro actualizada correctamente.');
            res.redirect("/members");
        } catch (err) {
            if (err.name === "BusinessValidationError" || err.name === "NotFoundError") {
                return res.status(400).render("members-views/edit", {
                    errores: [err.message],
                    miembroToEdit: { ...req.body, id_miembro: id }
                });
            }
            console.error("Error in MemberController.processUpdateMember:", err);
            req.flash('error_msg', 'Error interno al intentar actualizar el registro del miembro.');
            res.redirect("/members");
        }
    }


    static async toggleMemberStatus(req, res) {
        try {
            const { id } = req.params;

            // 1. Buscamos el miembro para saber cuál es su estado actual
            const member = await Member.findById(id);
            if (!member) {
                req.flash("error_msg", "El miembro especificado no existe.");
                return res.redirect("/members");
            }

            // 2. Invertimos el valor numérico 
            const newStatus = member.activo === 1 ? 0 : 1;

            // 3. Mandamos la actualización a la base de datos
            await Member.updateStatus(id, newStatus);

            req.flash("success_msg", "Estado del miembro actualizado con éxito.");
            res.redirect("/members");

        } catch (err) {
            console.error("Error in MemberController.toggleMemberStatus:", err);
            errorHandler.error500(req, res, "No se pudo alterar el estado de activación del miembro.");
        }
    }
}

export default MemberController;