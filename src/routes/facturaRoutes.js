import express from "express";
import {
  createFacturaConDetallesController,
  getAllFacturasConDetallesController,
  getFacturaByIdConDetallesController,
  updateFacturaConDetallesController,
  deleteFacturaConDetallesController,
} from "../controllers/facturaController.js";

const router = express.Router();

router.post("/", createFacturaConDetallesController);
router.get("/", getAllFacturasConDetallesController);
router.get("/:id", getFacturaByIdConDetallesController);
router.put("/:id", updateFacturaConDetallesController);
router.delete("/:id", deleteFacturaConDetallesController);

export default router;
