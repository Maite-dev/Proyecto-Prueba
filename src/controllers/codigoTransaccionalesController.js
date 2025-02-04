import {
    createCodigoTransaccional,
    getAllCodigoTransaccionales,
    getCodigoTransaccionalById,
    updateCodigoTransaccional,
    deleteCodigoTransaccional,
  } from "../models/codigoTransaccionalesModel.js";
  
  export const createCodigoTransaccionalController = async (req, res) => {
    const { codigo, descripcion } = req.body;
  
    if (!codigo || !descripcion) {
      return res.status(400).json({ error: "Los campos 'codigo' y 'descripcion' son obligatorios." });
    }
  
    try {
      const newCodigoTransaccional = await createCodigoTransaccional(codigo, descripcion);
      res.status(201).json(newCodigoTransaccional);
    } catch (error) {
      console.error("Error al crear el código transaccional:", error);
      res.status(500).json({ error: "Error al crear el código transaccional" });
    }
  };
  
  export const getAllCodigoTransaccionalesController = async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;
  
    try {
      const { codigosTransaccionales, totalItems } = await getAllCodigoTransaccionales(limit, offset, search);
      const totalPages = Math.ceil(totalItems / limit);
  
      res.status(200).json({
        codigosTransaccionales,
        currentPage: parseInt(page, 10),
        totalPages,
        totalItems,
      });
    } catch (error) {
      console.error("Error al obtener los códigos transaccionales:", error);
      res.status(500).json({ error: "Error al obtener los códigos transaccionales" });
    }
  };
  
  export const getCodigoTransaccionalByIdController = async (req, res) => {
    const { id } = req.params;
    try {
      const codigoTransaccional = await getCodigoTransaccionalById(id);
      res.status(200).json(codigoTransaccional);
    } catch (error) {
      console.error("Error al obtener el código transaccional por ID:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  export const updateCodigoTransaccionalController = async (req, res) => {
    const { id } = req.params;
    const { codigo, descripcion } = req.body;
  
    try {
      const updatedCodigoTransaccional = await updateCodigoTransaccional(id, codigo, descripcion);
      res.status(200).json(updatedCodigoTransaccional);
    } catch (error) {
      console.error("Error al actualizar el código transaccional:", error);
      res.status(500).json({ error: "Error al actualizar el código transaccional" });
    }
  };
  
  export const deleteCodigoTransaccionalController = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedCodigoTransaccional = await deleteCodigoTransaccional(id);
      res.status(200).json({
        message: "Código transaccional eliminado con éxito",
        codigoTransaccional: deletedCodigoTransaccional,
      });
    } catch (error) {
      console.error("Error al eliminar el código transaccional:", error);
      res.status(500).json({ error: "Error al eliminar el código transaccional" });
    }
  };
  