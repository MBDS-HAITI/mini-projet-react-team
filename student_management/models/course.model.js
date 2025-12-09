const mongoose = require('mongoose');

const CourseShema = mongoose.Schema({
    name : {type: String, required: [true, "Please enter the course name"]},
    code : {type: String, required: [true, "Please enter the code"]} 
});

const Course = mongoose.model('Course', CourseShema)

module.exports = Course;
