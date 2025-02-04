import {
    getAbonosBancarios,
    getAbonoBancarioById,
  } from "../models/abonosBancariosModel.js";
  
  export const getAllAbonosController = async (req, res) => {
    const { page = 1, limit = 10, search = "", mes = "", año = "" } = req.query;
    const offset = (page - 1) * limit;
  
    try {
      const { abonos, totalItems } = await getAbonosBancarios(limit, offset, search, mes, año);
      const totalPages = Math.ceil(totalItems / limit);
  
      res.status(200).json({
        abonos,
        totalItems,
        totalPages,
        currentPage: parseInt(page, 10),
      });
    } catch (error) {
      console.error("Error al obtener los abonos bancarios:", error.message);
      res.status(500).json({
        message: "Error al obtener los abonos bancarios",
        error: error.message,
      });
    }
  };
  
  export const getAbonoByIdController = async (req, res) => {
    const { id } = req.params;
  
    try {
      const abono = await getAbonoBancarioById(id);
  
      if (!abono) {
        return res.status(404).json({
          message: `Abono bancario con ID ${id} no encontrado`,
        });
      }
  
      res.status(200).json(abono);
    } catch (error) {
      console.error("Error al obtener el abono bancario por ID:", error.message);
      res.status(500).json({
        message: "Error al obtener el abono bancario por ID",
        error: error.message,
      });
    }
  };
  