import express from "express";
import {
  createComercialController,
  getAllComercialesController,
  getComercialByIdController,
  updateComercialController,
  deleteComercialController,
} from "../controllers/comercialController.js";

const router = express.Router();

router.post("/", createComercialController);
router.get("/", getAllComercialesController);
router.get("/:id", getComercialByIdController);
router.put("/:id", updateComercialController);
router.delete("/:id", deleteComercialController);

export default router;
