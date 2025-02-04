import pool from "../conexion/db.js";

// Crear una transferencia
export const createTransferencia = async (data) => {
  try {
    const { referencia, abono, rif, razonSocial, fecha } = data;
    const result = await pool.query(
      `
      INSERT INTO transferencias (referencia, abono, rif, razon_social, fecha)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
      `,
      [referencia, abono, rif, razonSocial, fecha]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error al crear transferencia:", error);
    throw new Error("Error al crear transferencia");
  }
};

// Obtener todas las transferencias con paginación y búsqueda
export const getAllTransferencias = async (limit = 10, offset = 0, search = "") => {
  try {
    let query = `SELECT * FROM transferencias`;
    let countQuery = `SELECT COUNT(*) FROM transferencias`;
    const params = [];

    if (search) {
      query += ` WHERE referencia ILIKE $1 OR rif ILIKE $1 OR razon_social ILIKE $1`;
      countQuery += ` WHERE referencia ILIKE $1 OR rif ILIKE $1 OR razon_social ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const totalResult = await pool.query(countQuery, search ? [`%${search}%`] : []);
    const totalItems = parseInt(totalResult.rows[0].count, 10);

    return { transferencias: result.rows, totalItems };
  } catch (error) {
    console.error("Error al obtener transferencias:", error);
    throw new Error("Error al obtener transferencias");
  }
};

// Obtener una transferencia por ID
export const getTransferenciaById = async (id) => {
  try {
    const result = await pool.query(
      `SELECT * FROM transferencias WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      throw new Error(`Transferencia con ID ${id} no encontrada`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error al obtener transferencia:", error);
    throw new Error("Error al obtener transferencia");
  }
};

// Actualizar una transferencia
export const updateTransferencia = async (id, data) => {
  try {
    const { referencia, abono, rif, razonSocial, fecha } = data;
    const result = await pool.query(
      `
      UPDATE transferencias
      SET referencia = $1, abono = $2, rif = $3, razon_social = $4, fecha = $5
      WHERE id = $6 RETURNING *
      `,
      [referencia, abono, rif, razonSocial, fecha, id]
    );
    if (result.rows.length === 0) {
      throw new Error(`Transferencia con ID ${id} no encontrada`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error al actualizar transferencia:", error);
    throw new Error("Error al actualizar transferencia");
  }
};

// Eliminar una transferencia
export const deleteTransferencia = async (id) => {
  try {
    const result = await pool.query(
      `DELETE FROM transferencias WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      throw new Error(`Transferencia con ID ${id} no encontrada`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error al eliminar transferencia:", error);
    throw new Error("Error al eliminar transferencia");
  }
};
