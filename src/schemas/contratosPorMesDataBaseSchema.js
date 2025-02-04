import pool from "../conexion/db.js";

export const createContratosPorMesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contratos_por_mes (
        id SERIAL PRIMARY KEY,  
        contrato_id INTEGER NOT NULL UNIQUE, 
        numero_contrato INTEGER NOT NULL UNIQUE,      
        contrato_inicio DATE NOT NULL, 
        contrato_finalizacion DATE NOT NULL,   
        mes VARCHAR(15) NOT NULL, 
        año VARCHAR(4) NOT NULL,  
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_contrato FOREIGN KEY (contrato_id) REFERENCES contratos(id) ON DELETE CASCADE
      );
    `);
    console.log("Tabla 'Contratos_por_Mes' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'Contratos_por_Mes':", error);
    throw error;
  }
};
