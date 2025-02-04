import pool from "../conexion/db.js";

export const createLocal = async (comercialId, numeroLocal, piso, superficie, codigo) => {
  try {
    if (!comercialId || !numeroLocal || !piso || !superficie) {
      throw new Error("Todos los campos (comercial_id, numero_local, piso, superficie) son obligatorios.");
    }

    const result = await pool.query(
      `INSERT INTO locales (comercial_id, numero_local, piso, superficie, codigo) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [comercialId, numeroLocal, piso, superficie, codigo]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error al crear Local:", error);
    throw new Error("Error al crear Local");
  }
};
export const getAllLocales = async (limit = 10, offset = 0, search = "") => {
  try {
    let query = `
      SELECT 
        locales.id, 
        locales.numero_local, 
        locales.piso, 
        locales.superficie, 
        locales.codigo,
        locales.fecha, 
        comerciales.comercial 
      FROM 
        locales
      LEFT JOIN 
        comerciales ON locales.comercial_id = comerciales.id
    `;

    let countQuery = "SELECT COUNT(*) FROM locales";
    const params = [];

    if (search) {
      query += `
        WHERE locales.numero_local ILIKE $1 
        OR comerciales.comercial ILIKE $1 
        OR locales.codigo ILIKE $1
      `;
      countQuery += `
        WHERE locales.numero_local ILIKE $1 
        OR comerciales.comercial ILIKE $1 
        OR locales.codigo ILIKE $1
      `;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY locales.id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const totalResult = await pool.query(countQuery, search ? [`%${search}%`] : []);
    const totalItems = parseInt(totalResult.rows[0].count, 10);

    return { locales: result.rows, totalItems };
  } catch (error) {
    console.error("Error al obtener los locales:", error);
    throw new Error("Error al obtener los locales");
  }
};
export const getLocalById = async (id) => {
  try {
    if (!id) {
      throw new Error("El ID es obligatorio para obtener un registro.");
    }

    const result = await pool.query(
      `SELECT 
        locales.id, 
        locales.numero_local, 
        locales.piso, 
        locales.superficie, 
        locales.codigo,
        locales.fecha, 
        comerciales.comercial 
      FROM 
        locales 
      LEFT JOIN 
        comerciales ON locales.comercial_id = comerciales.id
      WHERE 
        locales.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error(`Local con ID ${id} no encontrado.`);
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error al obtener Local por ID:", error);
    throw new Error(`Error al obtener Local por ID: ${error.message}`);
  }
};
export const updateLocal = async (id, comercialId, numeroLocal, piso, superficie, codigo) => {
  try {
    if (!id || !comercialId || !numeroLocal || !piso || !superficie) {
      throw new Error("Todos los campos (id, comercial_id, numero_local, piso, superficie, codigo) son obligatorios para actualizar.");
    }

    const result = await pool.query(
      `UPDATE locales 
       SET comercial_id = $1, numero_local = $2, piso = $3, superficie = $4, codigo = $5
       WHERE id = $6 
       RETURNING *`,
      [comercialId, numeroLocal, piso, superficie, codigo, id]
    );

    if (result.rows.length === 0) {
      throw new Error(`Local con ID ${id} no encontrado para actualizar.`);
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error al actualizar Local:", error);
    throw new Error("Error al actualizar Local");
  }
};
export const deleteLocal = async (id) => {
  try {
    if (!id) {
      throw new Error("El ID es obligatorio para eliminar un registro.");
    }

    const result = await pool.query("DELETE FROM locales WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      throw new Error(`Local con ID ${id} no encontrado para eliminar.`);
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error al eliminar Local:", error);
    throw new Error("Error al eliminar Local");
  }
};
