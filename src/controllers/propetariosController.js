import {
  createPropietario,
  getAllPropietarios,
  getPropietarioById,
  updatePropietario,
  deletePropietario,
} from "../models/propietariosModel.js";
import { formatFecha } from "../utils/fecha.js";

export const createPropietarioController = async (req, res) => {
  const {
    propietario,
    documentoIdentidad,
    telefono,
    email,
    direccion,
    localId,
  } = req.body;

  if (
    !propietario ||
    !documentoIdentidad ||
    !telefono ||
    !email ||
    !direccion ||
    !localId
  ) {
    return res.status(400).json({
      error:
        "Todos los campos (propietario, documento_identidad, telefono, email, direccion, local_id) son obligatorios.",
    });
  }

  try {
    const newPropietario = await createPropietario(
      propietario,
      documentoIdentidad,
      telefono,
      email,
      direccion,
      localId
    );   
    res.status(201).json(newPropietario);
  } catch (error) {
    console.error("Error al crear propietario:", error);
    res
      .status(500)
      .json({ error: "Error al crear el registro de propietario" });
  }
};
export const getAllPropietariosController = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { propietarios, totalItems } = await getAllPropietarios(
      limit,
      offset,
      search
    );

    propietarios.forEach((propietario) => {
      propietario.fecha = formatFecha(propietario.fecha);
    });

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      propietarios,
      currentPage: parseInt(page, 10),
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.error("Error al obtener propietarios:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los registros de Propietarios" });
  }
};
export const getPropietarioByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const propietario = await getPropietarioById(id);

    if (!propietario) {
      return res
        .status(404)
        .json({ message: `Propietario con ID ${id} no encontrado.` });
    }

    propietario.fecha = formatFecha(propietario.fecha);
    propietario.local_numero = propietario.local_numero || "No asignado";

    res.status(200).json(propietario);
  } catch (error) {
    console.error("Error al obtener propietario:", error);

    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({
      message: "Error al obtener el propietario",
      error: error.message,
    });
  }
};
export const updatePropietarioController = async (req, res) => {
  const { id } = req.params;
  const {
    propietario,
    documentoIdentidad,
    telefono,
    email,
    direccion,
    localId,
  } = req.body;

  if (
    !id ||
    !propietario ||
    !documentoIdentidad ||
    !telefono ||
    !email ||
    !direccion ||
    !localId
  ) {
    return res.status(400).json({
      message:
        "Todos los campos (id, propietario, documentoIdentidad, telefono, email, direccion, localId) son obligatorios.",
    });
  }

  try {
    // Llamamos a la función para actualizar el propietario
    const updatedPropietario = await updatePropietario(
      id,
      propietario,
      documentoIdentidad,
      telefono,
      email,
      direccion,
      localId
    );
    // Devolvemos el propietario actualizado
    res.status(200).json(updatedPropietario);
  } catch (error) {
    console.error("Error al actualizar propietario:", error);
    res.status(500).json({ message: "Error al actualizar propietario" });
  }
};
export const deletePropietarioController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPropietario = await deletePropietario(id);
    res.status(200).json({
      message: "Propietario eliminado",
      propietario: deletedPropietario,
    });
  } catch (error) {
    console.error("Error al eliminar propietario:", error);
    res.status(500).json({ message: "Error al eliminar propietario" });
  }
};
