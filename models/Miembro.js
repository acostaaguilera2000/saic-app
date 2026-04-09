import db from "../config/db.js";

class Miembro {
  static async listMiembrosDisponibles() {
    try {
      const [rows] = await db.query(`
        SELECT 
          m.id_miembro,
          m.nombre,
          m.apellido
        FROM miembro m
        LEFT JOIN usuario u ON m.id_miembro = u.id_miembro
        WHERE m.activo = 1 AND u.id_miembro IS NULL
        ORDER BY m.nombre ASC
      `);
      return rows || [];
    } catch (error) {
      throw { status: 500, message: "Error al listar los miembros disponibles" };
    }
  }
}

export default Miembro;
