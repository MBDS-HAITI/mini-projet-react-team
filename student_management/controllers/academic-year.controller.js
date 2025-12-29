import mongoose from "mongoose";
import AcademicYear from "../models/academic-year.model.js";
import Semester from "../models/semester.model.js";

export const postAcademicYear = async (req, res) => {
    try {
        const academicYear = await AcademicYear.create(req.body);
        res.status(201).json(academicYear);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllAcademicYears = async (req, res) => {
    try {
        const academicYear = await AcademicYear.find();
        res.status(200).json(academicYear);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAcademicYear = async (req, res) => {
    try {
        const { id } = req.params;
        const academicYear = await AcademicYear.findById(id);
        if (!academicYear) {
            return res.status(404).json({ message: `AcademicYear not found` });
        }
        res.status(200).json(academicYear);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAcademicYearDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const yearId = new mongoose.Types.ObjectId(id);

        const academicYear = await AcademicYear.findById(id);
        if (!academicYear) return res.status(404).json({ message: "AcademicYear not found" });

        const semesters = await Semester.aggregate([
            { $match: { academicYear: yearId } },

            // enrollments du semestre
            {
                $lookup: {
                    from: "enrollments",
                    localField: "_id",
                    foreignField: "semester",
                    as: "enrollments",
                },
            },

            // notes liées aux enrollments du semestre
            {
                $lookup: {
                    from: "grades",
                    let: { enrollmentIds: "$enrollments._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ["$enrollment", "$$enrollmentIds"] },
                            },
                        },
                        // si tu ajoutes un champ de publication plus tard:
                        // { $match: { isPublished: true } }
                    ],
                    as: "grades",
                },
            },

            // counts
            {
                $addFields: {
                    enrollmentsCount: { $size: "$enrollments" },
                    gradesCount: { $size: "$grades" }, // = notes (publiées si tu filtres plus haut)
                },
            },

            // output clean
            {
                $project: {
                    enrollments: 0,
                    grades: 0,
                    __v: 0,
                },
            },

            { $sort: { name: 1 } }, // S1 puis S2
        ]);

        const totals = semesters.reduce(
            (acc, s) => {
                acc.enrollments += s.enrollmentsCount || 0;
                acc.grades += s.gradesCount || 0;
                return acc;
            },
            { enrollments: 0, grades: 0 }
        );

        res.status(200).json({ academicYear, semesters, totals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putAcademicYear = async (req, res) => {
    try {
        const { id } = req.params;
        const academicYear = await AcademicYear.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!academicYear) {
            return res.status(404).json({ message: `AcademicYear not found` });
        }
        res.status(200).json(academicYear);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAcademicYear = async (req, res) => {
    try {
        const academicYear = await AcademicYear.findByIdAndDelete(req.params.id);
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
