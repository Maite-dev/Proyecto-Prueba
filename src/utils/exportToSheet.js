import dotenv from "dotenv";
import pkg from "pg";
const { Client } = pkg;

dotenv.config();

// Configuración de la conexión a PostgreSQL
const client = new Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "prueba2",
  password: process.env.DB_PASSWORD || "2057",
  port: process.env.DB_PORT || 5432,
});

export async function exportToSheet(req, res) {
  try {
    await client.connect();

    // 🔹 Listado de tablas a exportar
    const tables = [
      "Propietarios_Comerciales",
      "users",
      "transferencias",
      "tasa_de_cambio",
      "user_sessions",
      "Propietarios",
      "locales",
      "ingresos_en_efectivo",
      "factura",
      "detalle_factura",
      "estado_de_cuenta_bancario",
      "Contratos_por_Mes",
      "Contratos",
      "Contrato_Detalle",
      "conciliacion_bancaria",
      "comisiones_bancarias",
      "Comerciales",
      "codigo_transaccionales",
      "cargos_bancarios",
      "Arrendatarios",
      "alicuota",
      "abonos_bancarios"
    ];

    let result = {};

    for (let table of tables) {
      const res = await client.query(`SELECT * FROM ${table}`);

      if (res.rows.length === 0) {
        console.log(`⚠️ La tabla ${table} no tiene datos.`);
        result[table] = [];
        continue;
      }

      result[table] = res.rows; // Guardar los datos en formato JSON
    }

    console.log("✅ Datos exportados correctamente.");
    res.status(200).json(result); // Enviar los datos a la API en formato JSON
  } catch (error) {
    console.error("❌ Error al exportar datos:", error);
    res.status(500).json({ error: "Error al exportar datos" });
  } finally {
    await client.end();
  }
}
