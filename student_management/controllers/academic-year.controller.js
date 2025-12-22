import AcademicYear from "../models/academic-year.model.js";

export const postAcademicYear = async(req, res) => {
   try {const academicYear = await AcademicYear.create(req.body);
    res.status(201).json(academicYear);
   }
   catch(error) {
    res.status(500).json({message: error.message});
   }
};

export const getAllAcademicYears = async(req, res) => {
   try {const academicYear = await AcademicYear.find();
        res.status(200).json(academicYear);
   } catch (error) {
        res.status(500).json({message: error.message});
   }
};

export const getAcademicYear = async (req,res)=>{
    try {
        const {id} = req.params;
        const academicYear = await AcademicYear.findById(id);
        if (!academicYear) {
            return res.status(404).json({message: `AcademicYear not found`});
        }
        res.status(200).json(academicYear);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const putAcademicYear = async (req,res)=>{
    try {
        const {id} = req.params;
        const academicYear = await AcademicYear.findByIdAndUpdate(id, req.body,{ new: true, runValidators: true });

        if (!academicYear) {
            return res.status(404).json({message: `AcademicYear not found`});
        }
        const updatedAcademicYear = await AcademicYear.findById(id);
        res.status(200).json(updatedAcademicYear);
    } catch (error) {
        res.status(500).json({message: error.message});
    }  
};

export const deleteAcademicYear = async (req,res)=>{
    try {
        const academicYear = await AcademicYear.findByIdAndDelete(req.params.id);
        res.status(200).json(AcademicYear);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
