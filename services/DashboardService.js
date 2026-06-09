import Member from '../models/Member.js';
import Finance from '../models/Finance.js';
import ServicePlatform from '../models/ServicePlatform.js';
import User from '../models/User.js';

/**
 * Servicio orquestador encargado de unificar y estructurar las métricas de los bloques Bento
 * @class DashboardService
 */
class DashboardService {

    /**
     * Compila y unifica toda la información dinámica requerida por el Dashboard administrativo
     * @static
     * @async
     * @param {number} currentYear - Año del cual se extraerán las métricas financieras (Ej: 2026)
     * @returns {Promise<Object>} Estructura unificada para mapear directamente en la vista Pug
     */
    static async getBentoGridData(currentYear = 2026) {
        try {
            // Ejecución asíncrona en paralelo de todos los bloques del Bento Grid
            const [memberSummary, rawMonthlyFinances, recentUsers, upcomingEvents] = await Promise.all([
                Member.getDashboardSummary(),
                Finance.getMonthlyDonationsSumByYear(currentYear),
                User.getLatestUsersCreated(3),
                ServicePlatform.getUpcomingSchedule(2)
            ]);

            // Procesamiento de datos del Bloque 1 (Chart.js)
            // Inicializamos un array de 12 posiciones en 0 para asegurar que los meses vacíos tengan datos
            const chartDataArray = new Array(12).fill(0);
            rawMonthlyFinances.forEach(row => {
                // db devuelve el mes de 1 a 12; ajustamos al índice 0-11 del array
                const index = row.mes - 1;
                if (index >= 0 && index < 12) {
                    chartDataArray[index] = parseFloat(row.total_mes) || 0;
                }
            });

            // Retornamos un único objeto con la estructura que el Bento Grid necesita
            return {
                chartData: chartDataArray, // Array limpio de 12 números para el Canvas [120, 0, 450, ...]
                metrics: {
                    total: memberSummary.total,
                    activos: memberSummary.activos,
                    inactivos: memberSummary.inactivos,
                    crecimiento: '+12%'
                },
                recentUsers: recentUsers,     // Array de objetos con id, username, nombre_completo
                upcomingEvents: upcomingEvents // Array de objetos con id, fecha, hora, tipo_culto
            };

        } catch (error) {
            console.error("Error crítico en DashboardService.getBentoGridData:", error);
            throw {
                status: 500,
                message: "Error interno al consolidar las métricas de los bloques del tablero."
            };
        }
    }
}

export default DashboardService;