import express from "express";
import {
  createTasaDeCambioController,
  getAllTasasDeCambioController,
  getTasaDeCambioByIdController,
  updateTasaDeCambioController,
  deleteTasaDeCambioController,
} from "../controllers/tasaDeCambioController.js";

const router = express.Router();

router.post("/", createTasaDeCambioController);
router.get("/", getAllTasasDeCambioController);
router.get("/:id", getTasaDeCambioByIdController);
router.put("/:id", updateTasaDeCambioController);
router.delete("/:id", deleteTasaDeCambioController);

export default router;
