import bcrypt from "bcrypt";
import User from "../models/User.js";
import error from "../middlewares/error.js";

class AuthController {

    static getFormLogin(req, res) {
        return res.render("login")
    }

    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.getOne(username);
            console.log(user);

            if (!user || user.length === 0) {
                return res.render("login", { error: `El usuario ${username} no existe` })
            }

            let isMatch = await bcrypt.compare(password, user.password)
            console.log("Resultado de bcrypt.compare:", isMatch);

            if (!isMatch) {
                return res.render("login", { error: "Contraseña Incorrecta" })
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