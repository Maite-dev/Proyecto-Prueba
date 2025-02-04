import pool from "../conexion/db.js";

export const createArrendatariosTable = async () => {
  try {
    // Crear tipo ENUM para tipo_contribuyente si no existe
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_contribuyente_enum') THEN 
          CREATE TYPE tipo_contribuyente_enum AS ENUM ('ISLR', 'IVA', 'Ambos');
        END IF; 
      END;
      $$;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS arrendatarios (
        id SERIAL PRIMARY KEY,
        razon_social VARCHAR(255) NOT NULL,
        rif VARCHAR(20) NOT NULL UNIQUE,
        telefono VARCHAR(20),
        email VARCHAR(100),
        contribuyente_especial BOOLEAN NOT NULL DEFAULT FALSE,
        tipo_contribuyente tipo_contribuyente_enum,  -- No especificamos NOT NULL, ya que se permite NULL por defecto
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT tipo_contribuyente_check CHECK (tipo_contribuyente IN ('ISLR', 'IVA', 'Ambos', NULL)) -- Permitir NULL
      );
    `);

    console.log("Tabla 'Arrendatarios' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'Arrendatarios':", error);
    throw error;
  }
};
