import express from "express";
import { getAllContratosPorFinalizarController } from "../controllers/contratosPorMesController.js";

const router = express.Router();

router.get("/", getAllContratosPorFinalizarController);

export default router;
