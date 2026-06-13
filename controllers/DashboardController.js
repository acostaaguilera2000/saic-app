import DashboardService from '../services/DashboardService.js';

/**
 * Controlador de la interfaz del tablero administrativo y de usuarios
 * @module DashboardController
 */

export const renderDashboard = async (req, res, next) => {
    try {
        const userSession = req.session.user;

       // Bifurcación del flujo para el rol miembro
        if (userSession && userSession.rol === 'miembro') {
            // CORRECCIÓN AQUÍ: Cambiamos .id por .id_usuario para coincidir con tu base de datos
            console.log(`[SAIC Audit] Buscando dashboard para id_usuario en sesión: ${userSession.id_usuario}`);

            // Pasar el parámetro correcto (id_usuario) al servicio
            const memberBentoData = await DashboardService.getMemberDashboardSummary(userSession.id_usuario);

            console.log("[SAIC Audit] Datos devueltos por el servicio para el miembro:", memberBentoData);

            // CONTROL DE FLUJO SEGURO:
            if (!memberBentoData) {
                console.warn(`[SAIC Audit] El usuario con ID ${userSession.id_usuario} no devolvió perfil de miembro.`);
                return res.render('dashboard-views/sin-perfil', {
                    title: 'Cuenta en Verificación - SAIC',
                    user: userSession
                });
            }

            // Si el perfil existe, cargamos su Bento Grid normal
            return res.render('dashboard-views/miembro', {
                title: 'Mi Portal - SAIC',
                user: userSession,
                datos: memberBentoData
            });
        }

        // Flujo por defecto (Administradores / Líderes)
        const currentYear = new Date().getFullYear();
        const bentoGridData = await DashboardService.getBentoGridData(currentYear);

        res.render('dashboard-views/index', {
            title: 'Panel de Control Administrativo',
            currentYear: currentYear,
            user: userSession,
            data: bentoGridData
        });

    } catch (error) {
        console.error("Error detectado en DashboardController.renderDashboard:", error);
        next(error);
    }
};