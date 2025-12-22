import Course from "../models/course.model.js";

export const postCourse = async(req, res) => {
   try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
   }
   catch(error) {
    res.status(500).json({message: error.message});

   }
};

export const getAllCourses = async(req, res) => {
   try {
        const course = await Course.find();
        res.status(200).json(course);
   } catch (error) {
        res.status(500).json({message: error.message});
   }
};

export const getCourse = async (req,res)=>{
    try {
        const {id} = req.params;
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({message: `Course not found`});
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const putCourse = async (req,res)=>{
    try {
        const {id} = req.params;
        const course = await Course.findByIdAndUpdate(id, req.body,{ new: true, runValidators: true });

        if (!course) {
            return res.status(404).json({message: `Course not found`});
        }
        const updatedCourse = await Course.findById(id);
        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(500).json({message: error.message});
    }  
};

export const deleteCourse = async (req,res)=>{
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        res.status(200).json(Course);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
