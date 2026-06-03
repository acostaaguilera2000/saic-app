import User from "../models/User.js";
import bcrypt from "bcrypt";

class ProfileService {

    /**
     * Actualiza los datos del perfil del usuario que tiene la sesión activa
     * @param {number} userId - ID del usuario logueado extraído de req.session
     * @param {Object} profileData - Nuevos datos del formulario (username, currentPassword, newPassword)
     */
    static async updateOwnProfile(userId, profileData) {
        const { username, currentPassword, newPassword } = profileData;

        // 1. Obtener los datos actuales del usuario para comparar y extraer el hash real
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            const businessError = new Error("El usuario no existe en el sistema.");
            businessError.name = "NotFoundError";
            throw businessError;
        }

        // 2. REGLA DE SEGURIDAD CRÍTICA: Validar SIEMPRE la contraseña actual antes de aplicar cualquier cambio
        if (!currentPassword || currentPassword.trim() === "") {
            const businessError = new Error("Debe ingresar su contraseña actual para poder guardar los cambios.");
            businessError.name = "BusinessValidationError";
            throw businessError;
        }

        const isMatch = await bcrypt.compare(currentPassword, currentUser.password);
        if (!isMatch) {
            const businessError = new Error("La contraseña actual ingresada es incorrecta.");
            businessError.name = "BusinessValidationError";
            throw businessError;
        }

        // 3. Regla de Negocio: Si quiere cambiar el username, verificar que no esté duplicado
        if (username && username.trim() !== currentUser.username) {
            const usernameExists = await User.findByUsername(username.trim());
            if (usernameExists) {
                const businessError = new Error("El nombre de usuario ya está en uso por otra cuenta.");
                businessError.name = "BusinessValidationError";
                throw businessError;
            }
        }

        // 4. Lógica de Contraseña Nueva: Solo si decide rellenar ese campo voluntariamente
        let hashedNewPassword = null;
        if (newPassword && newPassword.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            hashedNewPassword = await bcrypt.hash(newPassword.trim(), salt);
        }

        // 5. Persistir los cambios usando el método parcial que definimos en el modelo User
        const finalUsername = username ? username.trim() : currentUser.username;
        await User.updateSelfProfile(finalUsername, hashedNewPassword, userId);
    }
}

export default ProfileService;