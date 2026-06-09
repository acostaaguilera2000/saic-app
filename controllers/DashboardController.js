import DashboardService from '../services/DashboardService.js';

/**
 * Controlador de la interfaz del tablero administrativo
 * @module DashboardController
 */

/**
 * Renderiza la página principal del Dashboard administrativo procesando la información del Bento Grid
 * @async
 * @param {Object} req - Objeto de petición HTTP (Express)
 * @param {Object} res - Objeto de respuesta HTTP (Express)
 * @param {Function} next - Función middleware para captura de errores
 */
export const renderDashboard = async (req, res, next) => {
    try {
        // Capturamos el año actual de forma dinámica del servidor (Ej: 2026)
        const currentYear = new Date().getFullYear();

        // Solicitamos al servicio la unificación de métricas en paralelo
        const bentoGridData = await DashboardService.getBentoGridData(currentYear);

        // Renderizamos la plantilla Pug y le inyectamos el objeto con toda la data estructurada
        res.render('dashboard-views/index', {
            title: 'Panel de Control Administrativo',
            currentYear: currentYear,
            data: bentoGridData // Contiene: chartData, metrics, recentUsers, upcomingEvents
        });

    } catch (error) {
        console.error("Error detectado en DashboardController.renderDashboard:", error);
        
        // Delegamos el error al manejador global de excepciones de Express
        next(error);
    }
};