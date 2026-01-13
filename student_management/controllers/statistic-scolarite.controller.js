import Student from "../models/student.model.js";
import Enrollment from "../models/enrollment.model.js";
import Semester from "../models/semester.model.js";
import Course from "../models/course.model.js";
import Grade from "../models/grade.model.js";

export const getScolariteDashboard = async (req, res, next) => {
  try {
    // ================= SEMESTRE ACTIF =================
    const activeSemester = await Semester.findOne({ isActive: true })
      .populate("academicYear");

    if (!activeSemester) {
      return res.status(200).json({
        kpis: [],
        summary: {},
        recentNotes: [],
        alerts: ["Aucun semestre actif"],
      });
    }

    // ================= INSCRIPTIONS DU SEMESTRE =================
    const enrollments = await Enrollment.find({
      semester: activeSemester._id,
      status: "ENROLLED",
    });

    const enrollmentIds = enrollments.map(e => e._id);

    // ================= ÉTUDIANTS =================
    const activeStudents = new Set(
      enrollments.map(e => e.student.toString())
    ).size;

    const totalStudents = await Student.countDocuments();

    // Nouveaux étudiants ce mois
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newActiveStudents = enrollments.filter(
      e => e.createdAt >= startOfMonth
    ).length;

    // ================= COURS ACTIFS =================
    const activeCourses = new Set(
      enrollments.map(e => e.course.toString())
    ).size;

    // ================= NOTES =================

    // Inscriptions qui ont AU MOINS une note
    const gradedEnrollmentIds = await Grade.distinct("enrollment", {
      enrollment: { $in: enrollmentIds },
    });

    // Notes non publiées
    const pendingNotes = await Grade.countDocuments({
      enrollment: { $in: enrollmentIds },
      isPublished: false,
    });

    // Inscriptions sans note
    const missingNotes = enrollments.length - gradedEnrollmentIds.length;

    // Taux de saisie
    const entryRate =
      enrollments.length === 0
        ? 0
        : Math.round(
            (gradedEnrollmentIds.length / enrollments.length) * 100
          );

    // ================= ÉTUDIANTS AVEC NOTES MANQUANTES =================

    // Inscriptions avec note publiée
    const publishedEnrollmentIds = await Grade.distinct("enrollment", {
      enrollment: { $in: enrollmentIds },
      isPublished: true,
    });

    // Inscriptions problématiques :
    // - pas de note
    // - ou note non publiée
    const problematicEnrollments = enrollments.filter(
      e => !publishedEnrollmentIds.some(id => id.equals(e._id))
    );

    // Étudiants uniques concernés
    const studentsWithoutNotesCount = new Set(
      problematicEnrollments.map(e => e.student.toString())
    ).size;

    // ================= DERNIÈRES NOTES =================
    const recentGrades = await Grade.find({
      enrollment: { $in: enrollmentIds },
    })
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(5)
      .populate({
        path: "enrollment",
        populate: [
          { path: "student", select: "firstName lastName" },
          { path: "course", select: "name" },
        ],
      });

    const recentNotes = recentGrades.map(g => ({
      id: g._id,
      student: `${g.enrollment.student.firstName} ${g.enrollment.student.lastName}`,
      subject: g.enrollment.course.name,
      status: g.isPublished ? "Publié" : "En attente",
      dateModif: g.updatedAt || g.createdAt
    }));

    // ================= ALERTES =================
    const alerts = [];

    if (missingNotes > 0) {
      alerts.push(`${missingNotes} notes non saisies`);
    }

    if (studentsWithoutNotesCount > 0) {
      alerts.push(`${studentsWithoutNotesCount} étudiants avec notes manquantes`);
    }

    // Logique temporelle du semestre
    if (activeSemester.endDate) {
      const today = new Date();
      const daysLeft = Math.ceil(
        (new Date(activeSemester.endDate) - today) / (1000 * 60 * 60 * 24)
      );

      if (daysLeft <= 30) {
        alerts.push("Semestre bientôt clôturé");
      } else {
        alerts.push("Semestre en cours");
      }
    }

    // ================= RÉPONSE =================
    res.status(200).json({
      kpis: [
        {
          key: "activeStudents",
          title: "Étudiants",
          value: activeStudents,
          subtitle: "Actifs",
          hint: `+${newActiveStudents} ce mois`,
          icon: "GraduationCap",
          valueColor: "success.main"
        },
        {
          key: "totalStudents",
          title: "Total étudiants",
          value: totalStudents,
          subtitle: "Base complète",
          icon: "Users",
          valueColor: "warning.main",
        },
        {
          key: "enrollments",
          title: "Inscriptions",
          value: enrollments.length,
          subtitle: "Ce semestre",
          icon: "ClipboardList",
          valueColor: "secondary.main",
        },
        {
          key: "courses",
          title: "Cours actifs",
          value: activeCourses,
          subtitle: "Toutes filières",
          icon: "BookOpen",
          valueColor: "primary.main",
        },
      ],

      summary: {
        academicYear: activeSemester.academicYear?.name || "",
        semester: activeSemester.name === "S1" ? "Semestre 1" : "Semestre 2",
        missingNotes,
        pendingNotes,
        entryRate: `${entryRate} %`,
      },

      recentNotes,
      alerts,
    });
  } catch (error) {
    next(error);
  }
};
