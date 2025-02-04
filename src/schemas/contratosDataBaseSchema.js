import pool from "../conexion/db.js";

export const createContratosTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contratos (
        id SERIAL PRIMARY KEY,  
        arrendatario_id INTEGER NOT NULL,  
        numero_contrato INTEGER NOT NULL UNIQUE,      
        contrato_inicio DATE NOT NULL, 
        contrato_finalizacion DATE NOT NULL,             
        condiciones_generales TEXT, 
        canon_total NUMERIC(15, 2) NOT NULL,  
        status BOOLEAN DEFAULT TRUE,      
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,        
        CONSTRAINT fk_arrendatario FOREIGN KEY (arrendatario_id) REFERENCES arrendatarios(id) ON DELETE CASCADE
      );
    `);
    console.log("Tabla 'Contratos' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'Contratos':", error);
    throw error;
  }
};
