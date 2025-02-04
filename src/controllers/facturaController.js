import {
  createFacturaConDetalles,
  getAllFacturasConDetalles,
  getFacturaByIdConDetalles,
  updateFacturaConDetalles,
  deleteFacturaConDetalles,
} from "../models/facturaModel.js";

export const createFacturaConDetallesController = async (req, res) => {
  const { factura, detallesFactura } = req.body;

  if (!factura || !detallesFactura || detallesFactura.length === 0) {
    return res.status(400).json({
      error: "Los datos de la factura y sus detalles son obligatorios.",
    });
  }

  try {
    const result = await createFacturaConDetalles(factura, detallesFactura);
    res.status(201).json({
      message: "Factura y detalles creados con éxito",
      facturaId: result.facturaId,
    });
  } catch (error) {
    console.error("Error al crear factura con detalles:", error);
    res.status(500).json({ error: "Error al crear factura con detalles" });
  }
};
export const getAllFacturasConDetallesController = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { facturas, totalItems } = await getAllFacturasConDetalles(limit, offset, search);
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      facturas,
      currentPage: parseInt(page, 10),
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.error("Error al obtener facturas con detalles:", error);
    res.status(500).json({ error: "Error al obtener facturas con detalles" });
  }
};
export const getFacturaByIdConDetallesController = async (req, res) => {
  const { id } = req.params;

  try {
    const factura = await getFacturaByIdConDetalles(id);
    res.status(200).json(factura);
  } catch (error) {
    console.error("Error al obtener factura por ID:", error);
    res.status(500).json({ error: error.message });
  }
};
export const updateFacturaConDetallesController = async (req, res) => {
  const { factura, detallesFactura } = req.body;

  if (!factura || !factura.id || !detallesFactura || detallesFactura.length === 0) {
    return res.status(400).json({
      error: "Los datos de la factura y sus detalles son obligatorios, incluyendo el ID de la factura.",
    });
  }

  try {
    const result = await updateFacturaConDetalles(factura, detallesFactura);
    res.status(200).json({
      message: "Factura y detalles actualizados con éxito",
      facturaId: result.facturaId,
    });
  } catch (error) {
    console.error("Error al actualizar factura con detalles:", error);
    res.status(500).json({ error: "Error al actualizar factura con detalles" });
  }
};
export const deleteFacturaConDetallesController = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFactura = await deleteFacturaConDetalles(id);
    res.status(200).json({
      message: "Factura y detalles eliminados con éxito",
      factura: deletedFactura,
    });
  } catch (error) {
    console.error("Error al eliminar factura con detalles:", error);
    res.status(500).json({ error: "Error al eliminar factura con detalles" });
  }
};
