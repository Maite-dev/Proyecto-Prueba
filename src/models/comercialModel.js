import pool from "../conexion/db.js";

export const createComercial = async (
  idPropietarioComercial,
  comercial,
  rif,
  direccion,
  superficie,
  codigo
) => {
  try {
    const result = await pool.query(
      `INSERT INTO comerciales 
        (id_propietario_comercial, comercial, rif, direccion, superficie, codigo) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [idPropietarioComercial, comercial, rif, direccion, superficie, codigo]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error al crear Comercial:", error);
    throw new Error("Error al crear Comercial");
  }
};
export const getAllComerciales = async (limit = 10, offset = 0, search = "") => {
  try {
    let query = `
      SELECT 
        c.id,
        c.id_propietario_comercial,
        c.codigo,
        c.comercial,
        c.rif,
        c.direccion,
        c.superficie,
        c.fecha,
        p.propietario AS propietario_comercial
      FROM 
        comerciales c
      INNER JOIN 
        propietarios_comerciales p 
      ON 
        c.id_propietario_comercial = p.id
    `;
    let countQuery = "SELECT COUNT(*) FROM comerciales";
    const params = [];
    if (search) {
      query += " WHERE c.comercial ILIKE $1 OR c.codigo ILIKE $1";
      countQuery += " WHERE c.comercial ILIKE $1 OR c.codigo ILIKE $1";
      params.push(`%${search}%`);
    }
    query += ` ORDER BY c.id ASC LIMIT $${params.length + 1} OFFSET $${
      params.length + 2
    }`;
    params.push(limit, offset);
    const result = await pool.query(query, params);
    const totalResult = await pool.query(countQuery, search ? [`%${search}%`] : []);
    const totalItems = parseInt(totalResult.rows[0].count, 10);
    return { comerciales: result.rows, totalItems };
  } catch (error) {
    console.error("Error al obtener comerciales:", error);
    throw new Error("Error al obtener comerciales");
  }
};
export const getComercialById = async (id) => {
  try {
    const result = await pool.query(
      `SELECT 
        c.id,
        c.id_propietario_comercial,
        c.codigo,
        c.comercial,
        c.rif,
        c.direccion,
        c.superficie,
        c.fecha,
        p.propietario AS propietario_comercial
      FROM 
        comerciales c
      INNER JOIN 
        propietarios_comerciales p 
      ON 
        c.id_propietario_comercial = p.id
      WHERE 
        c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error("Comercial no encontrado.");
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error al obtener Comercial por ID:", error);
    throw new Error("Error al obtener Comercial por ID");
  }
};
export const updateComercial = async (
  id,
  idPropietarioComercial,
  comercial,
  rif,
  direccion,
  superficie,
  codigo
) => {
  try {
    const result = await pool.query(
      `UPDATE comerciales 
       SET 
         id_propietario_comercial = $1,
         comercial = $2, 
         rif = $3, 
         direccion = $4, 
         superficie = $5, 
         codigo = $6 
       WHERE id = $7 
       RETURNING *`,
      [
        idPropietarioComercial,
        comercial,
        rif,
        direccion,
        superficie,
        codigo,
        id,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error al actualizar Comercial:", error);
    throw new Error("Error al actualizar Comercial");
  }
};
export const deleteComercial = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM comerciales WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error al eliminar Comercial:", error);
    throw new Error("Error al eliminar Comercial");
  }
};
