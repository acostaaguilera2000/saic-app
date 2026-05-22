import Miembro from "../models/Miembro.js";
import error from "../middlewares/error.js";
import db from "../config/db.js";

class MiembroController {

    // Listar todos los miembros activos
    static async list(req, res) {
        try {
            const miembros = await Miembro.listActive();
            res.render("members/index", { miembros });
        } catch (err) {
            console.error("Error en MiembroController.list:", err);
            error.error500(req, res, "No se pudo recuperar la lista de miembros en este momento.");
        }
    }

    // Renderizar formulario de creación
    static async getFormCreate(req, res) {
        try {
            res.render("members/create", { valores: {} });
        } catch (err) {
            console.error("Error en getFormCreate:", err);
            error.error500(req, res, "Error al cargar el formulario de registro de miembros.");
        }
    }

    // Procesar inserción del miembro (CON VALIDACIÓN DE MIDDLEWARE)
    static async create(req, res) {
        try {
            // EVALUACIÓN DE ERRORES DEL MIDDLEWARE (validateMiembro)
            if (req.validationErrors) {
                return res.status(400).render("members/create", {
                    errores: req.validationErrors,
                    valores: req.body // Mantiene los datos capturados en los inputs
                });
            }

            const { nombre, apellido, documento, fecha_registro, fecha_bautismo } = req.body;

            // Validar unicidad de documento de identidad en la Base de Datos
            const checkDocumento = await Miembro.getByDocumento(documento);
            if (checkDocumento.length > 0) {
                return res.status(400).render("members/create", {
                    errores: [`El documento de identidad "${documento}" ya se encuentra registrado.`],
                    valores: req.body
                });
            }

            await Miembro.create({
                nombre,
                apellido,
                documento,
                fecha_registro,
                fecha_bautismo
            });

            req.flash('success_msg', 'Miembro registrado exitosamente en el sistema.');
            res.redirect("/members");
        } catch (err) {
            console.error("Error en MiembroController.create:", err);
            req.flash('error_msg', 'Ocurrió un error inesperado al registrar el miembro.');
            res.redirect("/members/create");
        }
    }

    // Renderizar formulario de edición
    static async getFormEdit(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                req.flash('error_msg', 'El identificador del miembro no es válido.');
                return res.redirect("/members");
            }

            const miembroToEdit = await Miembro.getById(id);
            if (!miembroToEdit) {
                req.flash('error_msg', 'No se encontró el miembro solicitado.');
                return res.redirect("/members");
            }

            res.render("members/edit", { miembroToEdit });
        } catch (err) {
            console.error("Error en getFormEdit:", err);
            error.error500(req, res, "Error al cargar la información del miembro.");
        }
    }

    // Procesar actualización de datos (CON VALIDACIÓN DE MIDDLEWARE)
    static async update(req, res) {
        try {
            const { id } = req.params;
            const miembro = await Miembro.getById(id);

            if (!miembro) {
                req.flash('error_msg', 'El miembro que intenta actualizar no existe.');
                return res.redirect("/members");
            }

            // EVALUACIÓN DE ERRORES DEL MIDDLEWARE (validateMiembroUpdate)
            if (req.validationErrors) {
                return res.status(400).render("members/edit", {
                    errores: req.validationErrors,
                    // Fusionamos los datos antiguos con los nuevos enviados para no perder el estado visual
                    miembroToEdit: { ...miembro, ...req.body, id_miembro: id }
                });
            }

            const { nombre, apellido, documento, fecha_registro, fecha_bautismo } = req.body;
            const updates = {
                nombre: nombre || miembro.nombre,
                apellido: apellido || miembro.apellido,
                fecha_registro: fecha_registro || miembro.fecha_registro,
                fecha_bautismo: fecha_bautismo || miembro.fecha_bautismo
            };

            // Validar unicidad del documento si es que cambió
            if (documento && documento !== miembro.documento) {
                const checkDocumento = await Miembro.getByDocumento(documento);
                if (checkDocumento.length > 0) {
                    return res.status(400).render("members/edit", {
                        errores: ["El documento de identidad ya pertenece a otro miembro registrado."],
                        miembroToEdit: { ...miembro, ...req.body, id_miembro: id }
                    });
                }
                updates.documento = documento;
            } else {
                updates.documento = miembro.documento;
            }

            await Miembro.update(updates, id);
            req.flash('success_msg', 'Información del miembro actualizada correctamente.');
            res.redirect("/members");
        } catch (err) {
            console.error("Error en MiembroController.update:", err);
            req.flash('error_msg', 'Error interno al intentar actualizar el registro del miembro.');
            res.redirect("/members");
        }
    }

    // Procesar eliminación lógica del miembro
    static async Delete(req, res) {
        try {
            const { id } = req.params;
            const miembro = await Miembro.getById(id);

            if (!miembro) {
                req.flash('error_msg', 'El miembro que intenta eliminar no existe.');
                return res.redirect("/members");
            }

            // Validar si el miembro está vinculado a un usuario antes de la baja
            const [userLinked] = await db.query("SELECT id_usuario FROM usuario WHERE id_miembro = ?", [id]);
            if (userLinked && userLinked.length > 0) {
                req.flash('error_msg', `No se puede eliminar a este miembro porque tiene una cuenta de usuario activa en el sistema.`);
                return res.redirect("/members");
            }

            await Miembro.deleteLogical(id);
            req.flash('success_msg', 'Miembro dado de baja del sistema exitosamente.');
            res.redirect("/members");
        } catch (err) {
            console.error("Error en MiembroController.Delete:", err);
            req.flash('error_msg', 'Error al intentar procesar la eliminación del miembro.');
            res.redirect("/members");
        }
    }
}

export default MiembroController;