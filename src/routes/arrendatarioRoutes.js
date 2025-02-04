import express from "express";
import {
  createArrendatarioController,
  getArrendatariosController,
  getArrendatarioByIdController,
  deleteArrendatarioController,
  updateArrendatarioController,
} from "../controllers/arrendatarioController.js";

const router = express.Router();

router.post("/", createArrendatarioController);
router.get("/", getArrendatariosController);
router.get("/:id", getArrendatarioByIdController);
router.delete("/:id", deleteArrendatarioController);
router.put("/:id", updateArrendatarioController);

export default router;
