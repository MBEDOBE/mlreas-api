// routes/labResults.js
import express from "express";
import {
  addLabResult,
  getCriticalLabResults,
  getLabAlerts,
  getLabResults,
  getLabResultsForPatient,
  markLabResultAsResolved,
} from "../controllers/labResultController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("lab_technician"), addLabResult);
router.get("/", getLabResults);
router.get(
  "/patient/:patientId",
  protect,
  authorize("doctor"),
  getLabResultsForPatient
);
router.get("/alerts", protect, authorize("doctor"), getLabAlerts);
router.get(
  "/critical-alerts",
  protect,
  authorize("doctor"),
  getCriticalLabResults
);
router.patch(
  "/resolve/:labResultId",
  protect,
  authorize("doctor"),
  markLabResultAsResolved
);

export default router;
