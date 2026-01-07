import Student from "../models/Student/student.js";
import Admission from "../models/Student/admission.js";
import { authorityModel } from "../models/Academic/authorities.js";



export const createAdmission = async (req, res) => {
    try {
        const admissionData = req.body;
        const newAdmission = new Admission(admissionData);
        await newAdmission.save();
        res.status(201).json({ success: true, message: "Admission created successfully", admission: newAdmission });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating admission", error: error.message });
    }
};

export const getAllAdmissions = async (req, res) => {
    try {
        const admissions = await Admission.find();
        res.status(200).json(admissions);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching admissions", error: error.message });
    }
};

export const getAdmissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const admission = await Admission.findById(id);
        if (!admission) {
            return res.status(404).json({ success: false, message: "Admission not found" });
        }
        res.status(200).json({ success: true, admission });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching admission", error: error.message });
    }
};

export const verifyAdmission = async (req, res) => {
    try {
        const { admissionId, registrationNumber } = req.body;
        const admission = await Admission.findById(admissionId);
        if (!admission) {
            return res.status(404).json({ success: false, message: "Admission not found" });
        }
        const newStudent = new Student({
            name: admission.name,
            class: admission.class,
            stream: admission.stream,
            medium: admission.medium,
            fatherName: admission.fatherName,
            motherName: admission.motherName,
            dob: admission.dob || "",
            phone: admission.phone || "",
            address: admission.address,
            aadhar: admission.aadhar || "",
            pen: admission.pen || "",
            registrationNo: registrationNumber,

        });
        await newStudent.save();
        await Admission.findByIdAndDelete(admissionId);

        const principal = await authorityModel.findOne({role: "Principal"});
        res.status(201).json({ success: true, message: "Admission verified and student created successfully", student: newStudent, principal });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error verifying admission", error: error.message });
    }
};

export const deleteAdmission = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAdmission = await Admission.findByIdAndDelete(id);
        if (!deletedAdmission) {
            return res.status(404).json({ success: false, message: "Admission not found" });
        }
        res.status(200).json({ success: true, message: "Admission deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting admission", error: error.message });
    }
};