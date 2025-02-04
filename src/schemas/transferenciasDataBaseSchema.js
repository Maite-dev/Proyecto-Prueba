import pool from "../conexion/db.js";

export const createTransferenciasTable = async () => {
  try {
    await pool.query(`    
      CREATE TABLE IF NOT EXISTS transferencias (
        id SERIAL PRIMARY KEY,           -- Clave primaria
        referencia BIGINT NOT NULL UNIQUE, -- Número de referencia único como BIGINT
        abono NUMERIC(10, 2) DEFAULT 0.00, -- Monto del abono
        rif VARCHAR(20) NOT NULL,        -- RIF asociado a la transferencia
        razon_social VARCHAR(255) NOT NULL, -- Razón social del titular   
        fecha DATE NOT NULL,             -- Fecha de la transferencia
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de creación
      );
    `);
    console.log("Tabla 'transferencias' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'transferencias':", error);
    throw error;
  }
};
