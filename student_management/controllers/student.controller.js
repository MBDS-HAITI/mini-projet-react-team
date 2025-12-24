import Student from '../models/student.model.js';

export const postStudent = async (req,res,next)=>{
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (error) {
        next(error);
    }
};

export const getAllStudents = async (req,res)=>{
    try {
        const student = await Student.find({});
        res.status(200).json(student);
    } catch (error) {
        res.status(404).json({isSuccess: false, message: `Student not found`});
    }
};

export const getStudents = async (req,res)=>{
    try {
        const {page =1, pageSize = 10, sortBy="lastName", asc="true", search=""} = req.query;
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(pageSize, 10) || 10, 1), 100);
        const skipNum = (pageNum - 1) * limitNum;

        const sortDir = (String(asc).toLowerCase() === "true") ? 1 : -1;

        // Filtre de recherche 
        const filter = search
        ? {
            $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
            ]
            }
        : {};

        const [students, total] = await Promise.all([
            Student.find(filter)
                .sort({ [sortBy]: sortDir })
                .skip(skipNum)
                .limit(limitNum),
            Student.countDocuments(filter)
            ]);
        
        if (!students) {
            return res.status(404).json({isSuccess: false, message: `Student not found`});
        }
        res.status(200).json({
            isSuccess: true,
            data: students,
            pagination: {
                page: pageNum,
                pageSize: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            },
            message:""
        });
    } catch (error) {
        res.status(500).json({isSuccess: false, message: error.message});
    }
}

export const getStudent = async (req,res)=>{
    try {
        const {id} = req.params;
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({isSuccess: false, message: `Student not found`});
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(404).json({isSuccess: false, message: `Student not found`});
    }
};

export const putStudent = async (req,res)=>{
    try {
        const {id} = req.params;
        const student = await Student.findByIdAndUpdate(id, req.body,{ new: true, runValidators: true });

        if (!student) {
            return res.status(404).json({isSuccess: false, message: `Student not found`});
        }
        const updatedStudent = await Student.findById(id);
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(404).json({isSuccess: false, message: `Student not found`});
    }  
};

export const deleteStudent = async (req,res)=>{
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        res.status(204).json(student);
    } catch (error) {
        res.status(404).json({isSuccess: false, message: `Student not found`});
    }
};

