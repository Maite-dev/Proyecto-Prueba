import express from "express";
import {
  getAllAbonosController,
  getAbonoByIdController,
} from "../controllers/abonosBancariosController.js";

const router = express.Router();

// Ruta para obtener todos los abonos bancarios (con paginación y filtros)
router.get("/", getAllAbonosController);

// Ruta para obtener un abono bancario por ID
router.get("/:id", getAbonoByIdController);

export default router;
