import mongoose from "mongoose";
import Enrollment from "../models/enrollment.model.js";
import Semester from "../models/semester.model.js";
import Student from "../models/student.model.js";

export const postEnrollment = async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        let created;

        await session.withTransaction(async () => {
            const { semester, student } = req.body;

            // semester required
            if (!semester || !mongoose.Types.ObjectId.isValid(semester)) {
                const err = new Error("Invalid semester id");
                err.statusCode = 400;
                throw err;
            }

            const semesterExists = await Semester.exists({ _id: semester }).session(session);
            if (!semesterExists) {
                const err = new Error("Semester not found");
                err.statusCode = 404;
                throw err;
            }

            // student optional/required depending on your business rule
            if (student !== undefined) {
                if (!student || !mongoose.Types.ObjectId.isValid(student)) {
                    const err = new Error("Invalid student id");
                    err.statusCode = 400;
                    throw err;
                }

                const studentExists = await Student.exists({ _id: student }).session(session);
                if (!studentExists) {
                    const err = new Error("Student not found");
                    err.statusCode = 404;
                    throw err;
                }
            }

            // Optional: prevent duplicates (if your rule is one enrollment per student per semester)
            if (student) {
                const dup = await Enrollment.exists({ student, semester }).session(session);
                if (dup) {
                    const err = new Error("Enrollment already exists for this student and semester");
                    err.statusCode = 409;
                    throw err;
                }
            }

            const [enrollment] = await Enrollment.create([req.body], { session });
            created = enrollment;
        });

        return res.status(201).json(created);
    } catch (err) {
        return next(err);
    } finally {
        await session.endSession();
    }
};


export const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate('student')
            .populate('course')
            .populate({
                path: "semester",
                populate: { path: "academicYear" },
            });
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllEnrollmentsByAcademicYearId = async (req, res) => {
    try {
        const { academicYearId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(academicYearId)) {
            return res.status(400).json({ message: "academicYearId invalide" });
        }

        // récupérer les semestres de l'année
        const semesters = await Semester.find({ academicYear: academicYearId }).select("_id");
        const semesterIds = semesters.map((s) => s._id);

        // récupérer les enrollments liés à ces semestres
        const enrollments = await Enrollment.find({ semester: { $in: semesterIds } })
            .populate("semester")
            .populate("student")
            .populate("course");
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllEnrollmentsBySemesterId = async (req, res) => {
    try {
        const { semesterId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(semesterId)) {
            return res.status(400).json({ message: "Semester invalide" });
        }

        // récupérer les enrollments liés 
        const enrollments = await Enrollment.find({ semester: semesterId })
            .populate("student")
            .populate("course");
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllEnrollmentsByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: "Student invalide" });
        }

        if (req.user.role === "STUDENT" && String(req.user.student) !== String(studentId)) {
            return res.status(403).json({ message: "Forbidden" })
        }

        // récupérer les enrollments liés 
        const enrollments = await Enrollment.find({ student: studentId })
            .populate({
                path: "semester",
                populate: { path: "academicYear" },
            })
            .populate("course");
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllEnrollmentsByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Course invalide" });
        }

        // récupérer les enrollments liés 
        const enrollments = await Enrollment.find({ course: courseId })
            .populate({
                path: "semester",
                populate: { path: "academicYear" },
            })
            .populate("student")
            .populate("course");
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const enrollment = await Enrollment.findById(id)
            .populate({
                path: "semester",
                populate: { path: "academicYear" }
            })
            .populate('student')
            .populate('course');
        if (!enrollment) {
            return res.status(404).json({ message: `Enrollment not found` });
        }
        res.status(200).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putEnrollment = async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        const { id } = req.params;
        let updated;

        await session.withTransaction(async () => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                const err = new Error("Invalid enrollment id");
                err.statusCode = 400;
                throw err;
            }

            const current = await Enrollment.findById(id).session(session);
            if (!current) {
                const err = new Error("Enrollment not found");
                err.statusCode = 404;
                throw err;
            }

            // If semester is being changed => validate + exists
            if (req.body.semester !== undefined) {
                if (!mongoose.Types.ObjectId.isValid(req.body.semester)) {
                    const err = new Error("Invalid semester id");
                    err.statusCode = 400;
                    throw err;
                }
                const semExists = await Semester.exists({ _id: req.body.semester }).session(session);
                if (!semExists) {
                    const err = new Error("Semester not found");
                    err.statusCode = 404;
                    throw err;
                }
            }

            // If student is being changed => validate + exists
            if (req.body.student !== undefined) {
                if (!mongoose.Types.ObjectId.isValid(req.body.student)) {
                    const err = new Error("Invalid student id");
                    err.statusCode = 400;
                    throw err;
                }
                const stuExists = await Student.exists({ _id: req.body.student }).session(session);
                if (!stuExists) {
                    const err = new Error("Student not found");
                    err.statusCode = 404;
                    throw err;
                }
            }

            // Optional: duplicate protection with "final" values
            const finalStudent = req.body.student !== undefined ? req.body.student : current.student;
            const finalSemester = req.body.semester !== undefined ? req.body.semester : current.semester;

            if (finalStudent && finalSemester) {
                const dup = await Enrollment.findOne({
                    student: finalStudent,
                    semester: finalSemester,
                    _id: { $ne: id },
                })
                    .session(session)
                    .select("_id");

                if (dup) {
                    const err = new Error("Enrollment already exists for this student and semester");
                    err.statusCode = 409;
                    throw err;
                }
            }

            updated = await Enrollment.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true,
                session,
            });
        });

        return res.status(200).json(updated);
    } catch (err) {
        return next(err);
    } finally {
        await session.endSession();
    }
};

export const deleteEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
        if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
        return res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
