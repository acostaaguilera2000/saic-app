import AuthService from "../services/AuthService.js";
import errorHandler from "../middlewares/error.js";

class AuthController {

    static renderLoginForm(req, res) {
        return res.render("login", { error: null });
    }

    static async processLogin(req, res) {
        try {
            const { email, password } = req.body;
            const authenticatedUser = await AuthService.authenticateUser(email, password);

            // Guardamos los datos del usuario en la sesión express-session
            req.session.user = authenticatedUser;
            
            return res.redirect("/dashboard");

        } catch (err) {
            // Si las credenciales fallan, capturamos el error de negocio y notificamos en la UI
            if (err.name === "AuthenticationError") {
                return res.render("login", { error: err.message, valores: req.body  });
            }
            
            // Si ocurre una falla del servidor o base de datos, disparamos el error genérico 500
            console.error("Critical failure in AuthController.processLogin:", err);
            errorHandler.error500(req, res, err);
        }
    }

    static processLogout(req, res) {
        req.session.destroy(err => {
            if (err) {
                console.error("Error destroying active session in AuthController.processLogout:", err);
                return res.redirect("/dashboard");
            }
            // Limpieza del identificador de la cookie de sesión de Express
            res.clearCookie("connect.sid");
            res.redirect("/auth/login");
        });
    }
}

export default AuthController;