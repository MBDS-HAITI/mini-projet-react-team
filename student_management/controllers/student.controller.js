import Student from '../models/student.model.js';

export const postStudent = async (req,res)=>{
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getAllStudents = async (req,res)=>{
    try {
        const student = await Student.find({});
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getStudent = async (req,res)=>{
    try {
        const {id} = req.params;
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({message: `Student not found`});
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const putStudent = async (req,res)=>{
    try {
        const {id} = req.params;
        const student = await Student.findByIdAndUpdate(id, req.body);

        if (!student) {
            return res.status(404).json({message: `Student not found`});
        }
        const updatedStudent = await Student.findById(id);
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({message: error.message});
    }  
};

export const deleteStudent = async (req,res)=>{
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

