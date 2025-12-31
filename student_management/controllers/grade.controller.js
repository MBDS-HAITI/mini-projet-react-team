import Enrollment from "../models/enrollment.model.js";
import Grade from "../models/grade.model.js";
import mongoose from 'mongoose';

export const postGrade = async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        const { enrollment, value, gradedAt } = req.body;
        const user = req.user?._id;

        let created;

        await session.withTransaction(async () => {
            // user required (si ton auth garantit déjà, tu peux enlever)
            if (!user) {
                const err = new Error("Unauthorized");
                err.statusCode = 401;
                throw err;
            }

            // enrollment id format
            if (!enrollment || !mongoose.Types.ObjectId.isValid(enrollment)) {
                const err = new Error("Invalid enrollment id");
                err.statusCode = 400;
                throw err;
            }

            // enrollment exists
            const enrExists = await Enrollment.exists({ _id: enrollment }).session(session);
            if (!enrExists) {
                const err = new Error("Enrollment not found");
                err.statusCode = 404;
                throw err;
            }

            // éviter double grade pour le même enrollment
            const dup = await Grade.exists({ enrollment }).session(session);
            if (dup) {
                const err = new Error("Grade already exists for this enrollment");
                err.statusCode = 409;
                throw err;
            }

            const [grade] = await Grade.create([{ enrollment, value, gradedAt, user }], { session });
            created = grade;
        });

        // populate pour renvoyer un objet complet (optionnel)
        const populated = await Grade.findById(created._id).populate({
            path: "enrollment",
            populate: [
                { path: "student" },
                { path: "course" },
                { path: "semester", populate: { path: "academicYear" } },
            ],
        });

        return res.status(201).json(populated ?? created);
    } catch (err) {
        return next(err);
    } finally {
        await session.endSession();
    }
};


export const getAllGrades = async (req, res) => {
    try {
        const grades = await Grade.find()
            .populate("user", "username")
            .populate({
                path: "enrollment",
                populate: [
                    { path: "student", select: "firstName lastName studentCode" },
                    { path: "course", select: "name code" },
                    {
                        path: "semester",
                        select: "name",
                        populate: { path: "academicYear", select: "name" }
                    },
                ],
            });
        res.status(200).json(grades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllGradesBySemesterId = async (req, res) => {
    try {
        const { semesterId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(semesterId)) {
            return res.status(400).json({ message: "semester invalide" });
        }

        const enrollments = await Enrollment.find({ semester: semesterId });
        const enrollmentIds = enrollments.map((s) => s._id);

        const grades = await Grade.find({ enrollment: { $in: enrollmentIds } })
            .populate({
                path: "enrollment",
                populate: [
                    { path: "student" },
                    { path: "course" },
                    {
                        path: "semester",
                        populate: { path: "academicYear" }
                    }
                ],
            });
        res.status(200).json(grades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAllGradesByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;


        if (req.user.role === "STUDENT" && String(req.user.student) !== String(studentId)) {
            return res.status(403).json({ message: "Forbidden" })
        }

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: "Student invalide" });
        }

        const enrollments = await Enrollment.find({ student: studentId });
        const enrollmentIds = enrollments.map((s) => s._id);

        const grades = await Grade.find({ enrollment: { $in: enrollmentIds } })
            .populate({
                path: "enrollment",
                populate: [
                    { path: "student" },
                    { path: "course" },
                    {
                        path: "semester",
                        populate: { path: "academicYear" }
                    }
                ],
            });
        res.status(200).json(grades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getGrade = async (req, res) => {
    try {
        const { id } = req.params;
        const grade = await Grade.findById(id)
            .populate({
                path: "enrollment",
                populate: [
                    { path: "student" },
                    { path: "course" },
                    {
                        path: "semester",
                        populate: { path: "academicYear" }
                    }
                ],
            });
        if (!grade) {
            return res.status(404).json({ message: `Grade not found` });
        }
        res.status(200).json(grade);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putGrade = async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        const { id } = req.params;
        let updated;

        await session.withTransaction(async () => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                const err = new Error("Invalid grade id");
                err.statusCode = 400;
                throw err;
            }

            const current = await Grade.findById(id).session(session);
            if (!current) {
                const err = new Error("Grade not found");
                err.statusCode = 404;
                throw err;
            }

            // If enrollment is being updated, validate + exists
            if (req.body.enrollment !== undefined) {
                if (!mongoose.Types.ObjectId.isValid(req.body.enrollment)) {
                    const err = new Error("Invalid enrollment id");
                    err.statusCode = 400;
                    throw err;
                }

                const enrExists = await Enrollment.exists({ _id: req.body.enrollment }).session(session);
                if (!enrExists) {
                    const err = new Error("Enrollment not found");
                    err.statusCode = 404;
                    throw err;
                }

                // éviter que cet enrollment ait déjà une autre note
                const dup = await Grade.findOne({ enrollment: req.body.enrollment, _id: { $ne: id } })
                    .session(session)
                    .select("_id");
                if (dup) {
                    const err = new Error("Grade already exists for this enrollment");
                    err.statusCode = 409;
                    throw err;
                }
            }

            updated = await Grade.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true,
                session,
            });

            if (!updated) {
                const err = new Error("Grade not found");
                err.statusCode = 404;
                throw err;
            }
        });

        // ton populate (après transaction)
        const populated = await Grade.findById(updated._id).populate({
            path: "enrollment",
            populate: [
                { path: "student" },
                { path: "course" },
                { path: "semester", populate: { path: "academicYear" } },
            ],
        });

        return res.status(200).json(populated ?? updated);
    } catch (err) {
        return next(err);
    } finally {
        await session.endSession();
    }
};

export const deleteGrade = async (req, res) => {
    try {
        const grade = await Grade.findByIdAndDelete(req.params.id);
        if (!grade) return res.status(404).json({ message: "Grade not found" });
        return res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
