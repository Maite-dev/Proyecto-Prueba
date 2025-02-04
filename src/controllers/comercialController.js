import {
  createComercial,
  getAllComerciales,
  getComercialById,
  updateComercial,
  deleteComercial,
} from "../models/comercialModel.js";

export const createComercialController = async (req, res) => {
  const {
    idPropietarioComercial,
    comercial,
    rif,
    direccion,
    superficie,
    codigo,
  } = req.body;

  try {
    const newComercial = await createComercial(
      idPropietarioComercial,
      comercial,
      rif,
      direccion,
      superficie,
      codigo
    );
    res.status(201).json(newComercial);
  } catch (error) {
    console.error("Error al crear Comercial:", error);
    res.status(500).json({ error: "Error al crear Comercial" });
  }
};
export const getAllComercialesController = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { comerciales, totalItems } = await getAllComerciales(limit, offset, search);
    const totalPages = Math.ceil(totalItems / limit);
    res.status(200).json({ comerciales, totalItems, totalPages });
  } catch (error) {
    console.error("Error al obtener Comerciales:", error);
    res.status(500).json({ error: "Error al obtener Comerciales" });
  }
};
export const getComercialByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const comercial = await getComercialById(id);
    res.status(200).json(comercial);
  } catch (error) {
    console.error("Error al obtener Comercial por ID:", error);
    res.status(500).json({ error: "Error al obtener Comercial" });
  }
};
export const updateComercialController = async (req, res) => {
  const { id } = req.params;
  const {
    idPropietarioComercial,
    comercial,
    rif,
    direccion,
    superficie,
    codigo,
  } = req.body;

  try {
    const updatedComercial = await updateComercial(
      id,
      idPropietarioComercial,
      comercial,
      rif,
      direccion,
      superficie,
      codigo
    );
    res.status(200).json(updatedComercial);
  } catch (error) {
    console.error("Error al actualizar Comercial:", error);
    res.status(500).json({ error: "Error al actualizar Comercial" });
  }
};
export const deleteComercialController = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedComercial = await deleteComercial(id);
    res.status(200).json({ message: "Comercial eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar Comercial:", error);
    res.status(500).json({ error: "Error al eliminar Comercial" });
  }
};
