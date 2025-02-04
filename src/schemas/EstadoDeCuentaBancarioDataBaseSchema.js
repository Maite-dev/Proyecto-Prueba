import pool from "../conexion/db.js";

export const createEstadoDeCuentaBancarioTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS estado_de_cuenta_bancario (
        id SERIAL PRIMARY KEY,        
        fecha VARCHAR(15) NOT NULL, 
        referencia BIGINT UNIQUE,
        concepto VARCHAR(255),
        cargo NUMERIC(10, 2) DEFAULT 0.00,
        abono NUMERIC(10, 2) DEFAULT 0.00,
        saldo NUMERIC(10, 2) DEFAULT 0.00,
        codigo_operacion VARCHAR(10),
        tipo_operacion CHAR(4),        
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log(
      "Tabla 'estado_de_cuenta_bancario' creada con éxito con relación a 'propietarios_comerciales'."
    );
  } catch (error) {
    console.error(
      "Error al crear la tabla 'estado_de_cuenta_bancario':",
      error
    );
    throw error;
  }
};
