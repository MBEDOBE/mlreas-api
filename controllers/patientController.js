import Patient from "../models/Patient.js";

export const addPatient = async (req, res) => {
  try {
    const { name, age, gender, medicalCondition, notes, doctorId } = req.body;

    // Create a new patient object with the additional fields
    const patient = new Patient({
      name,
      age,
      gender,
      medicalCondition,
      notes,
      doctorId,
    });

    // Save the patient to the database
    await patient.save();

    // Return the newly created patient
    res.status(201).json(patient);
  } catch (err) {
    console.error("Error adding patient:", err); // Log the error for debugging purposes
    res.status(500).send("Server error");
  }
};

export const getPatients = async (req, res) => {
  try {
    let patients;

    // Admin and lab_technician can see all patients with their assigned doctor
    if (req.user.role === "admin" || req.user.role === "lab_technician") {
      patients = await Patient.find().populate("doctorId", "name");
    }
    // Doctors can only see their assigned patients
    else if (req.user.role === "doctor") {
      patients = await Patient.find({ doctorId: req.user.id }).populate(
        "doctorId",
        "name"
      );
    }
    // If the user's role doesn't match, return an unauthorized error
    else {
      return res.status(403).json({ message: "Access denied" });
    }

    // Return the list of patients including all the new fields
    res.status(200).json(patients);
  } catch (err) {
    console.error("Error fetching patients:", err); // Log the error for debugging purposes
    res.status(500).send("Server error");
  }
};
