import Culto from "../models/ServicePlatform.js";

class ReportService {
    /**
     * @param {string} month - Número de mes (01-12) o vacío
     * @param {number} year 
     * @returns {Promise<Array>}
     */
    static async getServicesByMonth(month, year) {
        const allServices = await Culto.getReportData(); 

        if (!month) return allServices;

        // Filtrado preciso en base a la fecha del servicio
        return allServices.filter(item => {
            if (!item.fecha) return false;
            const serviceDate = new Date(item.fecha);
            // GetMonth() es indexado en 0 (0 = Enero), sumamos 1 y rellenamos con cero a la izquierda
            const serviceMonth = String(serviceDate.getMonth() + 1).padStart(2, '0');
            return serviceMonth === month;
        });
    }
}

export default ReportService;