import express from "express";
import {
  createCodigoTransaccionalController,
  getAllCodigoTransaccionalesController,
  getCodigoTransaccionalByIdController,
  updateCodigoTransaccionalController,
  deleteCodigoTransaccionalController,
} from "../controllers/codigoTransaccionalesController.js";

const router = express.Router();

router.post("/", createCodigoTransaccionalController);
router.get("/", getAllCodigoTransaccionalesController);
router.get("/:id", getCodigoTransaccionalByIdController);
router.put("/:id", updateCodigoTransaccionalController);
router.delete("/:id", deleteCodigoTransaccionalController);

export default router;
