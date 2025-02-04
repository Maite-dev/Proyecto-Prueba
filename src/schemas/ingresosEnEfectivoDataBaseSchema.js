import pool from "../conexion/db.js";

export const createIngresosEnEfectivoTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ingresos_en_efectivo (
        id SERIAL PRIMARY KEY,
        arrendatario_id INTEGER NOT NULL,
        cantidad_en_divisas NUMERIC(15, 2),
        mes INTEGER GENERATED ALWAYS AS (EXTRACT(MONTH FROM fecha)) STORED, 
        año INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM fecha)) STORED,  
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_arrendatario FOREIGN KEY (arrendatario_id) REFERENCES arrendatarios(id) ON DELETE CASCADE
      );
    `);
    console.log("Tabla 'ingresos_en_efectivo' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'conciliaciones_en_efectivo':", error);
    throw error;
  }
};
