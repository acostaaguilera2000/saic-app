import bcrypt from "bcrypt";
import User from "../models/User.js";
import Miembro from "../models/Miembro.js";
import error from "../middlewares/error.js";

class UserController {

    static async list(req, res) {
        try {
            const usuarios = await User.listUsers();
            res.render("users/index", { usuarios });
        } catch (err) {
            error.error500(req, res, err)
        }
    }

    static async getFormCreate(req, res) {
        try {
            const miembros = await Miembro.listMiembrosDisponibles();
            res.render("users/create", { miembros })
        } catch (err) {
            error.error500(req, res, err)
        }
    }

    static async create(req, res) {
        try {
            if (req.validationErrors) {
                const miembros = await Miembro.listMiembrosDisponibles();
                return res.status(400).render("users/create", {
                    errores: req.validationErrors,
                    miembros,
                });
            }

            const { email, password, rol, username, id_miembro } = req.body;

            // Validar email para que no se repita
            const checkEmail = await User.getByEmail(email);
            if (checkEmail.length > 0) {
                const miembros = await Miembro.listMiembrosDisponibles();
                return res.status(400).render("users/create", {
                    errores: [`El email ${email} ya se encuentra asociado a un usuario`],
                    miembros,
                });
            }

            // Validar username si viene definido
            if (username && username.trim() !== "") {
                const checkUsername = await User.getByUsername(username);
                if (checkUsername.length > 0) {
                    const miembros = await Miembro.listMiembrosDisponibles();
                    return res.status(400).render("users/create", {
                        errores: [`El username "${username}" ya está en uso, por favor elige otro`],
                        miembros,
                    });
                }
            }

            // Generar username si no viene
            const finalUsername =
                username && username.trim() !== "" ? username : email.split("@")[0];

            const hashedPassword = await bcrypt.hash(password, 10);

            await User.create({
                email,
                password: hashedPassword,
                rol,
                username: finalUsername,
                id_miembro: id_miembro || null,
            });

            res.redirect("/users");
        } catch (err) {
            error.error500(req, res, err);
        }
    }


    static async getFormEdit(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return error.error400(req, res, { message: "El ID proporcionado no es válido." });
            }


            const userToEdit = await User.getById(id);
            if (!userToEdit) {
                return error.error400(req, res, { message: "Usuario no encontrado." });
            }

            const miembros = await Miembro.listMiembrosDisponibles();
            res.render("users/edit", { userToEdit, miembros });

        } catch (err) {
            error.error500(req, res, err);
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;

            // 1. Validar ID
            if (!id || isNaN(Number(id))) {
                return error.error400(req, res, { message: "El ID proporcionado no es válido." });
            }

            // 2. Buscar usuario actual
            const user = await User.getById(id);
            if (!user) {
                return error.error404(req, res);
            }

            // 3. Obtener lista de miembros disponibles (para renderizar en caso de error)
            const miembros = await Miembro.listMiembrosDisponibles();

            // 4. Validaciones previas (middleware puede haber puesto errores)
            if (req.validationErrors) {
                return res.status(400).render("users/edit", {
                    errores: req.validationErrors,
                    userToEdit: user,
                    miembros
                });
            }

            // 5. Preparar datos a actualizar
            const { username, email, password, rol, id_miembro } = req.body;
            const updates = {};

            if (username && username.trim() !== "") updates.username = username;
            if (email && email.trim() !== "") updates.email = email;
            if (rol) updates.rol = rol;

            // Relación con miembro: mantener si no llega nada
            updates.id_miembro = id_miembro && id_miembro !== "" ? id_miembro : user.id_miembro;

            // 6. Validar unicidad de email
            if (email && email !== user.email) {
                const checkEmail = await User.getByEmail(email);
                if (checkEmail.length > 0) {
                    return res.status(400).render("users/edit", {
                        errores: ["El email ya está asociado a otro usuario"],
                        userToEdit: user,
                        miembros
                    });
                }
            }

            // 7. Validar unicidad de username
            if (username && username !== user.username) {
                const checkUser = await User.getByUsername(username);
                if (checkUser.length > 0) {
                    return res.status(400).render("users/edit", {
                        errores: ["El nombre de usuario ya está asociado a otro usuario"],
                        userToEdit: user,
                        miembros
                    });
                }
            }

            // 8. Manejo de contraseña
            if (password && password.trim() !== "") {
                const salt = await bcrypt.genSalt(10);
                updates.password = await bcrypt.hash(password, salt);
            } else {
                updates.password = user.password; // mantener la actual
            }

            // 9. Actualizar datos en BD
            await User.update(updates, id);

            // 10. Redirigir a la lista
            return res.status(200).redirect("/users");

        } catch (err) {
            return error.error500(req, res, err);
        }
    }


    static async Delete(req, res) {
        try {
            const { id } = req.params;

            // 1. Validación rápida de entrada
            if (!id || isNaN(Number(id))) {
                return res.status(400).render("users/index", {
                    errores: ["El ID de usuario no es válido."],
                    usuarios: await User.listUsers()
                });
            }

            // 2. Obtener el usuario y verificar existencia
            const user = await User.getById(id);

            if (!user) {
                return res.status(404).render("users/index", {
                    errores: ["El usuario que intenta eliminar ya no existe."],
                    usuarios: await User.listUsers()
                });
            }

            // 3. Verificación 
            if (user.id_miembro) {
                return res.status(400).render("users/index", {
                    errores: [`No se puede eliminar a "${user.username}": tiene un perfil de miembro vinculado.`],
                    usuarios: await User.listUsers()
                });
            }

            // 4. Ejecución del borrado
            await User.Delete(id);

           
            res.redirect("/users");

        } catch (err) {
            console.error("Error en Delete User:", err);
            return error.error500(req, res, err);
        }
    }

}


export default UserController; 