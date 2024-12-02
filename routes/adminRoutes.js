import express from "express";
import {
  addOrUpdateThreshold,
  getThresholds,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/api/threshold", getThresholds);
router.post("/api/threshold", addOrUpdateThreshold);

export default router;
