import pool from "../conexion/db.js";

export const createSessionTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        sid VARCHAR NOT NULL PRIMARY KEY, -- ID de sesión
        sess JSON NOT NULL,               -- Datos de la sesión en formato JSON
        expire TIMESTAMP NOT NULL         -- Fecha de expiración de la sesión
      );
    `);
    console.log("Tabla 'user_sessions' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'user_sessions':", error);
    throw error;
  }
};
