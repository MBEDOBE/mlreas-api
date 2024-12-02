// models/LabResult.js
import mongoose from "mongoose";

const LabResultSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", // Reference to the Patient model
      required: true,
    },
    testType: { type: String, required: true },
    result: { type: Number, required: true },
    resolved: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const LabResult = mongoose.model("LabResult", LabResultSchema);
export default LabResult;
