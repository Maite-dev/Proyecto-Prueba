import pool from "../conexion/db.js";

export const createIngresoEnEfectivo = async (arrendatarioId, cantidadEnDivisas) => {
  try {
    if (!arrendatarioId || !cantidadEnDivisas) {
      throw new Error("Los campos 'arrendatario_id' y 'cantidad_en_divisas' son obligatorios.");
    }
    const result = await pool.query(
      `INSERT INTO ingresos_en_efectivo (arrendatario_id, cantidad_en_divisas)
       VALUES ($1, $2) RETURNING *`,
      [arrendatarioId, cantidadEnDivisas]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error al crear ingreso en efectivo:", error);
    throw error;
  }
};
export const getAllIngresosEnEfectivo = async (limit = 10, offset = 0) => {
  try {
    const query = `
      SELECT 
        i.id,
        i.arrendatario_id,
        a.razon_social,
        i.cantidad_en_divisas,
        i.mes,
        i.año,
        i.fecha
      FROM 
        ingresos_en_efectivo i
      LEFT JOIN 
        arrendatarios a
      ON 
        i.arrendatario_id = a.id
      ORDER BY i.id ASC
      LIMIT $1 OFFSET $2
    `;
    const params = [limit, offset];

    const result = await pool.query(query, params);
    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM ingresos_en_efectivo`
    );

    return {
      ingresos: result.rows.map(row => ({
        id: row.id,
        arrendatario_id: row.arrendatario_id,
        razon_social: row.razon_social,
        cantidad_en_divisas: row.cantidad_en_divisas,
        mes: row.mes,
        año: row.año,
        fecha: row.fecha
      })),
      totalItems: parseInt(totalResult.rows[0].count, 10),
    };
  } catch (error) {
    console.error("Error al obtener ingresos en efectivo:", error);
    throw error;
  }
};
export const getIngresoEnEfectivoById = async (id) => {
  try {
    const result = await pool.query(
      `SELECT 
        i.id,
        i.arrendatario_id,
        i.cantidad_en_divisas,
        i.mes,
        i.año,
        i.fecha,
        a.razon_social AS arrendatario_razon_social
      FROM 
        ingresos_en_efectivo i
      LEFT JOIN 
        arrendatarios a
      ON 
        i.arrendatario_id = a.id
      WHERE 
        i.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error(`Ingreso con ID ${id} no encontrado.`);
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error al obtener ingreso por ID:", error);
    throw error;
  }
};
export const updateIngresoEnEfectivo = async (id, arrendatarioId, cantidadEnDivisas) => {
  try {
    if (!id || !arrendatarioId || !cantidadEnDivisas) {
      throw new Error("Todos los campos son obligatorios.");
    }
    const result = await pool.query(
      `UPDATE ingresos_en_efectivo
       SET arrendatario_id = $1, cantidad_en_divisas = $2
       WHERE id = $3 RETURNING *`,
      [arrendatarioId, cantidadEnDivisas, id]
    );
    if (result.rows.length === 0) {
      throw new Error(`Ingreso con ID ${id} no encontrado.`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error al actualizar ingreso en efectivo:", error);
    throw error;
  }
};
export const deleteIngresoEnEfectivo = async (id) => {
  try {
    const result = await pool.query(
      `DELETE FROM ingresos_en_efectivo WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      throw new Error(`Ingreso con ID ${id} no encontrado.`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error al eliminar ingreso en efectivo:", error);
    throw error;
  }
};
