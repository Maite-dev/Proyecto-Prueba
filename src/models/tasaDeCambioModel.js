import pool from "../conexion/db.js";

export const createTasaDeCambio = async (fecha, tasa) => {
  try {
    if (!fecha || !tasa) {
      throw new Error("Los campos fecha y tasa son obligatorios.");
    }

    const result = await pool.query(
      "INSERT INTO tasa_de_cambio (fecha, tasa, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING *",
      [fecha, tasa]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error al crear Tasa de Cambio:", error);
    throw new Error("Error al crear Tasa de Cambio");
  }
};
export const getAllTasasDeCambio = async (limit = 10, offset = 0, search = "") => {
  try {
    let query = `
      SELECT * 
      FROM tasa_de_cambio
    `;
    let countQuery = "SELECT COUNT(*) FROM tasa_de_cambio";
    const params = [];

    if (search) {
      query += " WHERE CAST(fecha AS TEXT) ILIKE $1 OR CAST(tasa AS TEXT) ILIKE $1";
      countQuery += " WHERE CAST(fecha AS TEXT) ILIKE $1 OR CAST(tasa AS TEXT) ILIKE $1";
      params.push(`%${search}%`);
    }

    query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${
      params.length + 2
    }`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const totalResult = await pool.query(countQuery, search ? [`%${search}%`] : []);
    const totalItems = parseInt(totalResult.rows[0].count, 10);

    return { tasasDeCambio: result.rows, totalItems };
  } catch (error) {
    console.error("Error al obtener Tasas de Cambio:", error);
    throw new Error("Error al obtener Tasas de Cambio");
  }
};
export const getTasaDeCambioById = async (id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasa_de_cambio WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      throw new Error(`Tasa de Cambio con ID ${id} no encontrada.`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error al obtener Tasa de Cambio por ID:", error);
    throw new Error(error.message);
  }
};
export const updateTasaDeCambio = async (id, fecha, tasa) => {
  try {
    if (!id || !fecha || !tasa) {
      throw new Error(
        "Los campos id, fecha y tasa son obligatorios para actualizar."
      );
    }

    const result = await pool.query(
      `
      UPDATE tasa_de_cambio 
      SET fecha = $1, tasa = $2, created_at = CURRENT_TIMESTAMP
      WHERE id = $3 
      RETURNING *
      `,
      [fecha, tasa, id]
    );

    if (result.rows.length === 0) {
      throw new Error(`Tasa de Cambio con ID ${id} no encontrada.`);
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error al actualizar Tasa de Cambio:", error);
    throw new Error("Error al actualizar Tasa de Cambio");
  }
};
export const deleteTasaDeCambio = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM tasa_de_cambio WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      throw new Error(`Tasa de Cambio con ID ${id} no encontrada.`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error al eliminar Tasa de Cambio:", error);
    throw new Error("Error al eliminar Tasa de Cambio");
  }
};
   