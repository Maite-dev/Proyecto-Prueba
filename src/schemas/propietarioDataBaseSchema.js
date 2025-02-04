import pool from "../conexion/db.js";

export const createPropietarioTable = async () => {
  try {
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
      CREATE TABLE IF NOT EXISTS propietarios (
        id SERIAL PRIMARY KEY,
        propietario VARCHAR(255) NOT NULL,
        documento_identidad VARCHAR(50) NOT NULL UNIQUE,
        telefono VARCHAR(20),
        email VARCHAR(100),
        direccion VARCHAR(255),
        local_id INTEGER NOT NULL,  -- Relación con la tabla locales
        tipo_contribuyente tipo_contribuyente_enum,  -- Tipo ENUM
        contribuyente_especial BOOLEAN NOT NULL DEFAULT FALSE,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_local FOREIGN KEY (local_id) REFERENCES locales(id),  -- Clave foránea
        CONSTRAINT tipo_contribuyente_check CHECK (tipo_contribuyente IN ('ISLR', 'IVA', 'Ambos', NULL)) -- Permitir NULL
      );
    `);

    console.log("Tabla 'Propietarios' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'Propietarios':", error);
    throw error;
  }
};
