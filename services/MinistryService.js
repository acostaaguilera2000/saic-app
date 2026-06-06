import Ministry from '../models/Ministry.js';
import MemberModel from '../models/Member.js';

class MinistryService {
    /**
     * Obtiene y procesa la información para el panel principal de ministerios
     * @returns {Promise<Array>} Listado general de ministerios
     */
    async getMinistriesDashboard() {
        return await Ministry.getAll();
    }

    /**
     * Consolida los datos de un ministerio, sus miembros actuales y los candidatos aptos para asignación
     * @param {number} id_ministerio - Identificador del ministerio
     * @returns {Promise<Object|null>} Objeto estructurado para la vista o null si no se encuentra el ministerio
     */
    async getMinistryDetails(id_ministerio) {
        const ministry = await Ministry.getById(id_ministerio);
        if (!ministry) return null;

        const currentMembers = await Ministry.getMembers(id_ministerio);
        
        // Invocación del servicio externo para recuperar únicamente los miembros activos del sistema
        const activeMembers = await MemberModel.findAllActive();

        // Filtrado exclusivo para remover del listado de candidatos a quienes ya integran este ministerio
        const assignableMembers = activeMembers.filter(active => 
            !currentMembers.some(current => current.id_miembro === active.id_miembro)
        );

        return {
            ministry,
            currentMembers,
            assignableMembers
        };
    }

    /**
     * Gestiona las reglas de negocio para dar de alta un nuevo ministerio
     * @param {Object} ministryData - Datos del formulario (nombre, descripcion)
     * @returns {Promise<Object>} Resultado de la persistencia
     */
    async createMinistry(ministryData) {
        return await Ministry.create(ministryData);
    }

    /**
     * Valida reglas de negocio y procesa la asignación de un miembro a un ministerio
     * @param {number} id_miembro - Identificador del miembro
     * @param {number} id_ministerio - Identificador del ministerio
     * @throws {Object} Error de negocio si el miembro ya pertenece al grupo
     * @returns {Promise<Object>} Resultado de la inserción
     */
    async assignMemberToMinistry(id_miembro, id_ministerio) {
        const alreadyAssigned = await Ministry.isMemberAssigned(id_miembro, id_ministerio);
        
        if (alreadyAssigned) {
            throw { status: 400, message: 'El miembro ya se encuentra asignado a este ministerio.' };
        }

        return await Ministry.addMember(id_miembro, id_ministerio);
    }

    /**
     * Procesa la baja de un miembro dentro de un ministerio específico
     * @param {number} id_miembro - Identificador del miembro
     * @param {number} id_ministerio - Identificador del ministerio
     * @returns {Promise<Object>} Resultado de la eliminación
     */
    async removeMemberFromMinistry(id_miembro, id_ministerio) {
        return await Ministry.removeMember(id_miembro, id_ministerio);
    }
}

export default new MinistryService();