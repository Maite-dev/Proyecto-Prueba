import express from "express";
import {
  createIngresoController,
  getAllIngresosController,
  getIngresoByIdController,
  updateIngresoController,
  deleteIngresoController,
} from "../controllers/ingresosEnEfectivoController.js";

const router = express.Router();

router.post("/", createIngresoController);
router.get("/", getAllIngresosController);
router.get("/:id", getIngresoByIdController);
router.put("/:id", updateIngresoController);
router.delete("/:id", deleteIngresoController);

export default router;
