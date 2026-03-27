import db from "../config/db.js";
class User {


    static async listUsers() {
        try {
            const [rows] = await db.query("SELECT * FROM users")
            return rows || []
        } catch (error) {
            throw { status: 500, message: "Error al listar los usuarios" }
        }
    }

    static async create(user) {
        try {
            await db.query("INSERT INTO users (username,password) VALUES (?,?)", [user.username, user.password])
        } catch (error) {
            throw ({ status: 500, message: "Error al crear el usuario" })
        }
    }
    static async getOne(username) {
        try {
            const [rows] = await db.query("SELECT * FROM users WHERE username=?", [username]);
            return rows[0] || [];
        } catch (error) {
            throw ({ status: 500, message: "Error al obtener el usuario" + username })
        }
    }

}

export default User;