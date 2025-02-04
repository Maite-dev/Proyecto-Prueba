import express from "express";
import { exportToSheet } from "../utils/exportToSheet.js";

const router = express.Router();

// Ruta para exportar datos en JSON
router.get("/exportar-datos", exportToSheet);

export default router;
