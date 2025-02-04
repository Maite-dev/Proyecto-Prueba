import pool from "../conexion/db.js";

export const createComisionesBancariasTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comisiones_bancarias (
        id SERIAL PRIMARY KEY,      
        fecha VARCHAR(15) NOT NULL, 
        referencia BIGINT UNIQUE,
        concepto VARCHAR(255),
        cargo NUMERIC(10, 2) DEFAULT 0.00,            
        codigo_operacion VARCHAR(10),
        tipo_operacion CHAR(4),
        mes VARCHAR(15), 
        año VARCHAR(4),        
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP        
      );
    `);
    console.log(
      "Tabla 'comisiones_bancarias' creada con éxito con el campo 'rif'."
    );
  } catch (error) {
    console.error("Error al crear la tabla 'comisiones_bancarias':", error);
    throw error;
  }
};
