import pool from "../conexion/db.js";

export const createConciliacionBancariaTable = async () => {
  try {
    await pool.query(`    
      CREATE TABLE IF NOT EXISTS conciliacion_bancaria (
        id SERIAL PRIMARY KEY,          
        referencia BIGINT UNIQUE,
        abono NUMERIC(10, 2) DEFAULT 0.00, -- Abono de la transferencia
        abono_estado_de_cuenta NUMERIC(10, 2) DEFAULT 0.00, -- Abono desde estado_de_cuenta_bancario
        verificacion VARCHAR(20) CHECK (verificacion IN ('aprobado', 'no aprobado')) NOT NULL,     
        rif VARCHAR(20) NOT NULL,         -- RIF asociado a la conciliación
        razon_social VARCHAR(255) NOT NULL, -- Razón social del titular
        mes VARCHAR(20),                 -- Mes asociado
        año INTEGER,                     -- Año asociado (como número)
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de creación
      );
    `);
    console.log("Tabla 'conciliacion_bancaria' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'conciliacion_bancaria':", error);
    throw error;
  }
};
