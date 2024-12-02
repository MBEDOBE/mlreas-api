// routes/thresholds.js
import express from "express";
import { getThresholds } from "../controllers/thresholdController.js";

const router = express.Router();

router.get("/", getThresholds); // Define the route to get thresholds

export default router;
