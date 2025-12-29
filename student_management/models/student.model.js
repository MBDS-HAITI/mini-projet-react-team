// models/student.model.js
import mongoose from "mongoose";

const StudentSchema = mongoose.Schema({
    firstName: { type: String, required: [true, "Please enter the firstName"], minLength: 3},
    lastName: { type: String, required: [true, "Please enter the lastName"], minLength: 3 },
    dateOfBith: { type: Date , default: null },
    sex: { type: String, enum: ["M","F"],uppercase: true, required: true },
    phone: { type: String , default: "",  sparse: true,  minLength: 8, maxLength: 15 },
    address: { type: String , default: ""},
    studentCode: { type: String, uppercase: true, unique: true, sparse: true, required: [true, "Please enter the lastName"] },
    haveInAccount: { type: Boolean, default: false  },
}, { timestamps: true });

StudentSchema.index({ lastName: 1, firstName: 1 });

const Student = mongoose.model('Student', StudentSchema);

export default Student;

