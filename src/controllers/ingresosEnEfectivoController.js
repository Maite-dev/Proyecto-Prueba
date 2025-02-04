import {
  createIngresoEnEfectivo,
  getAllIngresosEnEfectivo,
  getIngresoEnEfectivoById,
  updateIngresoEnEfectivo,
  deleteIngresoEnEfectivo,
} from "../models/ingresosEnEfectivoModel.js";

export const createIngresoController = async (req, res) => {
  const { arrendatarioId, cantidadEnDivisas } = req.body;
  try {
    const newIngreso = await createIngresoEnEfectivo(arrendatarioId, cantidadEnDivisas);
    res.status(201).json(newIngreso);
  } catch (error) {
    console.error("Error al crear ingreso en efectivo:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllIngresosController = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { ingresos, totalItems } = await getAllIngresosEnEfectivo(limit, offset);
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      ingresos,
      totalItems,
      totalPages,
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    console.error("Error al obtener ingresos en efectivo:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getIngresoByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const ingreso = await getIngresoEnEfectivoById(id);
    res.status(200).json(ingreso);
  } catch (error) {
    console.error("Error al obtener ingreso por ID:", error);
    res.status(404).json({ error: error.message });
  }
};

export const updateIngresoController = async (req, res) => {
  const { id } = req.params;
  const { arrendatarioId, cantidadEnDivisas } = req.body;

  try {
    const updatedIngreso = await updateIngresoEnEfectivo(id, arrendatarioId, cantidadEnDivisas);
    res.status(200).json(updatedIngreso);
  } catch (error) {
    console.error("Error al actualizar ingreso en efectivo:", error);
    res.status(404).json({ error: error.message });
  }
};

export const deleteIngresoController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedIngreso = await deleteIngresoEnEfectivo(id);
    res.status(200).json({
      message: "Ingreso eliminado correctamente.",
      ingreso: deletedIngreso,
    });
  } catch (error) {
    console.error("Error al eliminar ingreso en efectivo:", error);
    res.status(404).json({ error: error.message });
  }
};
