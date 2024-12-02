// controllers/labResultController.js
import LabResult from "../models/LabResult.js";
import Threshold from "../models/Threshold.js";
import Patient from "../models/Patient.js";

export const addLabResult = async (req, res) => {
  try {
    const { patientId, testType, result } = req.body;

    // Validate required fields
    if (!patientId || !testType || !result) {
      console.error("Missing required fields in request body");
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Save lab result
    const labResult = new LabResult({ patientId, testType, result });
    await labResult.save();

    // Find the patient and verify doctor details
    const patient = await Patient.findById(patientId).populate("doctorId");
    if (!patient) {
      console.error(`Patient with ID ${patientId} not found`);
      return res.status(404).json({ message: "Patient not found" });
    }
    if (!patient.doctorId) {
      console.error(`No doctor assigned to patient ${patient.name}`);
      return res.status(400).json({ message: "No doctor assigned to patient" });
    }

    // Check if the result is critical
    const threshold = await Threshold.findOne({ testType });
    if (!threshold) {
      console.warn(`Threshold for test type ${testType} not found`);
    } else if (result < threshold.minValue || result > threshold.maxValue) {
      console.log(`Critical result detected for ${testType}: ${result}`);
      // Log critical result handling (add additional logic if needed)
    }

    console.log("Lab result saved successfully:", labResult);
    res.status(201).json(labResult);
  } catch (err) {
    console.error("Error in addLabResult:", err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const getLabResults = async (req, res) => {
  try {
    const labResults = await LabResult.find().populate("patientId", "name");
    res.status(200).json(labResults);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch lab results for a specific patient
export const getLabResultsForPatient = async (req, res) => {
  const { patientId } = req.params;

  try {
    const labResults = await LabResult.find({ patientId }).sort({
      timestamp: -1,
    });

    if (labResults.length === 0) {
      return res
        .status(404)
        .json({ message: "No lab results found for this patient." });
    }

    res.status(200).json(labResults);
  } catch (err) {
    console.error("Error fetching lab results:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Simulate fetching alerts (lab results created within the last X minutes)
export const getLabAlerts = async (req, res) => {
  try {
    const recentResults = await LabResult.find({
      timestamp: { $gte: new Date(Date.now() - 10 * 60 * 1000) }, // Last 10 minutes
    }).populate("patientId", "name");

    const alerts = recentResults.map((result) => ({
      message: `New lab result for patient ${result.patientId.name}: ${result.testType} = ${result.result}`,
      patientName: result.patientId.name,
      critical: false, // Add logic for critical alerts if needed
    }));

    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
};
// Get critical lab results for a doctor's patients

export const getCriticalLabResults = async (req, res) => {
  try {
    const patients = await Patient.find({ doctorId: req.user.id });
    const patientIds = patients.map((patient) => patient._id);

    const labResults = await LabResult.find({
      patientId: { $in: patientIds },
      resolved: false, // Only fetch unresolved results
    }).populate("patientId", "name");

    const criticalAlerts = [];

    for (const result of labResults) {
      const threshold = await Threshold.findOne({ testType: result.testType });
      if (
        threshold &&
        (result.result < threshold.minValue ||
          result.result > threshold.maxValue)
      ) {
        criticalAlerts.push({
          message: `Critical lab result for ${result.patientId.name}: ${result.testType} = ${result.result}`,
          patientId: result.patientId._id,
          testType: result.testType,
          result: result.result,
          timestamp: result.timestamp,
          labResultId: result._id, // Include labResultId for the frontend
        });
      }
    }

    res.status(200).json(criticalAlerts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mark lab result as viewed after doctor views it
export const markLabResultAsResolved = async (req, res) => {
  const { labResultId } = req.params;

  try {
    const labResult = await LabResult.findByIdAndUpdate(
      labResultId,
      { resolved: true },
      { new: true }
    );

    if (!labResult) {
      return res.status(404).json({ message: "Lab result not found." });
    }

    res.status(200).json({ message: "Lab result marked as resolved." });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark lab result as resolved." });
  }
};
