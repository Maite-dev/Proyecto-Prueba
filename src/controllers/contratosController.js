import {
  createContrato,
  deleteContrato,
  getAllContratos,
  getContratoById,
  updateContrato,
} from "../models/contratosModel.js";

export const createContratoController = async (req, res) => {
  const {
    arrendatarioId,
    numeroContrato,
    contratoInicio,
    contratoFin,
    condicionesGenerales,
    detalles,
  } = req.body;

  try {
    if (new Date(contratoInicio) >= new Date(contratoFin)) {
      return res.status(400).json({
        message:
          "La fecha de inicio del contrato debe ser anterior a la fecha de finalización.",
      });
    }

    const contrato = await createContrato(
      arrendatarioId,
      numeroContrato,
      contratoInicio,
      contratoFin,
      condicionesGenerales,
      detalles
    );

    res.status(201).json(contrato);
  } catch (error) {
    console.error("Error al crear el contrato:", error.message, error.stack);
    res.status(500).json({ error: "Error al crear el contrato" });
  }
};
export const updateContratoController = async (req, res) => {
  const { id } = req.params;
  const {
    arrendatarioId,
    numeroContrato,
    contratoInicio,
    contratoFin,
    condicionesGenerales,
    detalles,
  } = req.body;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ message: "El ID del contrato es obligatorio." });
    }

    if (new Date(contratoInicio) >= new Date(contratoFin)) {
      return res.status(400).json({
        message:
          "La fecha de inicio del contrato debe ser anterior a la fecha de finalización.",
      });
    }

    const contrato = await updateContrato(
      id,
      arrendatarioId,
      numeroContrato,
      contratoInicio,
      contratoFin,
      condicionesGenerales,
      detalles
    );

    if (!contrato.success) {
      return res.status(404).json({ message: contrato.message });
    }

    res.status(200).json(contrato);
  } catch (error) {
    console.error(
      "Error al actualizar el contrato:",
      error.message,
      error.stack
    );
    res.status(500).json({ error: "Error al actualizar el contrato." });
  }
};
export const getAllContratosController = async (req, res) => {
  try {
    const { limit = 10, offset = 0, search = "" } = req.query;

    const contratos = await getAllContratos(parseInt(limit, 10), parseInt(offset, 10), search);
    if (!contratos.success) {
      return res.status(500).json({
        message: contratos.message,
        error: contratos.error,
      });
    }

    const totalPages = Math.ceil(contratos.totalItems / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    res.status(200).json({
      contratos: contratos.data,
      totalItems: contratos.totalItems,
      totalPages,
      currentPage,
    });
  } catch (error) {
    console.error("Error al obtener todos los contratos:", error.message);
    res.status(500).json({ message: "Error al obtener los contratos." });
  }
};
export const getContratoByIdController = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ message: "El ID del contrato es obligatorio." });
  }

  try {
    const contrato = await getContratoById(id);
    if (!contrato.success) {
      return res.status(404).json({ message: contrato.message });
    }
    res.status(200).json(contrato.data);
  } catch (error) {
    console.error("Error al obtener el contrato por ID:", error.message);
    res.status(500).json({ message: "Error al obtener el contrato." });
  }
};
export const deleteContratoController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContrato = await deleteContrato(id);
    if (!deletedContrato) {
      return res
        .status(404)
        .json({ message: `Contrato con ID ${id} no encontrado.` });
    }
    res.status(200).json({
      message: "Contrato eliminado con éxito",
      contrato: deletedContrato,
    });
  } catch (error) {
    console.error("Error al eliminar contrato:", error);
    res.status(500).json({ message: "Error al eliminar el contrato" });
  }
};
