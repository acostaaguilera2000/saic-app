// src/controllers/CultoController.js
import Culto from "../models/Culto.js";
import Miembro from "../models/Member.js";
import error from "../middlewares/error.js";

class CultoController {

    static async list(req, res) {
        try {
            const cultos = await Culto.listAll();
            res.render("cultos/index", { cultos });
        } catch (err) {
            console.error(err);
            error.error500(req, res, "Inconvenientes al cargar el cronograma.");
        }
    }

    static async getFormCreate(req, res) {
        try {
            const miembros = await Miembro.listActive();
            res.render("cultos/create", { miembros, valores: {}, errores: [] });
        } catch (err) {
            console.error(err);
            error.error500(req, res, "Error al cargar la vista de creación.");
        }
    }

    static async create(req, res) {
        try {
            const { cultos } = req.body;
            const miembros = await Miembro.listActive();

            if (req.validationErrors) {
                return res.status(400).render("cultos/create", {
                    errores: req.validationErrors,
                    valores: req.body,
                    miembros
                });
            }

            // Procesamos la matriz añadiendo el campo 'hora'
            const cultosProcesados = cultos.map(c => [
                c.fecha || null,
                c.hora || null,
                c.tipo_culto ? c.tipo_culto.trim() : null,
                c.id_dirigente && c.id_dirigente.trim() !== "" ? Number(c.id_dirigente) : null,
                c.dirigente_externo && c.dirigente_externo.trim() !== "" ? c.dirigente_externo.trim() : null,
                c.id_predicador && c.id_predicador.trim() !== "" ? Number(c.id_predicador) : null,
                c.predicador_externo && c.predicador_externo.trim() !== "" ? c.predicador_externo.trim() : null
            ]);

            await Culto.createMassive(cultosProcesados);

            req.flash('success_msg', `Se programaron ${cultosProcesados.length} cultos exitosamente.`);
            res.redirect("/cultos");
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Inconveniente interno al guardar el cronograma masivo.');
            res.redirect("/cultos/create");
        }
    }

    static async getFormEdit(req, res) {
        try {
            const { id } = req.params;
            const cultoToEdit = await Culto.getById(id);
            if (!cultoToEdit) {
                req.flash('error_msg', 'Culto no localizado.');
                return res.redirect("/cultos");
            }

            const miembros = await Miembro.listActive();
            res.render("cultos/edit", { cultoToEdit, miembros });
        } catch (err) {
            console.error(err);
            error.error500(req, res, "Inconveniente al cargar los datos del servicio.");
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const cultoExistente = await Culto.getById(id);

            if (!cultoExistente) {
                req.flash('error_msg', 'El registro ya no existe.');
                return res.redirect("/cultos");
            }

            if (req.validationErrors) {
                const miembros = await Miembro.listActive();
                return res.status(400).render("cultos/edit", {
                    errores: req.validationErrors,
                    cultoToEdit: { ...cultoExistente, ...req.body, id_culto: id },
                    miembros
                });
            }

            const { fecha, hora, tipo_culto, id_dirigente, dirigente_externo, id_predicador, predicador_externo } = req.body;

            const updates = {
                fecha: fecha || cultoExistente.fecha,
                hora: hora || cultoExistente.hora,
                tipo_culto: tipo_culto ? tipo_culto.trim() : cultoExistente.tipo_culto,
                id_dirigente: id_dirigente && id_dirigente.trim() !== "" ? Number(id_dirigente) : null,
                dirigente_externo: dirigente_externo && dirigente_externo.trim() !== "" ? dirigente_externo.trim() : null,
                id_predicador: id_predicador && id_predicador.trim() !== "" ? Number(id_predicador) : null,
                predicador_externo: predicador_externo && predicador_externo.trim() !== "" ? predicador_externo.trim() : null
            };

            await Culto.update(updates, id);

            req.flash('success_msg', 'Culto actualizado de manera exitosa.');
            res.redirect("/cultos");
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Error interno al actualizar el culto.');
            res.redirect("/cultos");
        }
    }

    static async Delete(req, res) {
        try {
            const { id } = req.params;
            await Culto.delete(id);
            req.flash('success_msg', 'Servicio removido de la agenda.');
            res.redirect("/cultos");
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'No se pudo eliminar el registro.');
            res.redirect("/cultos");
        }
    }

    static async getReporte(req, res) {
        try {
            const cronograma = await Culto.getReportData();
            res.render("cultos/reporte", { cronograma });
        } catch (err) {
            console.error("Error en CultoController.getReporte:", err);
            error.error500(req, res, "No se pudo generar el reporte de servicios.");
        }
    }
}

export default CultoController;