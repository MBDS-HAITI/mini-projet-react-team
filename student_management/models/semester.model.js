// models/semester.model.js
import mongoose from "mongoose";

const SemesterSchema = new mongoose.Schema({
  academicYear: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "AcademicYear",
  required: [true, "academicYear est obligatoire"],
},
  name: { type: String, enum: ["S1","S2"], required: true },
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

SemesterSchema.index({ academicYear: 1, name: 1 }, { unique: true });

const Semester = mongoose.model("Semester", SemesterSchema);

export default Semester; 

