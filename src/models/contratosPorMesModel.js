import pool from "../conexion/db.js";

export const getAllContratosPorFinalizar = async (months = 2) => {
  try {
    const query = `
      SELECT *
      FROM contratos_por_mes
      WHERE contrato_finalizacion <= CURRENT_DATE + INTERVAL '${months} MONTH'
      ORDER BY contrato_finalizacion ASC
    `;

    const result = await pool.query(query);

    return result.rows; // Devolver los contratos que cumplen con la condición
  } catch (error) {
    console.error("Error al obtener contratos por finalizar:", error);
    throw new Error("Error al obtener contratos por finalizar.");
  }
};
