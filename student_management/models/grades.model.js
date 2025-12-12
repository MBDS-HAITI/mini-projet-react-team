import mongoose from "mongoose";
//const mongoose = require('mongoose')

const gradesSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, "Please provide the student id"]
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, "Please provide the course id"]
    },

    grades: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'grades',
        required: [true, "Please provide the grades"],
        min:0,
        max:100

    },

    date:{
        type: Date,
        default : Date.now
    }
});

const Grades = mongoose.model('grades', gradesSchema)

export default Grades;
