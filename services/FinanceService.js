import Finance from '../models/Finance.js';
import Member from '../models/Member.js';

/**
 * Servicio encargado de gestionar las reglas operativas, flujos de datos y auditoría de finanzas
 * @class FinanceService
 */
class FinanceService {

    /**
     * Reúne de forma consolidada la información de miembros activos e historial de ingresos para el panel principal
     * @static
     * @async
     * @returns {Promise<Object>} Datos estructurados para alimentar la variable 'datos' esperada por Pug
     * @throws {Object} Propaga el error estructurado capturado en la capa del modelo
     */
    static async getDashboardContext() {
        try {
            // Ejecutamos las consultas en paralelo para optimizar recursos del servidor
            const [members, donations] = await Promise.all([
                Member.findAllActive(),
                Finance.getRecentDonations()
            ]);

            return {
                miembros: members,
                donaciones: donations
            };
        } catch (error) {
            console.error("Error en FinanceService.getDashboardContext:", error);
            // Si el error ya viene estructurado por el modelo, lo relanzamos; de lo contrario, creamos uno genérico
            throw error.status ? error : { status: 500, message: "Error al compilar el contexto financiero del panel." };
        }
    }

    /**
     * Administra la bifurcación del flujo contable según la procedencia del ingreso (Miembro o Tercero Externo)
     * @static
     * @async
     * @param {Object} payload - Datos crudos extraídos de la petición HTTP (req.body)
     * @returns {Promise<boolean>} Confirmación del asentamiento exitoso de la transacción
     * @throws {Object} Propaga o genera errores estructurados según el resultado operativo
     */
    static async processTransaction(payload) {
        try {
            let assignedExternalId = null;
            let assignedMemberId = null;

            // Lógica operativa: Si el origen es externo, se procesa primero la creación del perfil del tercero
            if (payload.procedencia === 'externo') {
                assignedExternalId = await Finance.createExternalDonor({
                    nombre_completo: payload.nombre_externo.trim(),
                    telefono: payload.telefono_externo || null,
                    correo: payload.correo_externo || null
                });
            } else {
                assignedMemberId = parseInt(payload.id_miembro, 10);
            }

            // Registro unificado en el libro contable de donaciones
            return await Finance.insertDonation({
                monto: parseFloat(payload.monto),
                fecha_registro: payload.fecha,
                tipo_pago: payload.tipo_pago,
                categoria_ingreso: payload.categoria_ingreso,
                observacion: payload.observacion || null,
                id_miembro: assignedMemberId,
                id_externo: assignedExternalId
            });
        } catch (error) {
            console.error("Error en FinanceService.processTransaction:", error);
            throw error.status ? error : { status: 500, message: "Error en el procesamiento y asentamiento del ingreso." };
        }
    }

    /**
     * Ejecuta la anulación segura de un asiento contable cambiando su estado
     * @static
     * @async
     * @param {number} idDonacion - Identificador único de la donación a afectar
     * @returns {Promise<boolean>} Retorna verdadero si la transacción fue anulada con éxito
     * @throws {Object} Propaga o genera errores estructurados si el identificador es inválido o falla el modelo
     */
    static async cancelTransaction(idDonacion) {
        try {
            const idParsed = parseInt(idDonacion, 10);
            if (isNaN(idParsed)) {
                throw { status: 400, message: "El identificador de la transacción provisto no es válido." };
            }
            
            return await Finance.updateStatus(idParsed, 'Anulada');
        } catch (error) {
            console.error("Error en FinanceService.cancelTransaction:", error);
            throw error.status ? error : { status: 500, message: "Error al gestionar la solicitud de anulación del asiento." };
        }
    }
}

export default FinanceService;