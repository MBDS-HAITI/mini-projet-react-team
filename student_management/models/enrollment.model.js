// models/enrollement.model.js
import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
  student:  { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  course:   { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester", required: true },

  status: { type: String, enum: ["ENROLLED","DROPPED","COMPLETED"], default: "ENROLLED" },
}, { timestamps: true });

// Un étudiant ne s’inscrit qu’une fois par cours et semestre
EnrollmentSchema.index({ studentId: 1, courseId: 1, semesterId: 1 }, { unique: true });

const Enrollment =mongoose.model("Enrollment", EnrollmentSchema);
export default Enrollment;
