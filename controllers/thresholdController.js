// controllers/thresholdController.js
import Threshold from "../models/Threshold.js";

// Controller to get all thresholds
export const getThresholds = async (req, res) => {
  try {
    const thresholds = await Threshold.find();
    res.json(thresholds);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching thresholds" });
  }
};
