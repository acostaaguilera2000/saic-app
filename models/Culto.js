// src/models/Culto.js
import db from "../config/db.js";

class Culto {

    static async listAll() {
        try {
            const query = `
                SELECT 
                    c.id_culto,
                    c.fecha,
                    c.hora,
                    c.tipo_culto,
                    c.id_dirigente,
                    c.dirigente_externo,
                    c.id_predicador,
                    c.predicador_externo,
                    m_dir.nombre AS nombre_dirigente,
                    m_dir.apellido AS apellido_dirigente,
                    m_pred.nombre AS nombre_predicador,
                    m_pred.apellido AS apellido_predicador
                FROM culto c
                LEFT JOIN miembro m_dir ON c.id_dirigente = m_dir.id_miembro
                LEFT JOIN miembro m_pred ON c.id_predicador = m_pred.id_miembro
                ORDER BY c.fecha DESC, c.hora DESC
            `;
            const [rows] = await db.query(query);
            return rows;
        } catch (error) {
            console.error("Error en Culto.listAll:", error);
            throw { status: 500, message: "Error al recuperar los cultos." };
        }
    }

    static async getById(id) {
        try {
            const query = `
                SELECT 
                    c.id_culto,
                    c.fecha,
                    c.hora,
                    c.tipo_culto,
                    c.id_dirigente,
                    c.dirigente_externo,
                    c.id_predicador,
                    c.predicador_externo,
                    m_dir.nombre AS nombre_dirigente,
                    m_dir.apellido AS apellido_dirigente,
                    m_pred.nombre AS nombre_predicador,
                    m_pred.apellido AS apellido_predicador
                FROM culto c
                LEFT JOIN miembro m_dir ON c.id_dirigente = m_dir.id_miembro
                LEFT JOIN miembro m_pred ON c.id_predicador = m_pred.id_miembro
                WHERE c.id_culto = ?
            `;
            const [rows] = await db.query(query, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error("Error en Culto.getById:", error);
            throw { status: 500, message: "Error al buscar el culto." };
        }
    }

    // Inserción masiva limpia pasando un array de arrays
    static async createMassive(arrayOfCultos) {
        try {
            const query = `
                INSERT INTO culto (fecha, hora, tipo_culto, id_dirigente, dirigente_externo, id_predicador, predicador_externo)
                VALUES ?
            `;
            const [result] = await db.query(query, [arrayOfCultos]);
            return result.affectedRows;
        } catch (error) {
            console.error("Error en Culto.createMassive:", error);
            throw { status: 500, message: "Error al registrar la lista de cultos masivos." };
        }
    }

    static async update(cultoUpdate, id_culto) {
        try {
            const query = `
                UPDATE culto 
                SET fecha = ?, 
                    hora = ?, 
                    tipo_culto = ?, 
                    id_dirigente = ?, 
                    dirigente_externo = ?, 
                    id_predicador = ?, 
                    predicador_externo = ?
                WHERE id_culto = ?
            `;
            await db.query(query, [
                cultoUpdate.fecha || null,
                cultoUpdate.hora || null,
                cultoUpdate.tipo_culto || null,
                cultoUpdate.id_dirigente || null,
                cultoUpdate.dirigente_externo || null,
                cultoUpdate.id_predicador || null,
                cultoUpdate.predicador_externo || null,
                id_culto
            ]);
        } catch (error) {
            console.error("Error en Culto.update:", error);
            throw { status: 500, message: "Error al actualizar la información del culto." };
        }
    }

    static async delete(id) {
        try {
            const query = `DELETE FROM culto WHERE id_culto = ?`;
            await db.query(query, [id]);
        } catch (error) {
            console.error("Error en Culto.delete:", error);
            throw { status: 500, message: "Error al eliminar el culto." };
        }
    }
    static async getReportData() {
        try {
            const query = `
            SELECT 
                c.fecha, c.hora, c.tipo_culto,
                m_dir.nombre AS dir_nom, m_dir.apellido AS dir_ape, c.dirigente_externo,
                m_pred.nombre AS pred_nom, m_pred.apellido AS pred_ape, c.predicador_externo,
                m_son.nombre AS son_nom, m_son.apellido AS son_ape,
                m_mul.nombre AS mul_nom, m_mul.apellido AS mul_ape,
                m_ase.nombre AS ase_nom, m_ase.apellido AS ase_ape,
                l.observaciones
            FROM culto c
            LEFT JOIN miembro m_dir ON c.id_dirigente = m_dir.id_miembro
            LEFT JOIN miembro m_pred ON c.id_predicador = m_pred.id_miembro
            LEFT JOIN logistica_culto l ON c.id_culto = l.id_culto
            LEFT JOIN miembro m_son ON l.id_sonido = m_son.id_miembro
            LEFT JOIN miembro m_mul ON l.id_multimedia = m_mul.id_miembro
            LEFT JOIN miembro m_ase ON l.id_aseo = m_ase.id_miembro
            WHERE c.fecha >= CURDATE()
            ORDER BY c.fecha ASC, c.hora ASC
        `;
            const [rows] = await db.query(query);
            return rows;
        } catch (error) {
            console.error("Error en Culto.getReportData:", error);
            throw { status: 500, message: "Error al compilar los datos para el reporte." };
        }
    }
}

export default Culto;