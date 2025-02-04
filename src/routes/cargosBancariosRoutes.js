import express from "express";
import {
  getAllCargosController,
  getCargoByIdController,
} from "../controllers/cargosBancariosController.js";

const router = express.Router();

// Ruta para obtener todos los cargos bancarios con filtros y paginación
router.get("/", getAllCargosController);

// Ruta para obtener un cargo bancario por su ID
router.get("/:id", getCargoByIdController);

export default router;
