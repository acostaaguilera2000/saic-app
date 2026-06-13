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

    /**
     * Recopila el perfil unificado y los turnos litúrgicos de un miembro para su vista Bento Grid
     * @static
     * @async
     * @param {number} userId - ID del usuario en sesión (req.session.user.id_usuario)
     * @returns {Promise<Object|null>} - Objeto estructurado o null si no existe el vínculo
     */
    static async getMemberDashboardSummary(userId) {
        try {
            // 1. Llamamos al método en el modelo Member esperando la promesa correctamente
            const currentMember = await Member.findByUserId(userId);

            // REGLA DE NEGOCIO: Si no hay perfil, devolvemos null para el controlador
            if (!currentMember) {
                return null;
            }

            // 2. Traemos todos sus turnos activos usando el ID del miembro obtenido
            const scheduleTurns = await ServicePlatform.findActiveTurnsByMemberId(currentMember.id_miembro);

            // 3. Formateamos las fechas y horas de las asignaciones de manera legible para el usuario
            const formattedAssignments = (scheduleTurns || []).map(turno => {
                let fechaFormateada = turno.fecha;
                let horaFormateada = turno.hora;

                // A. Formateo de Fecha (Ej: "2026-07-01T05:00:00.000Z" -> "Mié, 01 jul 2026")
                if (turno.fecha instanceof Date) {
                    fechaFormateada = turno.fecha.toLocaleDateString('es-ES', {
                        weekday: 'short', // "mié."
                        year: 'numeric',  // "2026"
                        month: 'short',   // "jul."
                        day: '2-digit',   // "01"
                        timeZone: 'UTC'   // Evita desfases por la zona horaria del entorno de ejecución
                    });
                    
                    // Limpieza estética: Remover puntos de abreviación y capitalizar la primera letra
                    fechaFormateada = fechaFormateada.replace(/\./g, '');
                    fechaFormateada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
                }

                // B. Formateo de Hora Militar (Ej: "07:00:00" -> "07:00")
                if (typeof turno.hora === 'string' && turno.hora.includes(':')) {
                    const [horas, minutos] = turno.hora.split(':');
                    horaFormateada = `${horas}:${minutos}`;
                }

                return {
                    ...turno,
                    fecha: fechaFormateada,
                    hora: horaFormateada
                };
            });

            // 4. Empaquetamos todo convirtiendo de forma segura el estado activo
            return {
                profile: {
                    nombre: currentMember.nombre,
                    documento: currentMember.documento,
                    apellido: currentMember.apellido,
                    fecha_bautismo:currentMember.fecha_bautismo,
                    estado: (currentMember.activo == 1 || currentMember.activo === true) ? 'Activo' : 'Inactivo',
                    ministerio: currentMember.nombre_ministerio || 'Ninguno asignado'
                },
                assignments: formattedAssignments // Array inyectado con los strings formateados
            };
        } catch (error) {
            console.error("Error en DashboardService.getMemberDashboardSummary:", error);
            throw error;
        }
    }
}

export default DashboardService;