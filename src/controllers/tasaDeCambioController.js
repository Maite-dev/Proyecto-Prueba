import {
  createTasaDeCambio,
  getAllTasasDeCambio,
  getTasaDeCambioById,
  updateTasaDeCambio,
  deleteTasaDeCambio,
} from "../models/tasaDeCambioModel.js";

export const createTasaDeCambioController = async (req, res) => {
  const { fecha, tasa } = req.body;

  if (!fecha || !tasa) {
    return res.status(400).json({
      error: "Los campos fecha y tasa son obligatorios.",
    });
  }

  try {
    const newTasaDeCambio = await createTasaDeCambio(fecha, tasa);
    res.status(201).json(newTasaDeCambio);
  } catch (error) {
    console.error("Error al crear tasa de cambio:", error);
    res.status(500).json({ error: "Error al crear tasa de cambio" });
  }
};

export const getAllTasasDeCambioController = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { tasasDeCambio, totalItems } = await getAllTasasDeCambio(
      limit,
      offset,
      search
    );

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      tasasDeCambio,
      currentPage: parseInt(page, 10),
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.error("Error al obtener tasas de cambio:", error);
    res.status(500).json({ error: "Error al obtener tasas de cambio" });
  }
};

export const getTasaDeCambioByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const tasaDeCambio = await getTasaDeCambioById(id);
    res.status(200).json(tasaDeCambio);
  } catch (error) {
    console.error("Error al obtener tasa de cambio por ID:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateTasaDeCambioController = async (req, res) => {
  const { id } = req.params;
  const { fecha, tasa } = req.body;

  if (!fecha || !tasa) {
    return res.status(400).json({
      error: "Los campos fecha y tasa son obligatorios para actualizar.",
    });
  }

  try {
    const updatedTasaDeCambio = await updateTasaDeCambio(id, fecha, tasa);
    res.status(200).json(updatedTasaDeCambio);
  } catch (error) {
    console.error("Error al actualizar tasa de cambio:", error);
    res.status(500).json({ error: "Error al actualizar tasa de cambio" });
  }
};

export const deleteTasaDeCambioController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTasaDeCambio = await deleteTasaDeCambio(id);
    res.status(200).json({
      message: "Tasa de cambio eliminada",
      tasaDeCambio: deletedTasaDeCambio,
    });
  } catch (error) {
    console.error("Error al eliminar tasa de cambio:", error);
    res.status(500).json({ error: "Error al eliminar tasa de cambio" });
  }
};
