import pool from "../conexion/db.js";

export const createFacturaTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS factura (
        id SERIAL PRIMARY KEY,
        numero_control VARCHAR(20) NOT NULL,
        numero_factura VARCHAR(20) NOT NULL,
        id_arrendatario INT NOT NULL,
        fecha DATE NOT NULL,
        mes VARCHAR(20),
        base_imponible DECIMAL(15, 2) NOT NULL,
        forma_pago_divisas DECIMAL(15, 2),
        tasa_de_cambio DECIMAL(15, 2),
        conversion_divisas_a_bs DECIMAL(15, 2),
        forma_pago_transferencias DECIMAL(15, 2),
        iva DECIMAL(15, 2),
        igtf DECIMAL(15, 2),
        retencion_islr DECIMAL(15, 2),
        retencion_iva DECIMAL(15, 2),
        total_a_pagar DECIMAL(15, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_arrendatario FOREIGN KEY (id_arrendatario) REFERENCES arrendatarios(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    console.log("Tabla 'factura' creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla 'factura':", error);
    throw error;
  }
};
