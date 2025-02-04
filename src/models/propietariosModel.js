import pool from "../conexion/db.js";

export const createPropietario = async (
  propietario,
  documentoIdentidad,
  telefono,
  email,
  direccion,
  localId
) => {
  try {
    if (
      !propietario ||
      !documentoIdentidad ||
      !telefono ||
      !email ||
      !direccion ||
      !localId
    ) {
      throw new Error(
        "Todos los campos (propietario, documento_identidad, telefono, email, direccion, local_id) son obligatorios."
      );
    }

    const result = await pool.query(
      "INSERT INTO propietarios (propietario, documento_identidad, telefono, email, direccion, local_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [propietario, documentoIdentidad, telefono, email, direccion, localId]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error al crear propietario:", error);
    throw new Error("Error al crear propietario");
  }
};
export const getAllPropietarios = async (
  limit = 10,
  offset = 0,
  search = ""
) => {
  try {
    let query = `
      SELECT 
        propietarios.id, 
        propietarios.propietario, 
        propietarios.documento_identidad, 
        propietarios.telefono, 
        propietarios.email, 
        propietarios.direccion, 
        propietarios.local_id,    
        propietarios.fecha
      FROM 
        propietarios
      LEFT JOIN 
        locales 
      ON 
        propietarios.local_id = locales.id
    `;

    let countQuery = "SELECT COUNT(*) FROM propietarios";
    const params = [];

    if (search) {
      query += " WHERE propietario ILIKE $1 OR documento_identidad ILIKE $1";
      countQuery +=
        " WHERE propietario ILIKE $1 OR documento_identidad ILIKE $1";
      params.push(`%${search}%`);
    }

    query += ` ORDER BY propietarios.id ASC LIMIT $${
      params.length + 1
    } OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const totalResult = await pool.query(
      countQuery,
      search ? [`%${search}%`] : []
    );
    const totalItems = parseInt(totalResult.rows[0].count, 10);

    const propietarios = result.rows.map((propietario) => ({
      id: propietario.id,
      propietario: propietario.propietario,
      documento_identidad: propietario.documento_identidad,
      telefono: propietario.telefono,
      email: propietario.email,
      direccion: propietario.direccion,
      local_id: propietario.local_id,
      local_numero: propietario.local_numero,
      fecha: propietario.fecha,
    }));

    return { propietarios, totalItems };
  } catch (error) {
    console.error("Error al obtener propietarios:", error);
    throw new Error("Error al obtener propietarios");
  }
};
export const getPropietarioById = async (id) => {
  try {
    if (!id) {
      throw new Error("El ID es obligatorio para obtener un registro.");
    }
    const result = await pool.query(
      `SELECT 
        propietarios.id, 
        propietarios.propietario, 
        propietarios.documento_identidad, 
        propietarios.telefono, 
        propietarios.email, 
        propietarios.direccion, 
        propietarios.local_id,        
        propietarios.fecha
      FROM 
        propietarios
      LEFT JOIN 
        locales 
      ON 
        propietarios.local_id = locales.id
      WHERE 
        propietarios.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      throw new Error(`Propietario con ID ${id} no encontrado.`);
    }
    return result.rows[0]; // Devuelve el propietario encontrado con el número de local
  } catch (error) {
    console.error("Error al obtener Propietario por ID:", error);
    throw new Error(error.message); // Retornamos el error tal cual como fue lanzado
  }
};
export const updatePropietario = async (
  id,
  propietario,
  documentoIdentidad,
  telefono,
  email,
  direccion,
  local_id
) => {
  try {
    if (
      !id ||
      !propietario ||
      !documentoIdentidad ||
      !telefono ||
      !email ||
      !direccion ||
      local_id === undefined
    ) {
      throw new Error(
        "Todos los campos (id, propietario, documento_identidad, telefono, email, direccion, local_id) son obligatorios para actualizar."
      );
    }
    const result = await pool.query(
      "UPDATE propietarios SET propietario = $1, documento_identidad = $2, telefono = $3, email = $4, direccion = $5, local_id = $6 WHERE id = $7 RETURNING *",
      [
        propietario,
        documentoIdentidad,
        telefono,
        email,
        direccion,
        local_id,
        id,
      ]
    );
    return result.rows[0]; // Devuelve el propietario actualizado
  } catch (error) {
    console.error("Error al actualizar Propietario:", error);
    throw new Error("Error al actualizar Propietario");
  }
};
export const deletePropietario = async (id) => {
  try {
    if (!id) {
      throw new Error("El ID es obligatorio para eliminar un registro.");
    }
    const result = await pool.query(
      "DELETE FROM propietarios WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0]; // Devuelve el propietario eliminado
  } catch (error) {
    console.error("Error al eliminar Propietario:", error);
    throw new Error("Error al eliminar Propietario");
  }
};
