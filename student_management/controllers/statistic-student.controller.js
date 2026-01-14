// student_management/controllers/grade.controller.js
import Enrollment from "../models/enrollment.model.js";
import Grade from "../models/grade.model.js";
import mongoose from "mongoose";



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
    //  req.user.student est un objet -> on force _id
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
