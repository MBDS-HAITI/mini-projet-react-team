import Enrollment from "../models/enrollment.model.js";
import Student from "../models/student.model.js";
import Course from "../models/course.model.js";
import Semester from "../models/semester.model.js";
import mongoose from "mongoose";

export const postEnrollment = async (req, res) => {
  try {
    const { student, course, semester } = req.body;

    // 1️⃣ Champs obligatoires
    if (!student || !course || !semester) {
      return res.status(400).json({
        message: "student, course et semester sont obligatoires",
      });
    }

    // 2️⃣ ObjectId valides
    if (
      !mongoose.Types.ObjectId.isValid(student) ||
      !mongoose.Types.ObjectId.isValid(course) ||
      !mongoose.Types.ObjectId.isValid(semester)
    ) {
      return res.status(400).json({
        message: "student, course ou semester invalide (ObjectId attendu)",
      });
    }

    // 3️⃣ Vérifier existence réelle
    const [studentExists, courseExists, semesterExists] = await Promise.all([
      Student.findById(student),
      Course.findById(course),
      Semester.findById(semester),
    ]);

    if (!studentExists) {
      return res.status(400).json({ message: "Étudiant inexistant" });
    }

    if (!courseExists) {
      return res.status(400).json({ message: "Cours inexistant" });
    }

    if (!semesterExists) {
      return res.status(400).json({ message: "Semestre inexistant" });
    }

    // 4️⃣ (Optionnel mais recommandé) éviter doublon
    const alreadyEnrolled = await Enrollment.findOne({
      student,
      course,
      semester,
    });

    if (alreadyEnrolled) {
      return res.status(409).json({
        message: "L'étudiant est déjà inscrit à ce cours pour ce semestre",
      });
    }

    // 5️⃣ Création de l'inscription
    const enrollment = await Enrollment.create(req.body);

    // 6️⃣ Retour peuplé (propre pour le frontend)
    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate("student", "name firstName")
      .populate("course", "name")
      .populate("semester", "name");

    res.status(201).json(populatedEnrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

export const putEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const { student, course, semester } = req.body;

    // 1️⃣ Vérifier l'ID de l'inscription
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "ID d'inscription invalide",
      });
    }

    const existingEnrollment = await Enrollment.findById(id);
    if (!existingEnrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // 2️⃣ Vérifier les champs modifiés (si présents)
    if (student) {
      if (!mongoose.Types.ObjectId.isValid(student)) {
        return res.status(400).json({
          message: "student invalide (ObjectId attendu)",
        });
      }

      const studentExists = await Student.findById(student);
      if (!studentExists) {
        return res.status(400).json({ message: "Étudiant inexistant" });
      }
    }

    if (course) {
      if (!mongoose.Types.ObjectId.isValid(course)) {
        return res.status(400).json({
          message: "course invalide (ObjectId attendu)",
        });
      }

      const courseExists = await Course.findById(course);
      if (!courseExists) {
        return res.status(400).json({ message: "Cours inexistant" });
      }
    }

    if (semester) {
      if (!mongoose.Types.ObjectId.isValid(semester)) {
        return res.status(400).json({
          message: "semester invalide (ObjectId attendu)",
        });
      }

      const semesterExists = await Semester.findById(semester);
      if (!semesterExists) {
        return res.status(400).json({ message: "Semestre inexistant" });
      }
    }

    // 3️⃣ Empêcher doublon (si combinaison modifiée)
    const finalStudent = student || existingEnrollment.student;
    const finalCourse = course || existingEnrollment.course;
    const finalSemester = semester || existingEnrollment.semester;

    const duplicate = await Enrollment.findOne({
      _id: { $ne: id },
      student: finalStudent,
      course: finalCourse,
      semester: finalSemester,
    });

    if (duplicate) {
      return res.status(409).json({
        message:
          "Une inscription identique existe déjà (étudiant, cours, semestre)",
      });
    }

    // 4️⃣ Mise à jour autorisée
    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("student", "name firstName")
      .populate("course", "name")
      .populate("semester", "name");

    res.status(200).json(updatedEnrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
