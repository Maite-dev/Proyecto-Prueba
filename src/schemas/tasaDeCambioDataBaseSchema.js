import pool from "../conexion/db.js";

export const createTasaDeCambioTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasa_de_cambio (
        id SERIAL PRIMARY KEY,                          
        fecha DATE NOT NULL,                            
        tasa DECIMAL(15, 2) NOT NULL,                   
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
      );
    `);
    console.log("Tabla 'tasa_de_cambio' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'tasa_de_cambio':", error);
    throw error;
  }
};
