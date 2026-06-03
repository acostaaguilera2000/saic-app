import ProfileService from "../services/ProfileService.js";
import User from "../models/User.js";
import errorHandler from "../middlewares/error.js";

class ProfileController {

    static async renderProfile(req, res) {
        try {
            const userId = req.session.user.id_usuario;
            const userProfile = await User.findById(userId);

            res.render("profile-views/index", { user: userProfile, errores: null });
        } catch (err) {
            console.error("Error in ProfileController.renderProfile:", err);
            errorHandler.error500(req, res, "No se pudo cargar la información de su perfil.");
        }
    }

    static async processUpdateProfile(req, res) {
        try {
            const userId = req.session.user.id_usuario;

            // Si el middleware de validación sintáctica capturó errores previos
            if (req.validationErrors) {
                const userProfile = await User.findById(userId);
                return res.status(400).render("profile-views/index", {
                    errores: req.validationErrors,
                    user: userProfile
                });
            }

            // Delegamos al servicio de perfil
            await ProfileService.updateOwnProfile(userId, req.body);

            // Actualizamos sutilmente los datos en la sesión para que el header refleje el cambio de username de inmediato
            req.session.user.username = req.body.username.trim();

            req.flash('success_msg', 'Tu perfil ha sido actualizado correctamente.');
            res.redirect("/profile");

        } catch (err) {
            if (err.name === "BusinessValidationError" || err.name === "NotFoundError") {
                const userId = req.session.user.id_usuario;
                const userProfile = await User.findById(userId);
                return res.status(400).render("profile-views/index", {
                    errores: [err.message],
                    user: userProfile
                });
            }
            console.error("Error in ProfileController.processUpdateProfile:", err);
            errorHandler.error500(req, res, "Ocurrió un error interno al actualizar el perfil.");
        }
    }
}

export default ProfileController;