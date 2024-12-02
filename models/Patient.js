// models/Patient.js
import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true }, // Added gender field
  medicalCondition: { type: String, required: true }, // Added medicalCondition field
  notes: { type: String }, // Added notes field (optional)
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Patient = mongoose.model("Patient", PatientSchema);
export default Patient;
