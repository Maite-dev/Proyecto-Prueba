import express from "express";
import {
  getAlicuotasController,
  getAlicuotaByIdController,
} from "../controllers/alicuotasController.js";

const router = express.Router();

router.get("/", getAlicuotasController);
router.get("/:id", getAlicuotaByIdController);

export default router;
