import pool from "../conexion/db.js";

export const createEstadoDeCuentaBancario = async (registros) => {
  try {
    const registrosNormalizados = registros.map((registro) => ({
      ...registro,
      referencia: String(parseInt(registro.referencia, 10)),
    }));

    const referencias = registrosNormalizados.map(
      (registro) => registro.referencia
    );

    const queryCheck = `
      SELECT referencia 
      FROM estado_de_cuenta_bancario 
      WHERE referencia = ANY($1)
    `;
    const resultCheck = await pool.query(queryCheck, [referencias]);

    const referenciasExistentes = resultCheck.rows.map((row) =>
      String(row.referencia)
    );

    const registrosFiltrados = registrosNormalizados.filter(
      (registro) => !referenciasExistentes.includes(registro.referencia)
    );

    if (registrosFiltrados.length === 0) {
      console.log("No hay nuevos registros para insertar.");
      return [];
    }

    const resultados = [];

    for (const registrosFiltrado of registrosFiltrados) {
      const {
        fecha,
        referencia,
        concepto,
        cargo,
        abono,
        saldo,
        codigo_operacion: codigoOperacion,
        tipo_operacion: tipoOperacion,
      } = registrosFiltrado;

      const query = `
        INSERT INTO estado_de_cuenta_bancario 
        (fecha, referencia, concepto, cargo, abono, saldo, codigo_operacion, tipo_operacion) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`;

      const values = [
        fecha,
        referencia,
        concepto,
        cargo,
        abono,
        saldo,
        codigoOperacion,
        tipoOperacion,
      ];

      const result = await pool.query(query, values);
      resultados.push(result.rows[0]);
    }

    return resultados;
  } catch (error) {
    console.error("Error al filtrar o insertar registros:", error.message);
    throw new Error("Error al procesar los registros");
  }
};
export const getAllEstadoDeCuentaBancario = async (
  limit = 10,
  offset = 0,
  search = ""
) => {
  try {
    let query = `
      SELECT * 
      FROM estado_de_cuenta_bancario
    `;

    let countQuery = `
      SELECT COUNT(*) AS total
      FROM estado_de_cuenta_bancario
    `;

    const params = [];
    if (search) {
      query += ` WHERE CAST(referencia AS TEXT) ILIKE $1 OR concepto ILIKE $1`;
      countQuery += ` WHERE CAST(referencia AS TEXT) ILIKE $1 OR concepto ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${
      params.length + 2
    }`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query(
      countQuery,
      search ? [`%${search}%`] : []
    );

    const totalItems = parseInt(countResult.rows[0].total, 10);

    return { estadoDeCuenta: result.rows, totalItems };
  } catch (error) {
    console.error("Error al obtener estado de cuenta bancario:", error);
    throw new Error("Error al obtener estado de cuenta bancario");
  }
};
export const getEstadoDeCuentaBancarioById = async (id) => {
  try {
    if (!id) {
      throw new Error("El ID es obligatorio para obtener un registro.");
    }

    const result = await pool.query(
      `SELECT * FROM estado_de_cuenta_bancario WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error(`Estado de cuenta bancario con ID ${id} no encontrado.`);
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error al obtener estado de cuenta bancario por ID:", error);
    throw new Error(error.message);
  }
};
export const updateEstadoDeCuentaBancario = async (
  id,
  fecha,
  referencia,
  concepto,
  cargo,
  abono,
  saldo,
  codigoOperacion,
  tipoOperacion
) => {
  try {
    const result = await pool.query(
      `UPDATE estado_de_cuenta_bancario 
       SET fecha = $1, referencia = $2, concepto = $3, cargo = $4, abono = $5, saldo = $6, 
           codigo_operacion = $7, tipo_operacion = $8
       WHERE id = $9 RETURNING *`,
      [
        fecha, // $1
        referencia, // $2
        concepto, // $3
        parseFloat(cargo) || 0, // $4
        parseFloat(abono) || 0, // $5
        parseFloat(saldo) || 0, // $6
        codigoOperacion, // $7
        tipoOperacion, // $8
        parseInt(id, 10), // $9
      ]
    );

    if (result.rows.length === 0) {
      throw new Error(`Estado de cuenta bancario con ID ${id} no encontrado.`);
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error al actualizar estado de cuenta bancario:", error.message);
    throw new Error("Error al actualizar estado de cuenta bancario");
  }
};
export const deleteEstadoDeCuentaBancario = async (id) => {
  try {
    if (!id) {
      throw new Error("El ID es obligatorio para eliminar un registro.");
    }

    const result = await pool.query(
      "DELETE FROM estado_de_cuenta_bancario WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error(`Estado de cuenta bancario con ID ${id} no encontrado.`);
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error al eliminar estado de cuenta bancario:", error);
    throw new Error("Error al eliminar estado de cuenta bancario");
  }
};
