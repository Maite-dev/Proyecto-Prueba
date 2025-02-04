import express from "express";
import {
  createContratoController,
  deleteContratoController,
  getAllContratosController,
  getContratoByIdController,
  updateContratoController,
} from "../controllers/contratosController.js";

const router = express.Router();

router.post("/", createContratoController);
router.get("/", getAllContratosController);
router.get("/:id", getContratoByIdController);
router.put("/:id", updateContratoController);
router.delete("/:id", deleteContratoController);

export default router;
