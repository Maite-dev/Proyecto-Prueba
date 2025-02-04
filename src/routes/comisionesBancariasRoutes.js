import express from "express";
import {
  getComisionesBancariasController,
  getComisionBancariaByIdController,
} from "../controllers/comisionesBancariasController.js";

const router = express.Router();

router.get("/", getComisionesBancariasController); 
router.get("/:id", getComisionBancariaByIdController); 

export default router;
