import pool from "../conexion/db.js";

export const createContrato = async (
  arrendatarioId,
  numeroContrato,
  contratoInicio,
  contratoFin,
  condicionesGenerales,
  detalles = []
) => {
  try {
    const canonTotal = detalles.reduce(
      (total, detalle) => total + detalle.canon,
      0
    );

    const query = `
      INSERT INTO contratos (arrendatario_id, numero_contrato, contrato_inicio, contrato_finalizacion, condiciones_generales, canon_total, status)
      VALUES ($1, $2, $3, $4, $5, $6, TRUE)
      RETURNING id;
    `;
    const values = [
      arrendatarioId,
      numeroContrato,
      contratoInicio,
      contratoFin,
      condicionesGenerales,
      canonTotal,
    ];
    const result = await pool.query(query, values);
    const contratoId = result.rows[0].id;

    for (const detalle of detalles) {
      const detalleQuery = `
        INSERT INTO contrato_detalle (contrato_id, local_id, canon, especificaciones)
        VALUES ($1, $2, $3, $4);
      `;
      const detalleValues = [
        contratoId,
        detalle.localId,
        detalle.canon,
        detalle.especificaciones,
      ];
      await pool.query(detalleQuery, detalleValues);
    }

    return {
      success: true,
      message: "Contrato creado correctamente.",
      data: {
        contratoId,
        arrendatarioId,
        numeroContrato,
        contratoInicio,
        contratoFin,
        condicionesGenerales,
        canonTotal,
        detalles,
      },
    };
  } catch (error) {
    console.error("Error al crear el contrato:", error);
    return {
      success: false,
      message: "Hubo un error al procesar los datos.",
      error: error.message,
    };
  }
};
export const updateContrato = async (
  contratoId,
  arrendatarioId,
  numeroContrato,
  contratoInicio,
  contratoFin,
  condicionesGenerales,
  detalles = []
) => {
  try {
    const canonTotal = detalles.reduce(
      (total, detalle) => total + detalle.canon,
      0
    );

    const query = `
      UPDATE contratos 
      SET arrendatario_id = $1, numero_contrato = $2, contrato_inicio = $3, 
          contrato_finalizacion = $4, condiciones_generales = $5, canon_total = $6
      WHERE id = $7
      RETURNING *;
    `;
    const values = [
      arrendatarioId,
      numeroContrato,
      contratoInicio,
      contratoFin,
      condicionesGenerales,
      canonTotal,
      contratoId,
    ];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return {
        success: false,
        message: `Contrato con ID ${contratoId} no encontrado.`,
      };
    }
    const deleteDetalleQuery = `DELETE FROM contrato_detalle WHERE contrato_id = $1;`;
    await pool.query(deleteDetalleQuery, [contratoId]);
    for (const detalle of detalles) {
      const detalleQuery = `
        INSERT INTO contrato_detalle (contrato_id, local_id, canon, especificaciones)
        VALUES ($1, $2, $3, $4);
      `;
      const detalleValues = [
        contratoId,
        detalle.localId,
        detalle.canon,
        detalle.especificaciones,
      ];
      await pool.query(detalleQuery, detalleValues);
    }

    return {
      success: true,
      message: "Contrato actualizado correctamente.",
      data: {
        contratoId,
        arrendatarioId,
        numeroContrato,
        contratoInicio,
        contratoFin,
        condicionesGenerales,
        canonTotal,
        detalles,
      },
    };
  } catch (error) {
    console.error("Error al actualizar el contrato:", error);
    return {
      success: false,
      message: "Hubo un error al procesar los datos.",
      error: error.message,
    };
  }
};
export const getAllContratos = async (limit = 10, offset = 0, search = "") => {
  try {
    let query = `
      SELECT c.id, c.arrendatario_id, c.numero_contrato, c.contrato_inicio, c.contrato_finalizacion, 
             c.condiciones_generales, c.canon_total, c.status, 
             json_agg(
               json_build_object(
                 'localId', d.local_id,
                 'canon', d.canon,
                 'especificaciones', d.especificaciones
               )
             ) AS detalles
      FROM contratos c
      LEFT JOIN contrato_detalle d ON c.id = d.contrato_id
    `;

    let countQuery = `
      SELECT COUNT(*) AS total
      FROM contratos c
    `;

    const params = [];
    if (search) {
      if (!isNaN(search)) {
        // Si es numérico, buscar en columnas numéricas
        query += ` WHERE c.numero_contrato = $1`;
        countQuery += ` WHERE c.numero_contrato = $1`;
        params.push(search);
      } else if (
        search.toLowerCase() === "true" ||
        search.toLowerCase() === "false"
      ) {
        // Si es booleano, buscar en la columna status
        query += ` WHERE c.status = $1`;
        countQuery += ` WHERE c.status = $1`;
        params.push(search.toLowerCase() === "true");
      } else {
        // Si es texto, buscar en columnas de texto
        query += ` WHERE c.condiciones_generales ILIKE $1`;
        countQuery += ` WHERE c.condiciones_generales ILIKE $1`;
        params.push(`%${search}%`);
      }
    }

    query += `
      GROUP BY c.id
      ORDER BY c.id ASC
      LIMIT $${params.length + 1}
      OFFSET $${params.length + 2}
    `;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query(
      countQuery,
      params.slice(0, params.length - 2)
    );
    const totalItems = parseInt(countResult.rows[0].total, 10);

    return {
      success: true,
      data: result.rows,
      totalItems,
    };
  } catch (error) {
    console.error("Error al obtener los contratos:", error);
    return {
      success: false,
      message: "Error al obtener los contratos.",
      error: error.message,
    };
  }
};
export const getContratoById = async (id) => {
  try {
    const query = `
      SELECT c.id, c.arrendatario_id, c.numero_contrato, c.contrato_inicio, c.contrato_finalizacion, 
             c.condiciones_generales, c.canon_total, c.status, 
             json_agg(
               json_build_object(
                 'localId', d.local_id,
                 'canon', d.canon,
                 'especificaciones', d.especificaciones
               )
             ) AS detalles
      FROM contratos c
      LEFT JOIN contrato_detalle d ON c.id = d.contrato_id
      WHERE c.id = $1
      GROUP BY c.id;
    `;
    const values = [id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return {
        success: false,
        message: `Contrato con ID ${id} no encontrado.`,
      };
    }

    return {
      success: true,
      data: result.rows[0],
    };
  } catch (error) {
    console.error("Error al obtener el contrato por ID:", error);
    return {
      success: false,
      message: "Error al obtener el contrato.",
      error: error.message,
    };
  }
};
export const deleteContrato = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM contratos WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error(`Contrato con ID ${id} no encontrado para eliminar.`);
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error al eliminar contrato:", error);
    throw new Error(`Error al eliminar contrato: ${error.message}`);
  }
};




