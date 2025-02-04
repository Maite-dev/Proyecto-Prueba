import pool from '../conexion/db.js';

export const createAlicuotaTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alicuota (
        id SERIAL PRIMARY KEY,
        local_id INTEGER NOT NULL,
        porcentaje_alicuota DECIMAL(5, 3) NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_local_id FOREIGN KEY (local_id) REFERENCES locales(id) ON DELETE CASCADE
      );
    `);
    console.log("Tabla 'alicuota' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'alicuota':", error);
    throw error;
  }
};
