// routes/patients.js
import express from "express";
import { addPatient, getPatients } from "../controllers/patientController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("doctor", "admin"), addPatient);
router.get(
  "/",
  protect,
  authorize("doctor", "admin", "lab_technician"),
  getPatients
);

export default router;
