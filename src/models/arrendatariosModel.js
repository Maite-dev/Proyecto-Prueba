import pool from "../conexion/db.js";

export const createArrendatario = async (
  razonSocial,
  rif,
  telefono,
  email,
  contribuyenteEspecial,
  tipoContribuyente
) => {
  try {
    const existingRif = await pool.query(
      "SELECT * FROM arrendatarios WHERE rif = $1",
      [rif]
    );

    if (existingRif.rows.length > 0) {
      throw new Error(`El RIF ${rif} ya está registrado en la base de datos.`);
    }

    const result = await pool.query(
      `INSERT INTO arrendatarios 
        (razon_social, rif, telefono, email, contribuyente_especial, tipo_contribuyente) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        razonSocial,
        rif,
        telefono,
        email,
        contribuyenteEspecial,
        tipoContribuyente,
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error al crear Arrendatario:", error);
    throw new Error(`Error al crear Arrendatario: ${error.message}`);
  }
};
export const getAllArrendatarios = async (
  limit = 10,
  offset = 0,
  search = ""
) => {
  try {
    let query = `
      SELECT 
        arrendatarios.id, 
        arrendatarios.razon_social, 
        arrendatarios.rif, 
        arrendatarios.telefono, 
        arrendatarios.email, 
        arrendatarios.contribuyente_especial, 
        arrendatarios.tipo_contribuyente, 
        arrendatarios.fecha
      FROM 
        arrendatarios
    `;

    let countQuery = "SELECT COUNT(*) FROM arrendatarios";
    const params = [];

    if (search) {
      query += " WHERE razon_social ILIKE $1 OR rif ILIKE $1";
      countQuery += " WHERE razon_social ILIKE $1 OR rif ILIKE $1";
      params.push(`%${search}%`);
    }

    query += ` ORDER BY arrendatarios.id ASC LIMIT $${
      params.length + 1
    } OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    const totalResult = await pool.query(
      countQuery,
      search ? [`%${search}%`] : []
    );
    const totalItems = parseInt(totalResult.rows[0].count, 10);

    const arrendatarios = result.rows.map((arrendatario) => ({
      id: arrendatario.id,
      razon_social: arrendatario.razon_social,
      rif: arrendatario.rif,
      telefono: arrendatario.telefono,
      email: arrendatario.email,
      contribuyente_especial: arrendatario.contribuyente_especial ? "Sí" : "No",
      tipo_contribuyente: arrendatario.tipo_contribuyente || "Nulo",
      fecha: arrendatario.fecha,
    }));

    return { arrendatarios, totalItems };
  } catch (error) {
    console.error("Error al obtener Arrendatarios:", error);
    throw new Error(`Error al obtener Arrendatarios: ${error.message}`);
  }
};
export const getArrendatarioById = async (id) => {
  try {
    if (!id) {
      throw new Error("El ID del arrendatario es obligatorio.");
    }

    const query = `
      SELECT 
        arrendatarios.id, 
        arrendatarios.razon_social, 
        arrendatarios.rif, 
        arrendatarios.telefono, 
        arrendatarios.email, 
        arrendatarios.contribuyente_especial, 
        arrendatarios.tipo_contribuyente, 
        arrendatarios.fecha
      FROM 
        arrendatarios
      WHERE 
        arrendatarios.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new Error(`Arrendatario con ID ${id} no encontrado.`);
    }

    const arrendatario = result.rows[0];
    arrendatario.contribuyente_especial = arrendatario.contribuyente_especial
      ? "Sí"
      : "No";
    arrendatario.tipo_contribuyente = arrendatario.tipo_contribuyente || "Nulo";

    return arrendatario;
  } catch (error) {
    console.error("Error al obtener Arrendatario por ID:", error);
    throw new Error(`Error al obtener Arrendatario por ID: ${error.message}`);
  }
};
export const deleteArrendatario = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM Arrendatarios WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error(`Arrendatario con ID ${id} no encontrado para eliminar.`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error al eliminar Arrendatario:", error);
    throw new Error(`Error al eliminar Arrendatario: ${error.message}`);
  }
};
export const updateArrendatario = async (
  id,
  {
    razonSocial,
    rif,
    telefono,
    email,
    contribuyenteEspecial,
    tipoContribuyente,
  }
) => {
  try {
    const result = await pool.query(
      `UPDATE arrendatarios 
       SET 
         razon_social = $1, 
         rif = $2, 
         telefono = $3, 
         email = $4, 
         contribuyente_especial = $5, 
         tipo_contribuyente = $6
       WHERE id = $7 
       RETURNING *`,
      [
        razonSocial,
        rif,
        telefono,
        email,
        contribuyenteEspecial,
        tipoContribuyente,
        id,
      ]
    );
    if (result.rows.length === 0) {
      throw new Error(
        `Arrendatario con ID ${id} no encontrado para actualizar.`
      );
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error al actualizar Arrendatario:", error);
    throw new Error(`Error al actualizar Arrendatario: ${error.message}`);
  }
};
