import pool from "../conexion/db.js";

export const createDetalleFacturaTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS detalle_factura (
        id SERIAL PRIMARY KEY,
        id_factura INT NOT NULL,
        codigo VARCHAR(20) NOT NULL,
        descripcion VARCHAR(120),
        cantidad INT NOT NULL,
        precio DECIMAL(15, 2) NOT NULL,
        iva DECIMAL(15, 2),
        total DECIMAL(15, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_factura FOREIGN KEY (id_factura) REFERENCES factura(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    console.log("Tabla 'detalle_factura' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'detalle_factura':", error);
    throw error;
  }
};
