import Semester from "../models/semester.model.js";
import mongoose from'mongoose';

export const postSemester = async(req, res) => {
   try {
    const semester = await Semester.create(req.body);
    res.status(201).json(semester);
   }
   catch(error) {
    res.status(500).json({message: error.message});

   }
};

export const getAllSemesters = async(req, res) => {
   try {
        const semesters = await Semester.find();
        res.status(200).json(semesters);
   } catch (error) {
        res.status(500).json({message: error.message});
   }
};

export const getAllSemestersByAcademicYear = async(req, res) => {
   try {
        const {academicYearId} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(academicYearId)) {
            return res.status(400).json({ message: "Academic Year invalide" });
        }

        const semesters = await Semester.find({ academicYear: academicYearId });
        res.status(200).json(semesters);
   } catch (error) {
        res.status(500).json({message: error.message});
   }
};

export const getSemester = async (req,res)=>{
    try {
        const {id} = req.params;
        const semester = await Semester.findById(id).populate('academicYear');
        if (!semester) {
            return res.status(404).json({message: `Semester not found`});
        }
        res.status(200).json(semester);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const putSemester = async (req,res)=>{
    try {
        const {id} = req.params;
        const semester = await Semester.findByIdAndUpdate(id, req.body);

        if (!semester) {
            return res.status(404).json({message: `Semester not found`});
        }
        const updatedSemester = await Semester.findById(id);
        res.status(200).json(updatedSemester);
    } catch (error) {
        res.status(500).json({message: error.message});
    }  
};

export const deleteSemester = async (req,res)=>{
    try {
        const semester = await Semester.findByIdAndDelete(req.params.id);
        res.status(200).json(Semester);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
