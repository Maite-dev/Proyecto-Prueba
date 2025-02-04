import pool from "../conexion/db.js";

export const getComisionesBancarias = async (limit = 10, offset = 0, search = "", mes = "", año = "") => {
  try {
    let query = `
      SELECT * 
      FROM comisiones_bancarias
    `;
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM comisiones_bancarias
    `;

    const params = [];
    const conditions = [];

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
    if (mes) {
      conditions.push(`mes ILIKE $${params.length + 1}`);
      params.push(mes);
    }
    if (año) {
      conditions.push(`año = $${params.length + 1}`);
      params.push(año);
    }   
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
      countQuery += ` WHERE ${conditions.join(" AND ")}`;
    }
    query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query(countQuery, params.slice(0, params.length - 2));

    const totalItems = parseInt(countResult.rows[0].total, 10);

    return { comisiones: result.rows, totalItems };
  } catch (error) {
    console.error("Error al obtener las comisiones bancarias:", error);
    throw new Error("Error al obtener las comisiones bancarias");
  }
};
export const getComisionBancariaById = async (id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM comisiones_bancarias WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      throw new Error(`Comisión bancaria con id ${id} no encontrada`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error al obtener la comisión bancaria por id:", error);
    throw new Error("Error al obtener la comisión bancaria");
  }
};
