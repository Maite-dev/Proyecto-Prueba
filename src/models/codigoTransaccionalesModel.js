import pool from "../conexion/db.js";

export const createCodigoTransaccional = async (codigo, descripcion) => {
  try {
    const result = await pool.query(
      "INSERT INTO codigo_transaccionales (codigo, descripcion) VALUES ($1, $2) RETURNING *",
      [codigo, descripcion]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error al crear el código transaccional:", error);
    throw new Error("Error al crear el código transaccional");
  }
};

export const getAllCodigoTransaccionales = async (limit = 10, offset = 0, search = "") => {
  try {
    let query = `SELECT * FROM codigo_transaccionales`;
    let countQuery = "SELECT COUNT(*) FROM codigo_transaccionales";
    const params = [];

    if (search) {
      query += " WHERE codigo ILIKE $1 OR descripcion ILIKE $1";
      countQuery += " WHERE codigo ILIKE $1 OR descripcion ILIKE $1";
      params.push(`%${search}%`);
    }

    query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const totalResult = await pool.query(countQuery, search ? [`%${search}%`] : []);
    const totalItems = parseInt(totalResult.rows[0].count, 10);

    return { codigosTransaccionales: result.rows, totalItems };
  } catch (error) {
    console.error("Error al obtener los códigos transaccionales:", error);
    throw new Error("Error al obtener los códigos transaccionales");
  }
};

export const getCodigoTransaccionalById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM codigo_transaccionales WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      throw new Error(`Código transaccional con ID ${id} no encontrado.`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error al obtener el código transaccional por ID:", error);
    throw new Error(error.message);
  }
};

export const updateCodigoTransaccional = async (id, codigo, descripcion) => {
  try {
    const result = await pool.query(
      "UPDATE codigo_transaccionales SET codigo = $1, descripcion = $2 WHERE id = $3 RETURNING *",
      [codigo, descripcion, id]
    );
    if (result.rows.length === 0) {
      throw new Error(`Código transaccional con ID ${id} no encontrado.`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error al actualizar el código transaccional:", error);
    throw new Error("Error al actualizar el código transaccional");
  }
};

export const deleteCodigoTransaccional = async (id) => {
  try {
    const result = await pool.query("DELETE FROM codigo_transaccionales WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      throw new Error(`Código transaccional con ID ${id} no encontrado.`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error al eliminar el código transaccional:", error);
    throw new Error("Error al eliminar el código transaccional");
  }
};
