import pool from "../conexion/db.js";

export const createPropietarioComercial = async (
  propietario,
  rif,
  telefono,
  email,
  direccion
) => {
  try {
    if (!propietario || !rif) {
      throw new Error("Los campos propietario y rif son obligatorios.");
    }

    const result = await pool.query(
      "INSERT INTO propietarios_comerciales (propietario, rif, telefono, email, direccion) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [propietario, rif, telefono, email, direccion]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error al crear Propietario Comercial:", error);
    throw new Error("Error al crear Propietario Comercial");
  }
};
export const getAllPropietariosComerciales = async (
  limit = 10,
  offset = 0,
  search = ""
) => {
  try {
    let query = `
      SELECT * 
      FROM propietarios_comerciales
    `;
    let countQuery = "SELECT COUNT(*) FROM propietarios_comerciales";
    const params = [];

    if (search) {
      query += " WHERE propietario ILIKE $1 OR rif ILIKE $1";
      countQuery += " WHERE propietario ILIKE $1 OR rif ILIKE $1";
      params.push(`%${search}%`);
    }

    query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${
      params.length + 2
    }`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const totalResult = await pool.query(countQuery, search ? [`%${search}%`] : []);
    const totalItems = parseInt(totalResult.rows[0].count, 10);

    return { propietariosComerciales: result.rows, totalItems };
  } catch (error) {
    console.error("Error al obtener Propietarios Comerciales:", error);
    throw new Error("Error al obtener Propietarios Comerciales");
  }
};
export const getPropietarioComercialById = async (id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM propietarios_comerciales WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      throw new Error(`Propietario Comercial con ID ${id} no encontrado.`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error al obtener Propietario Comercial por ID:", error);
    throw new Error(error.message);
  }
};
export const updatePropietarioComercial = async (
  id,
  propietario,
  rif,
  telefono,
  email,
  direccion
) => {
  try {
    if (!id || !propietario || !rif) {
      throw new Error(
        "Los campos id, propietario y rif son obligatorios para actualizar."
      );
    }

    const result = await pool.query(
      `
      UPDATE propietarios_comerciales 
      SET propietario = $1, rif = $2, telefono = $3, email = $4, direccion = $5 
      WHERE id = $6 
      RETURNING *
      `,
      [propietario, rif, telefono, email, direccion, id]
    );

    if (result.rows.length === 0) {
      throw new Error(`Propietario Comercial con ID ${id} no encontrado.`);
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error al actualizar Propietario Comercial:", error);
    throw new Error("Error al actualizar Propietario Comercial");
  }
};
export const deletePropietarioComercial = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM propietarios_comerciales WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      throw new Error(`Propietario Comercial con ID ${id} no encontrado.`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error al eliminar Propietario Comercial:", error);
    throw new Error("Error al eliminar Propietario Comercial");
  }
};
