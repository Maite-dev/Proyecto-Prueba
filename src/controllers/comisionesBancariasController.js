import {
  getComisionesBancarias,
  getComisionBancariaById,
} from "../models/comisionesBancariasModel.js";

export const getComisionesBancariasController = async (req, res) => {
  try {
    const {
      limit = 10,
      offset = 0,
      search = "",
      mes = "",
      año = "",
    } = req.query;

    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedOffset = parseInt(offset, 10) || 0;

    const { comisiones, totalItems } = await getComisionesBancarias(
      parsedLimit,
      parsedOffset,
      search,
      mes,
      año
    );

    const currentPage = Math.ceil(parsedOffset / parsedLimit) + 1;
    const totalPages = Math.ceil(totalItems / parsedLimit);

    res.status(200).json({
      comisiones,
      currentPage,
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.error("Error al obtener las comisiones bancarias:", error.message);
    res.status(500).json({
      message: "Error al obtener las comisiones bancarias",
      error: error.message,
    });
  }
};

export const getComisionBancariaByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const comision = await getComisionBancariaById(id);
    res.status(200).json(comision);
  } catch (error) {
    console.error("Error al obtener la comisión bancaria por id:", error);
    res.status(500).json({ message: "Error al obtener la comisión bancaria" });
  }
};
