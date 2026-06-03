import UserService from "../services/UserService.js";
import User from "../models/User.js";
import Member from "../models/Member.js";
import errorHandler from "../middlewares/error.js";

class UserController {

    static async getAllUsers(req, res) {
        try {
            const activeSessionId = req.session.user.id_usuario;
            const users = await UserService.getManageableUsers(activeSessionId);

            res.render("users-views/index", { usuarios: users, });
        } catch (err) {
            console.error("Error in UserController.getAllUsers:", err);
            errorHandler.error500(req, res, "No se pudo recuperar la lista de usuarios.");
        }
    }

    static async renderCreateForm(req, res) {
        try {
            // Buscamos miembros aptos desde el modelo Member que ya migramos
            const availableMembers = await Member.findAvailableMembers();
            res.render("users-views/create", { valores: {}, errores: null, availableMembers });
        } catch (err) {
            console.error("Error in UserController.renderCreateForm:", err);
            errorHandler.error500(req, res, "Error al cargar el formulario de registro.");
        }
    }

    static async processCreateUser(req, res) {
        try {
            if (req.validationErrors) {
                const availableMembers = await Member.findAvailableMembers();
                return res.status(400).render("users-views/create", {
                    errores: req.validationErrors,
                    valores: req.body,
                    availableMembers
                });
            }

            await UserService.registerUser(req.body);
            req.flash('success_msg', 'Usuario registrado exitosamente.');
            res.redirect("/users");

        } catch (err) {
            if (err.name === "BusinessValidationError") {
                const availableMembers = await Member.findAvailableMembers();
                return res.status(400).render("users-views/create", {
                    errores: [err.message],
                    valores: req.body,
                    availableMembers
                });
            }
            console.error("Error in UserController.processCreateUser:", err);
            req.flash('error_msg', 'Error inesperado al registrar el usuario.');
            res.redirect("/users/create");
        }
    }

    static async renderEditForm(req, res) {
        try {
            const { id } = req.params;
            const userToEdit = await User.findById(id);

            if (!userToEdit) {
                req.flash('error_msg', 'El usuario solicitado no existe.');
                return res.redirect("/users");
            }

            // Para la edición, también pasamos la lista de miembros disponibles por si decide cambiarlo
            const availableMembers = await Member.findAvailableMembers();
            res.render("users-views/edit", { userToEdit, errores: null, availableMembers });
        } catch (err) {
            console.error("Error in UserController.renderEditForm:", err);
            errorHandler.error500(req, res, "Error al cargar los datos del usuario.");
        }
    }

    static async processUpdateUser(req, res) {
        const { id } = req.params;
        try {
            if (req.validationErrors) {
                const availableMembers = await Member.findAvailableMembers();
                return res.status(400).render("users-views/edit", {
                    errores: req.validationErrors,
                    userToEdit: { ...req.body, id_usuario: id },
                    availableMembers
                });
            }

            await UserService.updateAdministrativeUser(id, req.body);
            req.flash('success_msg', 'Usuario actualizado correctamente.');
            res.redirect("/users");

        } catch (err) {
            if (err.name === "BusinessValidationError" || err.name === "NotFoundError") {
                const availableMembers = await Member.findAvailableMembers();
                return res.status(400).render("users-views/edit", {
                    errores: [err.message],
                    userToEdit: { ...req.body, id_usuario: id },
                    availableMembers
                });
            }
            console.error("Error in UserController.processUpdateUser:", err);
            req.flash('error_msg', 'Error interno al intentar actualizar el usuario.');
            res.redirect("/users");
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await UserService.deleteUserAccount(id);

            req.flash('success_msg', 'Cuenta de usuario eliminada de forma permanente.');
            res.redirect("/users");
        } catch (err) {
            if (err.name === "NotFoundError") {
                req.flash('error_msg', err.message);
                return res.redirect("/users");
            }
            console.error("Error in UserController.deleteUser:", err);
            req.flash('error_msg', 'Error al intentar eliminar el usuario.');
            res.redirect("/users");
        }
    }
}

export default UserController;



