const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
    firstName: { type: String, required: [true, "Please enter the firstName"], minLength: 3},
    lastName: { type: String, required: [true, "Please enter the lastName"], minLength: 3 },
    // photo: { type: String },
    // email: { type: String, required: true, unique: true },
    // enrollmentDate: { type: Date, default: Date.now }
    // { timestamps: true} // createdAt, updatedAt
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;