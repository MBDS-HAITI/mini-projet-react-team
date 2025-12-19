import Enrollment from "../models/enrollment.model.js";
import Semester from "../models/semester.model.js";
import mongoose from'mongoose';

export const postEnrollment = async(req, res) => {
   try {
    const enrollment = await Enrollment.create(req.body);
    res.status(201).json(enrollment);
   }
   catch(error) {
    res.status(500).json({message: error.message});
   }
};

export const getAllEnrollments = async(req, res) => {
   try {
        const enrollments = await Enrollment.find()
                                    .populate('student')
                                    .populate('course');
        res.status(200).json(enrollments);
   } catch (error) {
        res.status(500).json({message: error.message});
   }
};

export const getAllEnrollmentsBySemesterId = async(req, res) => {
   try {
        const {semesterId} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(semesterId)) {
            return res.status(400).json({ message: "semester invalide" });
        }

        const enrollments = await Enrollment.find({ semester: semesterId })
                                    .populate('student')
                                    .populate('course');
        res.status(200).json(enrollments);
   } catch (error) {
        res.status(500).json({message: error.message});
   }
};

export const getAllEnrollmentsByAcademicYearId = async(req, res) => {
   try {
        const {academicYearId} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(academicYearId)) {
      return res.status(400).json({ message: "academicYearId invalide" });
    }

    // récupérer les semestres de l'année
    const semesters = await Semester.find({ academicYear: academicYearId }).select("_id");
    const semesterIds = semesters.map((s) => s._id);

    // récupérer les enrollments liés à ces semestres
    const enrollments = await Enrollment.find({ semester: { $in: semesterIds } })
                                .populate({
                                    path: "semester",
                                    populate: { path: "academicYear" },
                                })
                                .populate("student")
                                .populate("course");
        res.status(200).json(enrollments);
   } catch (error) {
        res.status(500).json({message: error.message});
   }
};

export const getEnrollment = async (req,res)=>{
    try {
        const {id} = req.params;
        const enrollment = await Enrollment.findById(id)
                                    .populate({
                                        path: "semester",
                                        populate: { path: "academicYear" }
                                    })
                                    .populate('student')
                                    .populate('course');
        if (!enrollment) {
            return res.status(404).json({message: `Enrollment not found`});
        }
        res.status(200).json(enrollment);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const putEnrollment = async (req,res)=>{
    try {
        const {id} = req.params;
        const enrollment = await Enrollment.findByIdAndUpdate(id, req.body);

        if (!enrollment) {
            return res.status(404).json({message: `Enrollment not found`});
        }
        const updatedEnrollment = await Enrollment.findById(id);
        res.status(200).json(updatedEnrollment);
    } catch (error) {
        res.status(500).json({message: error.message});
    }  
};

export const deleteEnrollment = async (req,res)=>{
    try {
        const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
        res.status(200).json(Enrollment);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
