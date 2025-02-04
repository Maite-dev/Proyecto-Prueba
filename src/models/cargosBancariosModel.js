import pool from "../conexion/db.js";

export const getCargosBancarios = async (limit = 10, offset = 0, search = "", mes = "", año = "") => {
  try {
    let query = `
      SELECT * 
      FROM cargos_bancarios
    `;
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM cargos_bancarios
    `;

    const params = [];
    const conditions = [];

    // Búsqueda general
    if (search) {
      conditions.push(`
        CAST(fecha AS TEXT) ILIKE $${params.length + 1} OR
        CAST(referencia AS TEXT) ILIKE $${params.length + 1} OR
        concepto ILIKE $${params.length + 1} OR
        CAST(cargo AS TEXT) ILIKE $${params.length + 1} OR
        codigo_operacion ILIKE $${params.length + 1} OR
        tipo_operacion ILIKE $${params.length + 1}
      `);
      params.push(`%${search}%`);
    }

    // Filtro por mes
    if (mes) {
      conditions.push(`mes ILIKE $${params.length + 1}`);
      params.push(mes);
    }

    // Filtro por año
    if (año) {
      conditions.push(`año = $${params.length + 1}`);
      params.push(año);
    }

    // Agregar condiciones al query si existen
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
      countQuery += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Orden y paginación
    query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    // Ejecutar consultas
    const result = await pool.query(query, params);
    const countResult = await pool.query(countQuery, params.slice(0, params.length - 2));

    const totalItems = parseInt(countResult.rows[0].total, 10);

    return { cargos: result.rows, totalItems };
  } catch (error) {
    console.error("Error al obtener los cargos bancarios:", error);
    throw new Error("Error al obtener los cargos bancarios");
  }
};
export const getCargoBancarioById = async (id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cargos_bancarios WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      throw new Error(`Cargo bancario con id ${id} no encontrado`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error al obtener el cargo bancario por id:", error);
    throw new Error("Error al obtener el cargo bancario");
  }
};
