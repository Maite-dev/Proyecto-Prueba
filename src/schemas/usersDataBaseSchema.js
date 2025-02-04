import pool from "../conexion/db.js";

export const createUserTable = async () => {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);

    `);
    console.log("Tabla 'users' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'users':", error);
    throw error;
  }
};
