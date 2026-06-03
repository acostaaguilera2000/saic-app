import Member from "../models/Member.js";

class MemberService {
    
    /**
     * Registra un nuevo miembro validando que no exista duplicidad de documento
     * @param {Object} memberData - Datos del formulario recibidos en español
     * @returns {Promise<void>}
     */
    static async createNewMember(memberData) {
        const { documento } = memberData;

        if (!documento || documento.trim() === "") {
            const businessError = new Error("El documento de identidad es un campo obligatorio.");
            businessError.name = "BusinessValidationError";
            throw businessError;
        }

        // Regla de Negocio: Validar unicidad del documento de identidad
        const duplicateMembers = await Member.findByDocument(documento.trim());
        if (duplicateMembers && duplicateMembers.length > 0) {
            const businessError = new Error(`El documento de identidad "${documento}" ya se encuentra registrado.`);
            businessError.name = "BusinessValidationError";
            throw businessError;
        }

        // Formateo y limpieza de datos 
        const sanitizedMember = {
            nombre: memberData.nombre ? memberData.nombre.trim() : "",
            apellido: memberData.apellido ? memberData.apellido.trim() : "",
            documento: documento.trim(),
            fecha_registro: memberData.fecha_registro || null,
            fecha_bautismo: memberData.fecha_bautismo || null
        };

        // Pasamos el objeto al modelo
        return await Member.create(sanitizedMember);
    }

    /**
     * Modifica los datos de un miembro existente validando cambios de documento
     * @param {number} memberId 
     * @param {Object} newData - Datos nuevos provenientes del req.body 
     */
    static async updateMemberDetails(memberId, newData) {
        // 1. Verificar si el miembro existe usando el modelo
        const currentMember = await Member.findById(memberId);
        if (!currentMember) {
            const businessError = new Error("El miembro que intenta actualizar no existe en el sistema.");
            businessError.name = "NotFoundError";
            throw businessError;
        }

        // 2. Regla de Negocio: Si el documento cambió, verificar que no esté duplicado con otra persona
        if (newData.documento && newData.documento.trim() !== currentMember.documento) {
            const duplicateMembers = await Member.findByDocument(newData.documento.trim());
            if (duplicateMembers && duplicateMembers.length > 0) {
                const businessError = new Error("El documento de identidad ya pertenece a otro miembro registrado.");
                businessError.name = "BusinessValidationError";
                throw businessError;
            }
        }

        // 3. Fusión segura de datos para blindar contra el efecto borrado
        const updatedData = {
            nombre: newData.nombre !== undefined ? newData.nombre.trim() : currentMember.nombre,
            apellido: newData.apellido !== undefined ? newData.apellido.trim() : currentMember.apellido,
            documento: newData.documento !== undefined ? newData.documento.trim() : currentMember.documento,
            fecha_registro: newData.fecha_registro !== undefined ? newData.fecha_registro : currentMember.fecha_registro,
            fecha_bautismo: newData.fecha_bautismo !== undefined ? newData.fecha_bautismo : currentMember.fecha_bautismo
        };

        // 4. Enviamos el bloque unificado al modelo para ejecutar el UPDATE seguro
        await Member.update(memberId, updatedData);
    }

    /**
     * Alterna el estado de un miembro entre activo e inactivo con validaciones de dependencia
     * @param {number} memberId 
     */
    static async toggleStatus(memberId) {
        const member = await Member.findById(memberId);
        if (!member) {
            const businessError = new Error("El miembro especificado no existe.");
            businessError.name = "NotFoundError";
            throw businessError;
        }


        if (member.activo === 1) { 
            const hasActiveUser = await Member.hasLinkedUser(memberId); 
            if (hasActiveUser) {
                const businessError = new Error("No se puede inactivar al miembro porque tiene una cuenta de usuario vinculada activa.");
                businessError.name = "DependencyConstraintError";
                throw businessError;
            }
        }

        // Conmutamos el estado de manera numérica
        const newStatus = member.activo === 1 ? 0 : 1;
        await Member.updateStatus(memberId, newStatus);

        return {
            newStatus,
            fullName: `${member.nombre} ${member.apellido}`
        };
    }
}

export default MemberService;