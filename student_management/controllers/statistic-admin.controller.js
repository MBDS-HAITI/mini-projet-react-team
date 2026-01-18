import Enrollment from "../models/enrollment.model.js";
import AcademicYear from "../models/academic-year.model.js";
import Semester from "../models/semester.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import Student from "../models/student.model.js";

export const getRecentActivities = async (limit = 5) => {
  const studentAccounts = await User.find({ role: "STUDENT" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("email createdAt")
    .lean();

  const students = await Student.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("firstName lastName createdAt")
    .lean();

  const blockedUsers = await User.find({ isActive: false })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .select("email updatedAt")
    .lean();

  const activities = [
    ...studentAccounts.map(u => ({
      action: "Création compte étudiant",
      user: "admin@system",
      date: u.createdAt,
    })),
    ...students.map(s => ({
      action: "Création étudiant",
      user: "scolarite@system",
      date: s.createdAt,
    })),
    ...blockedUsers.map(u => ({
      action: "Blocage compte utilisateur",
      user: "admin@system",
      date: u.updatedAt,
    })),
  ];

  return activities
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};


export const getAdminKpis = async () => {
  const totalUsers = await User.countDocuments();

  const activeStudents = await Student.countDocuments({
    haveAccount: true,
  });

  const scolariteAccounts = await User.countDocuments({
    role: "SCOLARITE",
    isActive: true,
  });

  const activeAdmins = await User.countDocuments({
    role: "ADMIN",
    isActive: true,
  });

  return [
    {
      key: "users",
      title: "Utilisateurs",
      value: totalUsers,
      subtitle: "Total",
      icon: "Users",
    },
    {
      key: "students",
      title: "Étudiants",
      value: activeStudents,
      subtitle: "Actifs",
      icon: "GraduationCap",
    },
    {
      key: "scolarite",
      title: "Scolarité",
      value: scolariteAccounts,
      subtitle: "Comptes",
      icon: "ClipboardList",
    },
    {
      key: "admins",
      title: "Admins",
      value: activeAdmins,
      subtitle: "Actifs",
      icon: "Shield",
    },
  ];
};

export const getSystemStatus = async () => {
  const activeUsers = await User.countDocuments({ isActive: true });

  const failedLogins = await User.countDocuments({
    isActive: false,
    lastLoginAt: null,
  });

  const activeAcademicYear = await AcademicYear.findOne({ isActive: true })
    .select("name")
    .lean();

  const coursesWithEnrollments = await Enrollment.distinct("course");

  const coursesWithoutEnrollment = await Course.countDocuments({
    _id: { $nin: coursesWithEnrollments },
  });

  return {
    activeUsers,
    failedLogins,
    academicYear: activeAcademicYear
      ? activeAcademicYear.name
      : "Non définie",
    coursesWithoutEnrollment,
  };
};

export const getSystemConfiguration = async () => {
  const academicYears = await AcademicYear.find()
    .sort({ startDate: -1 })
    .select("name isActive startDate endDate")
    .lean();

  const semesters = await Semester.find()
    .populate("academicYear", "name")
    .select("name isActive academicYear startDate endDate")
    .lean();

  const courses = await Course.find()
    .sort({ name: 1 })
    .select("name code credits")
    .lean();

  return {
    academicYears,
    semesters,
    courses,
  };
};

export const getSystemAlerts = async () => {
  const blockedAccounts = await User.countDocuments({ isActive: false });

  const suspiciousLogins = await User.countDocuments({
    isActive: false,
    lastLoginAt: null,
  });

  const alerts = [
    {
      type: blockedAccounts > 0 ? "warning" : "info",
      message: `${blockedAccounts} compte(s) bloqué(s)`,
    },
    {
      type: suspiciousLogins > 0 ? "danger" : "info",
      message:
        suspiciousLogins > 0
          ? "Connexions suspectes détectées"
          : "Aucune connexion suspecte",
    },
    {
      type: "info",
      message: "Sauvegarde système recommandée",
    },
  ];

  return alerts;
};

