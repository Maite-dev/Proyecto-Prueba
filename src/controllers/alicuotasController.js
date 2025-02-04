import { getAlicuotas, getAlicuotaById } from "../models/alicuotasModel.js";

export const getAlicuotasController = async (req, res) => {
  try {
    const { limit = 10, offset = 0, search = "" } = req.query;

    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedOffset = parseInt(offset, 10) || 0;

    const { alicuotas, totalItems } = await getAlicuotas(
      parsedLimit,
      parsedOffset,
      search
    );

    const currentPage = Math.ceil(parsedOffset / parsedLimit) + 1;
    const totalPages = Math.ceil(totalItems / parsedLimit);

    res.status(200).json({
      alicuotas,
      currentPage,
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.error("Error al obtener las alícuotas:", error.message);
    res.status(500).json({
      message: "Error al obtener las alícuotas",
      error: error.message,
    });
  }
};
export const getAlicuotaByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const alicuota = await getAlicuotaById(id);
    res.status(200).json(alicuota);
  } catch (error) {
    console.error("Error al obtener la alícuota por id:", error);
    res.status(500).json({ message: "Error al obtener la alícuota" });
  }
};
