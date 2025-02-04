import { getAllContratosPorFinalizar } from "../models/contratosPorMesModel.js";

export const getAllContratosPorFinalizarController = async (req, res) => {
  try {
    const { months } = req.query; // Leer el parámetro `months` de la URL

    const monthsToCheck = months && !isNaN(months) ? parseInt(months, 10) : 2; // Por defecto 2 meses

    const contratos = await getAllContratosPorFinalizar(monthsToCheck);

    return res.status(200).json({
      status: "success",
      message: "Contratos obtenidos con éxito.",
      contratos,
    });
  } catch (error) {
    console.error("Error al obtener contratos por finalizar:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener contratos por finalizar.",
    });
  }
};
