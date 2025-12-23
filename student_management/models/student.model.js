// models/student.model.js
import mongoose from "mongoose";

const StudentSchema = mongoose.Schema({
    firstName: { type: String, required: [true, "Please enter the firstName"], minLength: 3},
    lastName: { type: String, required: [true, "Please enter the lastName"], minLength: 3 },
    dateOfBith: { type: Date , default: null },
    sex: { type: String, enum: ["M","F"],uppercase: true, required: true },
    phone: String,
    address: String,
    studentCode: { type: String, uppercase: true, unique: true, sparse: true }
}, { timestamps: true });

StudentSchema.index({ lastName: 1, firstName: 1 });

const Student = mongoose.model('Student', StudentSchema);

export default Student;

