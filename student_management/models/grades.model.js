const mongoose = require('mongoose')

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

const grades = mongoose.model('grades', gradesSchema)

module.exports = grades;

