import Culto from "../models/ServicePlatform.js";

class ServicePlatformService {

    static async getAllServices(upcomingOnly = false) {
        return await Culto.listAll(upcomingOnly);
    }


    static async getServiceById(id) {
        const culto = await Culto.getById(id);
        if (!culto) {
            const error = new Error("El culto solicitado no existe en el sistema.");
            error.name = "NotFoundError";
            throw error;
        }
        return culto;
    }

    /**
     * Registra múltiples cultos en bloque en una sola transacción/query masiva
     * @param {Object} bodyData - req.body completo enviado desde la vista
     */
    static async registerService(bodyData) {
        const { cultos } = bodyData;

        if (!cultos || !Array.isArray(cultos) || cultos.length === 0) {
            const error = new Error("No se recibieron servicios válidos para programar.");
            error.name = "BusinessValidationError";
            throw error;
        }

        // Mapeamos el array de objetos a un array de arrays limpio para la inserción masiva
        const recordsToInsert = cultos.map(item => {
            const id_dirigente = item.id_dirigente || null;
            const id_predicador = item.id_predicador || null;

            return [
                item.fecha,
                item.hora,
                item.tipo_culto.trim(),
                id_dirigente,
                id_dirigente ? null : (item.dirigente_externo ? item.dirigente_externo.trim() : null),
                id_predicador,
                id_predicador ? null : (item.predicador_externo ? item.predicador_externo.trim() : null)
            ];
        });

        // Envía el bloque completo al modelo
        await Culto.createMassive(recordsToInsert);
    }

    /**
     * Modifica los datos de un culto existente (Edición individual)
     */
    static async updateServiceInfo(id, serviceData) {
        await this.getServiceById(id);

        const { id_dirigente, dirigente_externo, id_predicador, predicador_externo } = serviceData;

        const cultoUpdate = {
            fecha: serviceData.fecha,
            hora: serviceData.hora,
            tipo_culto: serviceData.tipo_culto.trim(),
            id_dirigente: id_dirigente || null,
            dirigente_externo: id_dirigente ? null : (dirigente_externo ? dirigente_externo.trim() : null),
            id_predicador: id_predicador || null,
            predicador_externo: id_predicador ? null : (predicador_externo ? predicador_externo.trim() : null)
        };

        await Culto.update(cultoUpdate, id);
    }

    static async removeService(id) {
        await this.getServiceById(id);
        await Culto.delete(id);
    }
}

export default ServicePlatformService;