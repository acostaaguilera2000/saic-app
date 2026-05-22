
import db from "../config/db.js";

class Miembro {

  // Listar todos los miembros activos
  static async listActive() {
    try {
      const [rows] = await db.query(
        "SELECT * FROM miembro WHERE activo = 1 ORDER BY apellido, nombre"
      );
      return rows || [];
    } catch (error) {
      console.error("Error en listActive:", error);
      throw { status: 500, message: "Error al listar los miembros activos" };
    }
  }

  // Listar miembros que no tienen un usuario asignado (útil para el formulario de usuarios)
  static async listMiembrosDisponibles() {
    try {
      const [rows] = await db.query(`
                SELECT m.id_miembro, m.nombre, m.apellido, m.documento 
                FROM miembro m
                LEFT JOIN usuario u ON m.id_miembro = u.id_miembro
                WHERE u.id_usuario IS NULL AND m.activo = 1
                ORDER BY m.apellido, m.nombre
            `);
      return rows || [];
    } catch (error) {
      console.error("Error en listMiembrosDisponibles:", error);
      throw { status: 500, message: "Error al listar los miembros disponibles" };
    }
  }


  // Buscar miembro por ID
  static async getById(id_miembro) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM miembro WHERE id_miembro = ?",
        [id_miembro]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Error en getById:", error);
      throw { status: 500, message: "Error al obtener miembro por ID" };
    }
  }

  // Buscar miembro por Documento (para validación de unicidad)
  static async getByDocumento(documento) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM miembro WHERE documento = ?",
        [documento]
      );
      return rows; // Devuelve un array siguiendo tu lógica de getByEmail
    } catch (error) {
      console.error("Error en getByDocumento:", error);
      throw { status: 500, message: "Error al buscar miembro por documento" };
    }
  }

  // Insertar un nuevo miembro blindado contra undefined
  static async create(miembro) {
    try {
      const [result] = await db.query(
        `INSERT INTO miembro (nombre, apellido, documento, fecha_registro, fecha_bautismo, activo) 
             VALUES (?, ?, ?, ?, ?, 1)`,
        [
          miembro.nombre || null,
          miembro.apellido || null,
          miembro.documento || null,
          miembro.fecha_registro || null,
          miembro.fecha_bautismo || null
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error en el modelo al crear miembro:", error);
      throw { status: 500, message: "Error al registrar el miembro en la base de datos" };
    }
  }

  // Actualizar datos del miembro blindado contra undefined
  static async update(miembroUpdate, id_miembro) {
    try {
      await db.query(
        `UPDATE miembro 
             SET nombre = ?, apellido = ?, documento = ?, fecha_registro = ?, fecha_bautismo = ? 
             WHERE id_miembro = ?`,
        [
          miembroUpdate.nombre || null,
          miembroUpdate.apellido || null,
          miembroUpdate.documento || null,
          miembroUpdate.fecha_registro || null,
          miembroUpdate.fecha_bautismo || null,
          id_miembro || null // Si el ID llega vacío, se pasa null para evitar el crash de length
        ]
      );
    } catch (error) {
      console.error("Error en el modelo al actualizar miembro:", error);
      throw { status: 500, message: "Error al actualizar la información del miembro" };
    }
  }

  // Eliminación lógica cambiando la bandera 'activo' a 0
  static async deleteLogical(id_miembro) {
    try {
      await db.query(
        "UPDATE miembro SET activo = 0 WHERE id_miembro = ?",
        [id_miembro]
      );
    } catch (error) {
      console.error("Error en el modelo al eliminar miembro:", error);
      throw { status: 500, message: "Error al procesar la baja del miembro" };
    }
  }
}


export default Miembro;
