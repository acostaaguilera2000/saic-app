import db from "../config/db.js";
class User {


    static async listUsers() {
        try {
            const [rows] = await db.query(`
            SELECT 
            u.id_usuario,
            u.username,
            u.email,
            u.rol,
            u.id_miembro,
            m.nombre,
            m.apellido,
            m.documento,
            m.activo
            FROM usuario u
            LEFT JOIN miembro m ON u.id_miembro = m.id_miembro
            WHERE u.username!="Root"
            `);
            return rows || [];

        } catch (error) {
            throw { status: 500, message: "Error al listar los usuarios" };
        }
    }


    static async getById(id_usuario) {
        try {
            const [rows] = await db.query(
                `SELECT u.*, 
              m.nombre AS nombre_miembro, 
              m.apellido AS apellido_miembro
              FROM usuario u
              LEFT JOIN miembro m ON u.id_miembro = m.id_miembro
              WHERE u.id_usuario = ?`,
                [id_usuario]
            );

            return rows[0] || null; // devuelve objeto o null si no existe
        } catch (error) {
            throw { status: 500, message: "Error al obtener usuario por ID" };
        }
    }


    static async getByEmail(email) {
        try {
            const [rows] = await db.query("SELECT * FROM usuario WHERE email=?", [email]);
            return rows; // siempre devuelve un array
        } catch (error) {
            throw { status: 500, message: "Error al obtener el email " + email };
        }
    }

    static async getByUsername(username) {
        try {
            const [rows] = await db.query(
                "SELECT * FROM usuario WHERE username = ?",
                [username]
            );
            return rows; // devuelve array
        } catch (error) {
            throw { status: 500, message: "Error al buscar usuario por username" };
        }
    }

    static async create(user) {
        console.log(user);
        try {
            await db.query(
                "INSERT INTO usuario (email, password, rol, username, id_miembro) VALUES (?, ?, ?, ?, ?)",
                [user.email, user.password, user.rol, user.username, user.id_miembro || null]
            );

        } catch (error) {
            console.error("Error al crear usuario:", error);
            throw { status: 500, message: "Error al crear el usuario" };
        }
    }

    static async update(userUpdate, id_usuario) {
        try {
            await db.query(
                `UPDATE usuario 
                SET email = ?, password = ?, rol = ?, username = ?, id_miembro = ? 
                WHERE id_usuario = ?`,
                [
                    userUpdate.email,
                    userUpdate.password,
                    userUpdate.rol,
                    userUpdate.username,
                    userUpdate.id_miembro,
                    id_usuario
                ]
            );
        } catch (error) {
            throw { status: 500, message: "Error al actualizar el usuario" };
        }
    }

    static async Delete(id_usuario) {

        try {
            await db.query("DELETE FROM usuario WHERE id_usuario=?", [id_usuario])
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            throw { status: 500, message: "Error al eliminar el usuario" };
        }
    }

}

export default User;