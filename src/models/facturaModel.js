import pool from "../conexion/db.js";

export const createFacturaConDetalles = async (facturaData, detallesFactura) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const {
      numeroControl,
      numeroFactura,
      idArrendatario,
      fecha,
      mes,
      baseImponible,
      formaPagoDivisas,
      tasaDeCambio,
      conversionDivisasABs,
      formaPagoTransferencias,
      iva,
      igtf,
      retencionIslr,
      retencionIva,
      totalAPagar,
    } = facturaData;

    // Inserta la factura y obtiene el ID generado
    const facturaResult = await client.query(
      `
      INSERT INTO factura (
        numero_control, numero_factura, id_arrendatario, fecha, mes,
        base_imponible, forma_pago_divisas, tasa_de_cambio, conversion_divisas_a_bs,
        forma_pago_transferencias, iva, igtf, retencion_islr, retencion_iva, total_a_pagar
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id
      `,
      [
        numeroControl,
        numeroFactura,
        idArrendatario,
        fecha,
        mes,
        baseImponible,
        formaPagoDivisas,
        tasaDeCambio,
        conversionDivisasABs,
        formaPagoTransferencias,
        iva,
        igtf,
        retencionIslr,
        retencionIva,
        totalAPagar,
      ]
    );

    // Asegúrate de que facturaResult tiene datos
    if (!facturaResult.rows || facturaResult.rows.length === 0) {
      throw new Error("No se pudo insertar la factura");
    }

    const facturaId = facturaResult.rows[0].id;

    // Inserta los detalles de la factura
    const detalleQueries = detallesFactura.map((detalle) => {
      const { codigo, descripcion, cantidad, precio, iva, total } = detalle;

      return client.query(
        `
        INSERT INTO detalle_factura (id_factura, codigo, descripcion, cantidad, precio, iva, total)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [facturaId, codigo, descripcion, cantidad, precio, iva, total]
      );
    });

    // Ejecuta todas las consultas de detalles
    await Promise.all(detalleQueries);

    await client.query("COMMIT");

    return { facturaId };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear factura y detalles:", error);
    throw new Error("Error al crear factura y detalles");
  } finally {
    client.release();
  }
};
export const getAllFacturasConDetalles = async (limit = 10, offset = 0, search = "") => {
  try {
    const baseQuery = `
      SELECT f.*, d.id AS detalle_id, d.codigo, d.descripcion, d.cantidad, d.precio, d.iva AS detalle_iva, d.total AS detalle_total
      FROM factura f
      LEFT JOIN detalle_factura d ON f.id = d.id_factura
    `;
    const countQuery = `
      SELECT COUNT(DISTINCT f.id) AS total
      FROM factura f
      LEFT JOIN detalle_factura d ON f.id = d.id_factura
    `;
    const params = [];
    let whereClause = "";

    if (search) {
      whereClause = " WHERE f.numero_control ILIKE $1 OR f.numero_factura ILIKE $1";
      params.push(`%${search}%`);
    }

    const paginatedQuery = `
      ${baseQuery}
      ${whereClause}
      ORDER BY f.id ASC
      LIMIT $${params.length + 1}
      OFFSET $${params.length + 2}
    `;
    params.push(limit, offset);

    const [result, totalResult] = await Promise.all([
      pool.query(paginatedQuery, params),
      pool.query(countQuery + whereClause, search ? [`%${search}%`] : []),
    ]);

    const totalItems = parseInt(totalResult.rows[0].total, 10);

    // Agrupar facturas y detalles
    const facturas = {};
    result.rows.forEach((row) => {
      const facturaId = row.id;
      if (!facturas[facturaId]) {
        facturas[facturaId] = {
          id: row.id,
          numero_control: row.numero_control,
          numero_factura: row.numero_factura,
          id_arrendatario: row.id_arrendatario,
          fecha: row.fecha,
          mes: row.mes,
          base_imponible: row.base_imponible,
          forma_pago_divisas: row.forma_pago_divisas,
          tasa_de_cambio: row.tasa_de_cambio,
          conversion_divisas_a_bs: row.conversion_divisas_a_bs,
          forma_pago_transferencias: row.forma_pago_transferencias,
          iva: row.iva,
          igtf: row.igtf,
          retencion_islr: row.retencion_islr,
          retencion_iva: row.retencion_iva,
          total_a_pagar: row.total_a_pagar,
          created_at: row.created_at,
          detalles: [],
        };
      }
      if (row.detalle_id) {
        facturas[facturaId].detalles.push({
          id: row.detalle_id,
          codigo: row.codigo,
          descripcion: row.descripcion,
          cantidad: row.cantidad,
          precio: row.precio,
          iva: row.detalle_iva,
          total: row.detalle_total,
        });
      }
    });

    return { facturas: Object.values(facturas), totalItems };
  } catch (error) {
    console.error("Error al obtener facturas con detalles:", error);
    throw new Error("Error al obtener facturas con detalles");
  }
};
export const getFacturaByIdConDetalles = async (id) => {
  try {
    const query = `
      SELECT f.*, d.id AS detalle_id, d.codigo, d.descripcion, d.cantidad, d.precio, d.iva AS detalle_iva, d.total AS detalle_total
      FROM factura f
      LEFT JOIN detalle_factura d ON f.id = d.id_factura
      WHERE f.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new Error(`Factura con ID ${id} no encontrada.`);
    }

    const factura = {
      id: result.rows[0].id,
      numero_control: result.rows[0].numero_control,
      numero_factura: result.rows[0].numero_factura,
      id_arrendatario: result.rows[0].id_arrendatario,
      fecha: result.rows[0].fecha,
      mes: result.rows[0].mes,
      base_imponible: result.rows[0].base_imponible,
      forma_pago_divisas: result.rows[0].forma_pago_divisas,
      tasa_de_cambio: result.rows[0].tasa_de_cambio,
      conversion_divisas_a_bs: result.rows[0].conversion_divisas_a_bs,
      forma_pago_transferencias: result.rows[0].forma_pago_transferencias,
      iva: result.rows[0].iva,
      igtf: result.rows[0].igtf,
      retencion_islr: result.rows[0].retencion_islr,
      retencion_iva: result.rows[0].retencion_iva,
      total_a_pagar: result.rows[0].total_a_pagar,
      created_at: result.rows[0].created_at,
      detalles: [],
    };

    result.rows.forEach((row) => {
      if (row.detalle_id) {
        factura.detalles.push({
          id: row.detalle_id,
          codigo: row.codigo,
          descripcion: row.descripcion,
          cantidad: row.cantidad,
          precio: row.precio,
          iva: row.detalle_iva,
          total: row.detalle_total,
        });
      }
    });

    return factura;
  } catch (error) {
    console.error("Error al obtener factura por ID:", error);
    throw new Error("Error al obtener factura por ID");
  }
};
export const updateFacturaConDetalles = async (facturaData, detallesFactura) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const {
      id,
      numeroControl,
      numeroFactura,
      idArrendatario,
      fecha,
      mes,
      baseImponible,
      formaPagoDivisas,
      tasaDeCambio,
      conversionDivisasABs,
      formaPagoTransferencias,
      iva,
      igtf,
      retencionIslr,
      retencionIva,
      totalAPagar,
    } = facturaData;

    // Actualiza la factura
    const facturaUpdateResult = await client.query(
      `
      UPDATE factura
      SET 
        numero_control = $1,
        numero_factura = $2,
        id_arrendatario = $3,
        fecha = $4,
        mes = $5,
        base_imponible = $6,
        forma_pago_divisas = $7,
        tasa_de_cambio = $8,
        conversion_divisas_a_bs = $9,
        forma_pago_transferencias = $10,
        iva = $11,
        igtf = $12,
        retencion_islr = $13,
        retencion_iva = $14,
        total_a_pagar = $15
      WHERE id = $16
      RETURNING id
      `,
      [
        numeroControl,
        numeroFactura,
        idArrendatario,
        fecha,
        mes,
        baseImponible,
        formaPagoDivisas,
        tasaDeCambio,
        conversionDivisasABs,
        formaPagoTransferencias,
        iva,
        igtf,
        retencionIslr,
        retencionIva,
        totalAPagar,
        id,
      ]
    );

    if (!facturaUpdateResult.rows || facturaUpdateResult.rows.length === 0) {
      throw new Error("Factura no encontrada o no se pudo actualizar");
    }

    const facturaId = facturaUpdateResult.rows[0].id;

    // Elimina los detalles existentes de la factura
    await client.query("DELETE FROM detalle_factura WHERE id_factura = $1", [facturaId]);

    // Inserta los nuevos detalles de la factura
    const detalleQueries = detallesFactura.map((detalle) => {
      const { codigo, descripcion, cantidad, precio, iva, total } = detalle;

      return client.query(
        `
        INSERT INTO detalle_factura (id_factura, codigo, descripcion, cantidad, precio, iva, total)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [facturaId, codigo, descripcion, cantidad, precio, iva, total]
      );
    });

    // Ejecuta todas las consultas de detalles
    await Promise.all(detalleQueries);

    await client.query("COMMIT");

    return { facturaId };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al actualizar factura y detalles:", error);
    throw new Error("Error al actualizar factura y detalles");
  } finally {
    client.release();
  }
};
export const deleteFacturaConDetalles = async (id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Eliminar detalles de la factura
    await client.query(
      "DELETE FROM detalle_factura WHERE id_factura = $1",
      [id]
    );

    // Eliminar la factura principal
    const result = await client.query(
      "DELETE FROM factura WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error(`Factura con ID ${id} no encontrada.`);
    }

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al eliminar factura y detalles:", error);
    throw new Error("Error al eliminar factura y detalles");
  } finally {
    client.release();
  }
};
