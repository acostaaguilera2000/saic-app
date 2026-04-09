import bcrypt from "bcrypt";
import User from "../models/User.js";
import error from "../middlewares/error.js";

class AuthController {

    static getFormLogin(req, res) {
        return res.render("login")
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const users = await User.getByEmail(email); // devuelve un array
            console.log(users);

            if (!users || users.length === 0) {
                return res.render("login", { error: `El usuario ${email} no existe` });
            }

            const user = users[0]; // primer registro

            const isMatch = await bcrypt.compare(password, user.password);
            console.log("Resultado de bcrypt.compare:", isMatch);

            if (!isMatch) {
                return res.render("login", { error: "Contraseña Incorrecta" });
            }

         
            req.session.user = user;
            res.redirect("/dashboard");

        } catch (err) {
            error.error500(req, res, err);
        }
    }


    static logOut(req, res) {
        req.session.destroy(err => {
            if (err) {
                console.error("Error al destruir la sesión:", err);
                return res.redirect("/dashboard");
            }
            res.clearCookie("connect.sid");
            res.redirect("/auth/login");
        });
    }
}


export default AuthController;