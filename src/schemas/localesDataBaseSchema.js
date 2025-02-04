import pool from "../conexion/db.js";

export const createLocalesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS locales (
        id SERIAL PRIMARY KEY,
        comercial_id INTEGER NOT NULL,  
        codigo VARCHAR(50),
        numero_local VARCHAR(10) NOT NULL,
        piso INTEGER NOT NULL,     
        superficie DECIMAL(5, 3),      
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_comercial_id FOREIGN KEY (comercial_id) 
        REFERENCES comerciales(id) ON DELETE CASCADE
      );
    `);
    console.log("Tabla 'locales' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'locales':", error);
    throw error;
  }
};
