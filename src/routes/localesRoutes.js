import express from "express";
import { 
  createLocalController,
  getAllLocalesController,
  getLocalByIdController,
  updateLocalController,
  deleteLocalController 
} from "../controllers/localesController.js";

const router = express.Router();

router.post("/", createLocalController);
router.get("/", getAllLocalesController);
router.get("/:id", getLocalByIdController);
router.put("/:id", updateLocalController);
router.delete("/:id", deleteLocalController);

export default router;
