// models/grade.model.js
import mongoose from "mongoose";

const GradeSchema = new mongoose.Schema({
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment", required: true },
  value: { type: Number, required: true, min: 0, max: 100 },
  gradedAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

// Une note par inscription 
GradeSchema.index({ enrollmentId: 1 }, { unique: true });

const Grade = mongoose.model("Grade", GradeSchema);

export default Grade;
