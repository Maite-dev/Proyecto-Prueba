import pool from "../conexion/db.js";

export const createContratoDetalleTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contrato_detalle (
        id SERIAL PRIMARY KEY,
        contrato_id INTEGER NOT NULL,
        local_id INTEGER NOT NULL,
        canon NUMERIC(15, 2) NOT NULL, 
        especificaciones TEXT,  
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_contrato FOREIGN KEY (contrato_id) REFERENCES contratos(id) ON DELETE CASCADE,
        CONSTRAINT fk_local FOREIGN KEY (local_id) REFERENCES locales(id) ON DELETE CASCADE
      );
    `);
    console.log("Tabla 'Contrato_Detalle' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'Contrato_Detalle':", error);
    throw error;
  }
};
