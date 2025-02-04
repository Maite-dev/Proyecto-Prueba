import {
  createPropietarioComercial,
  getAllPropietariosComerciales,
  getPropietarioComercialById,
  updatePropietarioComercial,
  deletePropietarioComercial,
} from "../models/propietariosComercialesModel.js";

export const createPropietarioComercialController = async (req, res) => {
  const { propietario, rif, telefono, email, direccion } = req.body;

  if (!propietario || !rif) {
    return res.status(400).json({
      error: "Los campos propietario y rif son obligatorios.",
    });
  }

  try {
    const newPropietarioComercial = await createPropietarioComercial(
      propietario,
      rif,
      telefono,
      email,
      direccion
    );
    res.status(201).json(newPropietarioComercial);
  } catch (error) {
    console.error("Error al crear propietario comercial:", error);
    res.status(500).json({ error: "Error al crear propietario comercial" });
  }
};
export const getAllPropietariosComercialesController = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { propietariosComerciales, totalItems } = await getAllPropietariosComerciales(
      limit,
      offset,
      search
    );

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      propietariosComerciales,
      currentPage: parseInt(page, 10),
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.error("Error al obtener propietarios comerciales:", error);
    res.status(500).json({ error: "Error al obtener propietarios comerciales" });
  }
};
export const getPropietarioComercialByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const propietarioComercial = await getPropietarioComercialById(id);
    res.status(200).json(propietarioComercial);
  } catch (error) {
    console.error("Error al obtener propietario comercial por ID:", error);
    res.status(500).json({ error: error.message });
  }
};
export const updatePropietarioComercialController = async (req, res) => {
  const { id } = req.params;
  const { propietario, rif, telefono, email, direccion } = req.body;

  try {
    const updatedPropietarioComercial = await updatePropietarioComercial(
      id,
      propietario,
      rif,
      telefono,
      email,
      direccion
    );
    res.status(200).json(updatedPropietarioComercial);
  } catch (error) {
    console.error("Error al actualizar propietario comercial:", error);
    res.status(500).json({ error: "Error al actualizar propietario comercial" });
  }
};
export const deletePropietarioComercialController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPropietarioComercial = await deletePropietarioComercial(id);
    res.status(200).json({
      message: "Propietario comercial eliminado",
      propietarioComercial: deletedPropietarioComercial,
    });
  } catch (error) {
    console.error("Error al eliminar propietario comercial:", error);
    res.status(500).json({ error: "Error al eliminar propietario comercial" });
  }
};
