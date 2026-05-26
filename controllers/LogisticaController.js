// src/controllers/LogisticaController.js
import Logistica from "../models/Logistica.js";
import Culto from "../models/Culto.js";
import Miembro from "../models/Miembro.js";
import error from "../middlewares/error.js";

class LogisticaController {

    // Renderizar formulario de gestión logística para un culto
    static async getForm(req, res) {
        try {
            const { idCulto } = req.params;

            const culto = await Culto.getById(idCulto);
            if (!culto) {
                req.flash("error_msg", "El culto solicitado no existe.");
                return res.redirect("/cultos");
            }

            // Buscar si ya tiene datos logísticos guardados previamente
            const logistica = await Logistica.getByCultoId(idCulto) || {};
            const miembros = await Miembro.listActive();

            res.render("logistica/manage", { culto, logistica, miembros, errores: [] });
        } catch (err) {
            console.error(err);
            error.error500(req, res, "Error al abrir la gestión logística.");
        }
    }

    // Procesar inserción o actualización logística
    static async processForm(req, res) {
        const { idCulto } = req.params;
        try {
            const { id_sonido, id_multimedia, id_aseo, observaciones } = req.body;

            if (req.validationErrors) {
                const culto = await Culto.getById(idCulto);
                const miembros = await Miembro.listActive();
                return res.status(400).render("logistica/manage", {
                    errores: req.validationErrors,
                    culto,
                    logistica: req.body,
                    miembros
                });
            }

            const dataLogistica = {
                id_culto: Number(idCulto),
                id_sonido: id_sonido && id_sonido.trim() !== "" ? Number(id_sonido) : null,
                id_multimedia: id_multimedia && id_multimedia.trim() !== "" ? Number(id_multimedia) : null,
                id_aseo: id_aseo && id_aseo.trim() !== "" ? Number(id_aseo) : null,
                observaciones: observaciones ? observaciones.trim() : null
            };

            await Logistica.save(dataLogistica);

            req.flash("success_msg", "Logística del culto actualizada correctamente.");
            res.redirect("/cultos");
        } catch (err) {
            console.error(err);
            req.flash("error_msg", "No se pudo guardar la planeación logística.");
            res.redirect(`/logistica/manage/${idCulto}`);
        }
    }
}

export default LogisticaController;