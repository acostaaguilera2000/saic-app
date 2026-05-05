import bcrypt from "bcrypt";
import User from "../models/User.js";
import Miembro from "../models/Miembro.js";
import error from "../middlewares/error.js";

class UserController {

    static async list(req, res) {
        try {
            const id_sesion = req.session.user.id_usuario;
            const usuarios = await User.listUsers(id_sesion);
            res.render("users/index", { usuarios });
        } catch (err) {
            console.error("Error en list:", err);
            error.error500(req, res, "No se pudo recuperar la lista de usuarios en este momento.");
        }
    }

    static async getFormCreate(req, res) {
        try {
            const miembros = await Miembro.listMiembrosDisponibles();
            res.render("users/create", { miembros });
        } catch (err) {
            console.error("Error en getFormCreate:", err);
            error.error500(req, res, "Error al cargar el formulario de registro.");
        }
    }

    static async create(req, res) {
        try {
            const miembros = await Miembro.listMiembrosDisponibles();
            
            // Validaciones de middleware 
            if (req.validationErrors) {
                return res.status(400).render("users/create", {
                    errores: req.validationErrors,
                    miembros,
                    valores: req.body
                });
            }

            const { email, password, rol, username, id_miembro } = req.body;

            // Validar unicidad de email
            const checkEmail = await User.getByEmail(email);
            if (checkEmail.length > 0) {
                return res.status(400).render("users/create", {
                    errores: [`La dirección de correo electrónico "${email}" ya se encuentra registrada.`],
                    miembros,
                    valores: req.body
                });
            }

            // Validar unicidad de username
            if (username && username.trim() !== "") {
                const checkUsername = await User.getByUsername(username);
                if (checkUsername.length > 0) {
                    return res.status(400).render("users/create", {
                        errores: [`El nombre de usuario "${username}" ya está en uso. Por favor, elija otro.`],
                        miembros,
                        valores: req.body
                    });
                }
            }

            const finalUsername = username && username.trim() !== "" ? username : email.split("@")[0];
            const hashedPassword = await bcrypt.hash(password, 10);

            await User.create({
                email,
                password: hashedPassword,
                rol,
                username: finalUsername,
                id_miembro: id_miembro || null,
            });

            req.flash('success_msg', 'Usuario creado y registrado exitosamente.');
            res.redirect("/users");
        } catch (err) {
            console.error("Error en create:", err);
            req.flash('error_msg', 'Ocurrió un error inesperado al crear el usuario.');
            res.redirect("/users/create");
        }
    }

    static async getFormEdit(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                req.flash('error_msg', 'El identificador de usuario no es válido.');
                return res.redirect("/users");
            }

            const userToEdit = await User.getById(id);
            if (!userToEdit) {
                req.flash('error_msg', 'No se encontró el usuario solicitado.');
                return res.redirect("/users");
            }

            const miembros = await Miembro.listMiembrosDisponibles();
            res.render("users/edit", { userToEdit, miembros });
        } catch (err) {
            console.error("Error en getFormEdit:", err);
            error.error500(req, res, "Error al cargar la información del usuario.");
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const user = await User.getById(id);
            const miembros = await Miembro.listMiembrosDisponibles();

            if (!user) {
                req.flash('error_msg', 'El usuario que intenta actualizar no existe.');
                return res.redirect("/users");
            }

            if (req.validationErrors) {
                return res.status(400).render("users/edit", {
                    errores: req.validationErrors,
                    userToEdit: user,
                    miembros
                });
            }

            const { username, email, password, rol, id_miembro } = req.body;
            const updates = {};

            // Validaciones de unicidad en actualización
            if (email && email !== user.email) {
                const checkEmail = await User.getByEmail(email);
                if (checkEmail.length > 0) {
                    return res.status(400).render("users/edit", {
                        errores: ["El correo electrónico ya pertenece a otra cuenta."],
                        userToEdit: user,
                        miembros
                    });
                }
                updates.email = email;
            }

            if (username && username !== user.username) {
                const checkUser = await User.getByUsername(username);
                if (checkUser.length > 0) {
                    return res.status(400).render("users/edit", {
                        errores: ["El nombre de usuario ya está asociado a otra cuenta."],
                        userToEdit: user,
                        miembros
                    });
                }
                updates.username = username;
            }

            updates.rol = rol || user.rol;
            updates.id_miembro = id_miembro && id_miembro !== "" ? id_miembro : user.id_miembro;

            if (password && password.trim() !== "") {
                updates.password = await bcrypt.hash(password, 10);
            } else {
                updates.password = user.password;
            }

            await User.update(updates, id);
            req.flash('success_msg', 'Información de usuario actualizada correctamente.');
            res.redirect("/users");
        } catch (err) {
            console.error("Error en update:", err);
            req.flash('error_msg', 'Error interno al intentar actualizar el registro.');
            res.redirect("/users");
        }
    }

    static async Delete(req, res) {
        try {
            const { id } = req.params;
            const user = await User.getById(id);

            if (!user) {
                req.flash('error_msg', 'El registro que intenta eliminar no existe.');
                return res.redirect("/users");
            }

            if (user.id_miembro) {
                req.flash('error_msg', `No se puede eliminar a "${user.username}" porque tiene un perfil de miembro vinculado.`);
                return res.redirect("/users");
            }

            await User.Delete(id);
            req.flash('success_msg', 'Usuario eliminado exitosamente.');
            res.redirect("/users");
        } catch (err) {
            console.error("Error en Delete:", err);
            req.flash('error_msg', 'Error al intentar procesar la eliminación del registro.');
            res.redirect("/users");
        }
    }

    // Funciones perfil del usuario logueado
    static async renderProfile(req, res) {
        try {
            const userId = req.session.user.id_usuario;
            const userData = await User.getById(userId);

            if (!userData) {
                return res.redirect('/dashboard');
            }

            res.render('users/profile', {
                user: userData,
                title: 'Mi Perfil - SAIC'
            });
        } catch (err) {
            console.error("Error en renderProfile:", err);
            res.status(500).send("Error al cargar su perfil personal.");
        }
    }

    static async updateProfile(req, res) {
        const userId = req.session.user.id_usuario;
        const { username, newPassword, confirmPassword } = req.body;
        let errores = [];

        try {
            const userData = await User.getById(userId);

            // Validaciones básicas de perfil
            if (!username || username.trim() === '') {
                errores.push('El nombre de usuario no puede estar vacío.');
            }

            let hashedPassword = null;
            if (newPassword || confirmPassword) {
                if (newPassword !== confirmPassword) {
                    errores.push('Las nuevas contraseñas no coinciden.');
                } else if (newPassword.length < 6) {
                    errores.push('La contraseña debe tener al menos 6 caracteres.');
                } else {
                    hashedPassword = await bcrypt.hash(newPassword, 10);
                }
            }

            if (errores.length > 0) {
                return res.render('users/profile', {
                    user: { ...userData, username },
                    errores,
                    title: 'Mi Perfil - SAIC'
                });
            }

            const updateData = {
                id_usuario: userId,
                username: username,
                password: hashedPassword
            };

            await User.updateProfileInfo(updateData);
            req.session.user.username = username;

            req.flash('success_msg', '¡Su perfil ha sido actualizado exitosamente!');
            res.redirect('/users/profile');

        } catch (err) {
            console.error("Error en updateProfile:", err);
            req.flash('error_msg', 'Ocurrió un error inesperado al actualizar sus datos.');
            res.redirect('/users/profile');
        }
    }
}

export default UserController;