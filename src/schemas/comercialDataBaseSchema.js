import pool from '../conexion/db.js';

export const createComercialTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comerciales (
        id SERIAL PRIMARY KEY,
        id_propietario_comercial INT NOT NULL,
        codigo VARCHAR(50),
        comercial VARCHAR(255) NOT NULL,
        rif VARCHAR(20) NOT NULL UNIQUE,
        direccion VARCHAR(255) NOT NULL,
        superficie DECIMAL(10, 3) NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_propietario_comercial
          FOREIGN KEY (id_propietario_comercial)
          REFERENCES propietarios_comerciales (id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      );
    `);
    console.log("Tabla 'Comerciales' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'Comercial':", error);
    throw error;
  }
};
