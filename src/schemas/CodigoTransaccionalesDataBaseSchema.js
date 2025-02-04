import pool from "../conexion/db.js";

export const createCodigoTransaccionalesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS codigo_transaccionales (
        id SERIAL PRIMARY KEY,           
        codigo VARCHAR(20) NOT NULL,    
        descripcion VARCHAR(60) NOT NULL 
      );
    `);
    console.log("Tabla 'codigo_transaccionales' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'codigo_transaccionales':", error);
    throw error;
  }
};
