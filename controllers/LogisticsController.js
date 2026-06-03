import LogisticsService from "../services/LogisticsService.js";
import error from "../middlewares/error.js";
import Member from "../models/Member.js";

class LogisticsController {
    /**
     * @param {Object} req
     * @param {Object} res
     * @returns {Promise<void>}
     */
    static async renderManageForm(req, res) {
        try {
            const { idCulto } = req.params;

            // Invocación del servicio para obtener datos del culto y su logística
            const { culto, logistica } = await LogisticsService.getLogisticsData(idCulto);
            const availableMembers = await Member.findAllActive();
            res.render("logistics-views/manage", { culto, logistica, miembros:availableMembers, errores: [] });
        } catch (err) {
            if (err.name === "NotFoundError") {
                req.flash("error_msg", err.message);
                return res.redirect("/services");
            }
            console.error(err);
            error.error500(req, res, "Error al abrir la gestión logística.");
        }
    }

    /**
     * @param {Object} req
     * @param {Object} res
     * @returns {Promise<void>}
     */
    static async processManageForm(req, res) {
        const { idCulto } = req.params;
        try {
            if (req.validationErrors) {
                const { culto } = await LogisticsService.getLogisticsData(idCulto);
                const miembros = await Member.findAllActive();

                return res.status(400).render("logistics-views/manage", {
                    errores: req.validationErrors,
                    culto,
                    logistica: req.body,
                    miembros
                });
            }

            // Invocación del servicio para procesar el guardado o actualización
            await LogisticsService.saveLogisticsData(idCulto, req.body);

            req.flash("success_msg", "Logística del culto actualizada correctamente.");
            res.redirect("/service");
        } catch (err) {
            console.error(err);
            req.flash("error_msg", "No se pudo guardar la información logística.");
            res.redirect("/service");
        }
    }
}

export default LogisticsController;