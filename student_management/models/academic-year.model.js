// models/academic-year.model.js
import mongoose from "mongoose";

const ACADEMIC_YEAR_REGEX = /^\d{4}-\d{4}$/;

const AcademicYearSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    match: [ACADEMIC_YEAR_REGEX, "Format invalide. Exemple: 2025-2026"],
    validate: {
            validator: function (v) {
                const [start, end] = v.split("-").map(Number);
                return end === start + 1;
            },
            message: "Année académique invalide: la 2e année doit être la 1re + 1 (ex: 2025-2026)."
        }
    },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const AcademicYear = mongoose.model("AcademicYear", AcademicYearSchema);

export default AcademicYear;
