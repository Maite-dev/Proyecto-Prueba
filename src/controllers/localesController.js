import {
  createLocal,
  getAllLocales,
  getLocalById,
  updateLocal,
  deleteLocal,
} from "../models/localesModel.js";
import { formatFecha } from "../utils/fecha.js";

export const createLocalController = async (req, res) => {
  const { comercialId, numeroLocal, piso, superficie, codigo } = req.body;

  try {
    const local = await createLocal(comercialId, numeroLocal, piso, superficie, codigo);
    res.status(201).json(local);
  } catch (error) {
    console.error("Error al crear el local:", error);
    res.status(500).json({ error: "Error al crear el local" });
  }
};
export const getAllLocalesController = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { locales, totalItems } = await getAllLocales(limit, offset, search);

    locales.forEach((local) => {
      local.fecha = formatFecha(local.fecha);
    });

    res.status(200).json({
      locales,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (error) {
    console.error("Error al obtener locales:", error);
    res.status(500).json({ error: "Error al obtener los registros de locales" });
  }
};
export const getLocalByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const local = await getLocalById(id);
    res.status(200).json(local);
  } catch (error) {
    console.error("Error al obtener local:", error);
    res.status(500).json({ error: "Error al obtener el local" });
  }
};
export const updateLocalController = async (req, res) => {
  const { id } = req.params;
  const { comercialId, numeroLocal, piso, superficie, codigo } = req.body;

  try {
    const updatedLocal = await updateLocal(id, comercialId, numeroLocal, piso, superficie, codigo);
    res.status(200).json(updatedLocal);
  } catch (error) {
    console.error("Error al actualizar local:", error);
    res.status(500).json({ error: "Error al actualizar local" });
  }
};
export const deleteLocalController = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLocal = await deleteLocal(id);
    res.status(200).json({ message: "Local eliminado con éxito", local: deletedLocal });
  } catch (error) {
    console.error("Error al eliminar local:", error);
    res.status(500).json({ error: "Error al eliminar local" });
  }
};
