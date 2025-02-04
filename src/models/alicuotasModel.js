import pool from "../conexion/db.js";

export const getAlicuotas = async (limit = 10, offset = 0, search = "") => {
  try {
    let query = `
      SELECT * 
      FROM alicuota
    `;
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM alicuota
    `;
    const params = [];
    const conditions = [];
    if (search) {
      conditions.push(
        `CAST(porcentaje_alicuota AS TEXT) ILIKE $${params.length + 1}`
      );
      params.push(`%${search}%`);
    }
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
      countQuery += ` WHERE ${conditions.join(" AND ")}`;
    }
    query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${
      params.length + 2
    }`;
    params.push(limit, offset);
    const result = await pool.query(query, params);
    const countResult = await pool.query(
      countQuery,
      params.slice(0, params.length - 2)
    );
    const totalItems = parseInt(countResult.rows[0].total, 10);
    return { alicuotas: result.rows, totalItems };
  } catch (error) {
    console.error("Error al obtener las alícuotas:", error);
    throw new Error("Error al obtener las alícuotas");
  }
};
export const getAlicuotaById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM alicuota WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      throw new Error(`Alicuota con id ${id} no encontrada`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error al obtener la alícuota por id:", error);
    throw new Error("Error al obtener la alícuota");
  }
};
