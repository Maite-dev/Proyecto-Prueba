import {
    getCargosBancarios,
    getCargoBancarioById,
  } from "../models/cargosBancariosModel.js";
  
  export const getAllCargosController = async (req, res) => {
    const { page = 1, limit = 10, search = "", mes = "", año = "" } = req.query;
    const offset = (page - 1) * limit;
  
    try {
      const { cargos, totalItems } = await getCargosBancarios(limit, offset, search, mes, año);
      const totalPages = Math.ceil(totalItems / limit);
  
      res.status(200).json({
        cargos,
        totalItems,
        totalPages,
        currentPage: parseInt(page, 10),
      });
    } catch (error) {
      console.error("Error al obtener los cargos bancarios:", error.message);
      res.status(500).json({
        message: "Error al obtener los cargos bancarios",
        error: error.message,
      });
    }
  };
  
  export const getCargoByIdController = async (req, res) => {
    const { id } = req.params;
  
    try {
      const cargo = await getCargoBancarioById(id);
  
      if (!cargo) {
        return res.status(404).json({
          message: `Cargo bancario con ID ${id} no encontrado`,
        });
      }
  
      res.status(200).json(cargo);
    } catch (error) {
      console.error("Error al obtener el cargo bancario por ID:", error.message);
      res.status(500).json({
        message: "Error al obtener el cargo bancario por ID",
        error: error.message,
      });
    }
  };
  