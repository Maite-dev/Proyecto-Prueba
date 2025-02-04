import pool from '../conexion/db.js';

export const createPropietariosComercialesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS propietarios_comerciales (
        id SERIAL PRIMARY KEY,
        propietario VARCHAR(255) NOT NULL,
        rif VARCHAR(50) NOT NULL UNIQUE,
        telefono VARCHAR(20),
        email VARCHAR(100),
        direccion VARCHAR(255),
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Tabla 'Propietarios_Comerciales' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'Propietarios_Comerciales':", error);
    throw error;
  }
};
