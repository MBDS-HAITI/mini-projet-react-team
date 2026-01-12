// student_management/controllers/grade.controller.js
import Enrollment from "../models/enrollment.model.js";
import Grade from "../models/grade.model.js";
import mongoose from "mongoose";

console.log("Exports loaded: grade.controller");

/**
 * POST /api/v1/grades
 * body: { enrollment, value, gradedAt? }
 * protected: scolariteAuthorize
 */
export const postGrade = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { enrollment, value, gradedAt } = req.body;
    const user = req.user?._id;

    let created;

    await session.withTransaction(async () => {
      if (!user) {
        const err = new Error("Unauthorized");
        err.statusCode = 401;
        throw err;
      }

      if (!enrollment || !mongoose.Types.ObjectId.isValid(enrollment)) {
        const err = new Error("Invalid enrollment id");
        err.statusCode = 400;
        throw err;
      }

      const enrExists = await Enrollment.exists({ _id: enrollment }).session(session);
      if (!enrExists) {
        const err = new Error("Enrollment not found");
        err.statusCode = 404;
        throw err;
      }

      const dup = await Grade.exists({ enrollment }).session(session);
      if (dup) {
        const err = new Error("Grade already exists for this enrollment");
        err.statusCode = 409;
        throw err;
      }

      const [grade] = await Grade.create([{ enrollment, value, gradedAt, user }], { session });
      created = grade;
    });

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

/**
 * GET /api/v1/grades
 * protected: scolariteAuthorize
 */
export const getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate("user", "username")
      .populate({
        path: "enrollment",
        populate: [
          { path: "student", select: "firstName lastName studentCode" },
          { path: "course", select: "name code credits" },
          {
            path: "semester",
            select: "name",
            populate: { path: "academicYear", select: "name" },
          },
        ],
      });

    return res.status(200).json(grades);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/v1/grades/semester/:semesterId
 * protected: scolariteAuthorize
 */
export const getAllGradesBySemesterId = async (req, res) => {
  try {
    const { semesterId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(semesterId)) {
      return res.status(400).json({ message: "semester invalide" });
    }

    const enrollments = await Enrollment.find({ semester: semesterId }).select("_id");
    const enrollmentIds = enrollments.map((s) => s._id);

    const grades = await Grade.find({ enrollment: { $in: enrollmentIds } }).populate({
      path: "enrollment",
      populate: [
        { path: "student" },
        { path: "course" },
        { path: "semester", populate: { path: "academicYear" } },
      ],
    });

    return res.status(200).json(grades);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/v1/grades/student/:studentId
 * (ta route ne met pas scolariteAuthorize ici, donc on check role STUDENT)
 */
export const getAllGradesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (req.user?.role === "STUDENT") {
      const currentStudentId = req.user.student?._id || req.user.student;
      if (String(currentStudentId) !== String(studentId)) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Student invalide" });
    }

    const enrollments = await Enrollment.find({ student: studentId }).select("_id");
    const enrollmentIds = enrollments.map((s) => s._id);

    const grades = await Grade.find({ enrollment: { $in: enrollmentIds } }).populate({
      path: "enrollment",
      populate: [
        { path: "student" },
        { path: "course" },
        { path: "semester", populate: { path: "academicYear" } },
      ],
    });

    return res.status(200).json(grades);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/v1/grades/:id
 * protected: scolariteAuthorize
 */
export const getGrade = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid grade id" });
    }

    const grade = await Grade.findById(id).populate({
      path: "enrollment",
      populate: [
        { path: "student" },
        { path: "course" },
        { path: "semester", populate: { path: "academicYear" } },
      ],
    });

    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }

    return res.status(200).json(grade);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/v1/grades/:id
 * protected: scolariteAuthorize
 */
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

        const dup = await Grade.findOne({
          enrollment: req.body.enrollment,
          _id: { $ne: id },
        })
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

/**
 * DELETE /api/v1/grades/:id
 * protected: scolariteAuthorize
 */
export const deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid grade id" });
    }

    const grade = await Grade.findByIdAndDelete(id);
    if (!grade) return res.status(404).json({ message: "Grade not found" });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/v1/grades/me/dashboard
 * Retour:
 * {
 *   stats: { validatedCount, totalSubjects, failuresCount },
 *   recentGrades: [...]
 * }
 */
export const getMyDashboardGrades = async (req, res) => {
  try {
    // ✅ req.user.student est un objet -> on force _id
    const studentId = req.user?.student?._id;

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "studentId invalide ou introuvable" });
    }

    // Toutes les matières = enrollments du student
    const enrollments = await Enrollment.find({ student: studentId })
      .select("_id")
      .lean();

    const enrollmentIds = enrollments.map((e) => e._id);
    const totalSubjects = enrollmentIds.length;

    // Toutes les notes publiées pour stats
    const allPublishedGrades = await Grade.find({
      enrollment: { $in: enrollmentIds },
      isPublished: true,
    })
      .select("value")
      .lean();

    const validatedCount = allPublishedGrades.filter((g) => g.value >= 50).length;
    const failuresCount = allPublishedGrades.filter((g) => g.value < 50).length;

    // Dernières notes (tableau)
    const recent = await Grade.find({
      enrollment: { $in: enrollmentIds },
      isPublished: true,
    })
      .sort({ gradedAt: -1 })
      .limit(5)
      .populate({
        path: "enrollment",
        populate: [{ path: "course", select: "name credits" }],
      })
      .lean();

    const recentGrades = recent.map((g) => {
      const course = g.enrollment?.course;

      const grade20 = Math.round((g.value / 5) * 10) / 10; // /100 -> /20
      const passed = g.value >= 50;

      return {
        id: String(g._id),
        subject: course?.name ?? "Matière",
        grade: grade20,
        coef: course?.credits ?? 20,
        date: new Date(g.gradedAt).toLocaleDateString("fr-FR"),
        status: passed ? "Validé" : "Échec",
      };
    });

    return res.status(200).json({
      stats: { validatedCount, totalSubjects, failuresCount },
      recentGrades,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
