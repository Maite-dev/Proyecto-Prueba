import express from "express";
import {
  createPropietarioComercialController,
  getAllPropietariosComercialesController,
  getPropietarioComercialByIdController,
  updatePropietarioComercialController,
  deletePropietarioComercialController,
} from "../controllers/PropietariosComercialesController.js";


const router = express.Router();

router.post("/", createPropietarioComercialController);
router.get("/", getAllPropietariosComercialesController);
router.get("/:id", getPropietarioComercialByIdController);
router.put("/:id", updatePropietarioComercialController);
router.delete("/:id", deletePropietarioComercialController);

export default router;
