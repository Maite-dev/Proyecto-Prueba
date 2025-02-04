import express from "express";
import {
  createTransferenciaController,
  getAllTransferenciasController,
  getTransferenciaByIdController,
  updateTransferenciaController,
  deleteTransferenciaController,
} from "../controllers/transferenciasController.js";

const router = express.Router();

router.post("/", createTransferenciaController);
router.get("/", getAllTransferenciasController);
router.get("/:id", getTransferenciaByIdController);
router.put("/:id", updateTransferenciaController);
router.delete("/:id", deleteTransferenciaController);

export default router;
