import Logistica from "../models/Logistica.js";
import Culto from "../models/ServicePlatform.js";

class LogisticsService {
    /**
     * @param {number} idCulto
     * @returns {Promise<Object>}
     */
    static async getLogisticsData(idCulto) {
        const culto = await Culto.getById(idCulto);
        if (!culto) {
            const error = new Error("El culto solicitado no existe.");
            error.name = "NotFoundError";
            throw error;
        }

        const logistica = await Logistica.getByCultoId(idCulto) || {};
        return { culto, logistica };
    }

    /**
     * @param {number} idCulto
     * @param {Object} bodyData
     * @returns {Promise<void>}
     */
    static async saveLogisticsData(idCulto, bodyData) {
        const { id_sonido, id_multimedia, id_aseo, observaciones } = bodyData;

        const dataLogistica = {
            id_culto: Number(idCulto),
            id_sonido: id_sonido && id_sonido.trim() !== "" ? Number(id_sonido) : null,
            id_multimedia: id_multimedia && id_multimedia.trim() !== "" ? Number(id_multimedia) : null,
            id_aseo: id_aseo && id_aseo.trim() !== "" ? Number(id_aseo) : null,
            observaciones: observaciones ? observaciones.trim() : null
        };

        await Logistica.save(dataLogistica);
    }
}

export default LogisticsService;