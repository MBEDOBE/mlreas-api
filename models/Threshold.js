// models/Threshold.js
import mongoose from "mongoose";

const ThresholdSchema = new mongoose.Schema({
  testType: { type: String, required: true },
  minValue: { type: Number, required: true },
  maxValue: { type: Number, required: true },
});

const Threshold = mongoose.model("Threshold", ThresholdSchema);
export default Threshold;
