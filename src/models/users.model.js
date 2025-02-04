import pool from "../conexion/db.js";

const User = {
  // Crear un usuario
  async create({ name, email, password, role = "user" }) {
    const query = `
      INSERT INTO users (name, email, password, role, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, name, email, role, created_at
    `;
    const values = [name, email, password, role];
    try {
      const { rows } = await pool.query(query, values);
      console.log("Usuario creado:", rows[0]); // Aquí depuras lo que devuelve la base de datos
      return rows[0]; // Devuelve el usuario creado
    } catch (error) {
      console.error("Error en User.create:", error);
      throw error; // Asegúrate de manejar errores si algo falla
    }
  },

  // Buscar un usuario por correo
  async findOneByEmail(email) {
    const query = `
      SELECT id, name, email, password, role, created_at
      FROM users WHERE email = $1
    `;
    const { rows } = await pool.query(query, [email]);
    return rows[0]; // Devuelve el usuario si existe
  },

  // Buscar un usuario por ID
  async findById(id) {
    const query = `
      SELECT id, name, email, role, created_at
      FROM users WHERE id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0]; // Devuelve el usuario si existe
  },

  // Actualizar datos del usuario
  async updateById(id, { name, email, password, role }) {
    const query = `
      UPDATE users
      SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        password = COALESCE($3, password),
        role = COALESCE($4, role)
      WHERE id = $5
      RETURNING id, name, email, role, created_at
    `;
    const values = [name, email, password, role, id];
    const { rows } = await pool.query(query, values);
    return rows[0]; // Devuelve el usuario actualizado
  },

  // Eliminar un usuario por ID
  async deleteById(id) {
    const query = `
      DELETE FROM users WHERE id = $1 RETURNING id
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0]; // Devuelve el ID del usuario eliminado
  },
};

export default User;