import {
  createTransferencia,
  getAllTransferencias,
  getTransferenciaById,
  updateTransferencia,
  deleteTransferencia,
} from "../models/transferenciasModel.js";

// Crear transferencia
export const createTransferenciaController = async (req, res) => {
  try {
    const transferencia = await createTransferencia(req.body);
    res.status(201).json(transferencia);
  } catch (error) {
    console.error("Error al crear transferencia:", error);
    res.status(500).json({ error: "Error al crear transferencia" });
  }
};

// Obtener todas las transferencias
export const getAllTransferenciasController = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { transferencias, totalItems } = await getAllTransferencias(
      limit,
      offset,
      search
    );
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      transferencias,
      currentPage: parseInt(page, 10),
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.error("Error al obtener transferencias:", error);
    res.status(500).json({ error: "Error al obtener transferencias" });
  }
};

// Obtener transferencia por ID
export const getTransferenciaByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const transferencia = await getTransferenciaById(id);
    res.status(200).json(transferencia);
  } catch (error) {
    console.error("Error al obtener transferencia:", error);
    res.status(500).json({ error: "Error al obtener transferencia" });
  }
};

// Actualizar transferencia
export const updateTransferenciaController = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTransferencia = await updateTransferencia(id, req.body);
    res.status(200).json(updatedTransferencia);
  } catch (error) {
    console.error("Error al actualizar transferencia:", error);
    res.status(500).json({ error: "Error al actualizar transferencia" });
  }
};

// Eliminar transferencia
export const deleteTransferenciaController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTransferencia = await deleteTransferencia(id);
    res.status(200).json({
      message: "Transferencia eliminada con éxito",
      transferencia: deletedTransferencia,
    });
  } catch (error) {
    console.error("Error al eliminar transferencia:", error);
    res.status(500).json({ error: "Error al eliminar transferencia" });
  }
};
