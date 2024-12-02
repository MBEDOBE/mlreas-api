import Threshold from "../models/Threshold.js";

// Create or update a threshold
export const addOrUpdateThreshold = async (req, res) => {
  const { testType, minValue, maxValue } = req.body;
  try {
    let threshold = await Threshold.findOne({ testType });
    if (threshold) {
      // Update existing threshold
      threshold.minValue = minValue;
      threshold.maxValue = maxValue;
      await threshold.save();
      return res.status(200).json(threshold);
    }
    // Create new threshold
    threshold = new Threshold({ testType, minValue, maxValue });
    await threshold.save();
    res.status(201).json(threshold);
  } catch (err) {
    res.status(500).json({ message: "Failed to save threshold" });
  }
};

export const getThresholds = async (req, res) => {
  try {
    const thresholds = await Threshold.find();
    res.status(200).json(thresholds);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
