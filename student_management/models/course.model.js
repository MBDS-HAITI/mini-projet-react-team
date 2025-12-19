// models/course.model.js
import mongoose from "mongoose";

const CourseShema = mongoose.Schema({
    name : {type: String, required: [true, "Please enter the course name"],  trim: true },
    code : {type: String, required: [true, "Please enter the code"], trim: true, uppercase: true, unique: true}, 
    credits: { type: Number, default: 0 },
}, { timestamps: true });

const Course = mongoose.model('Course', CourseShema)

export default Course;
