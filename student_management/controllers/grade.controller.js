import Enrollment from "../models/enrollment.model.js";
import Grade from "../models/grade.model.js";
import Semester from "../models/semester.model.js";
import mongoose from'mongoose';

export const postGrade = async(req, res) => {
   try {
    const grade = await Grade.create(req.body);
    res.status(201).json(grade);
   }
   catch(error) {
    res.status(500).json({message: error.message});
   }
};

export const getAllGrades = async(req, res) => {
   try {
        const grades = await Grade.find()
                                    .populate('enrollment');
        res.status(200).json(grades);
   } catch (error) {
        res.status(500).json({message: error.message});
   }
};

export const getAllGradesBySemesterId = async(req, res) => {
   try {
        const {semesterId} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(semesterId)) {
            return res.status(400).json({ message: "semester invalide" });
        }

        const enrollments = await Enrollment.find({ semester: semesterId});
        const enrollmentIds = enrollments.map((s) => s._id);

        const grades = await Grade.find({ enrollment: {$in: enrollmentIds} })
                                    .populate('enrollment');
        res.status(200).json(grades);
   } catch (error) {
        res.status(500).json({message: error.message});
   }
};


export const getGrade = async (req,res)=>{
    try {
        const {id} = req.params;
        const grade = await Grade.findById(id)
                                    .populate({
                                        path: "semester",
                                        populate: { path: "academicYear" }
                                    })
                                    .populate('student')
                                    .populate('course');
        if (!grade) {
            return res.status(404).json({message: `Grade not found`});
        }
        res.status(200).json(grade);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const putGrade = async (req,res)=>{
    try {
        const {id} = req.params;
        const grade = await Grade.findByIdAndUpdate(id, req.body);

        if (!grade) {
            return res.status(404).json({message: `Grade not found`});
        }
        const updatedGrade = await Grade.findById(id);
        res.status(200).json(updatedGrade);
    } catch (error) {
        res.status(500).json({message: error.message});
    }  
};

export const deleteGrade = async (req,res)=>{
    try {
        const grade = await Grade.findByIdAndDelete(req.params.id);
        res.status(200).json(Grade);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
