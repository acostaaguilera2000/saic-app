import ReportService from "../services/ReportService.js";
import error from "../middlewares/error.js";

class ReportController {

    static async renderDashboard(req, res) {
        res.render("reports-views/index", { errores: [] });
    }
   


    static async getServicesReport(req, res) {
        try {
            const { month } = req.query; // Recibe el mes filtrado (ej: "05" para mayo)
            const currentYear = new Date().getFullYear();

            // Desacoplamiento: El servicio se encarga de la lógica de fechas
            const cronograma = await ReportService.getServicesByMonth(month, currentYear);

            res.render("reports-views/services", {
                cronograma,
                selectedMonth: month || ""
            });
        } catch (err) {
            console.error(err);
            error.error500(req, res, "Error al procesar el reporte de servicios.");
        }
    }
}

export default ReportController;