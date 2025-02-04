import express from "express";
import {
  createPropietarioController,
  getAllPropietariosController,
  getPropietarioByIdController,
  updatePropietarioController,
  deletePropietarioController,
} from "../controllers/propetariosController.js";

const router = express.Router();

router.post("/", createPropietarioController);
router.get("/", getAllPropietariosController);
router.get("/:id", getPropietarioByIdController);
router.put("/:id", updatePropietarioController);
router.delete("/:id", deletePropietarioController);

export default router;
