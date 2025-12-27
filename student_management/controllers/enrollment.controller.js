import mongoose from "mongoose";
import Enrollment from "../models/enrollment.model.js";
import Student from "../models/student.model.js";
import Course from "../models/course.model.js";
import Semester from "../models/semester.model.js";

export const postEnrollment = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { semester, student, course } = req.body;
    let createdEnrollmentId;

    await session.withTransaction(async () => {
      // 1) Validate ObjectIds
      if (!semester || !mongoose.Types.ObjectId.isValid(semester)) {
        const err = new Error("Invalid semester id");
        err.statusCode = 400;
        throw err;
      }
      if (!student || !mongoose.Types.ObjectId.isValid(student)) {
        const err = new Error("Invalid student id");
        err.statusCode = 400;
        throw err;
      }
      if (!course || !mongoose.Types.ObjectId.isValid(course)) {
        const err = new Error("Invalid course id");
        err.statusCode = 400;
        throw err;
      }

      // 2) Check existence (FK-like) in same session
      const semesterExists = await Semester.exists({ _id: semester }).session(session);
      if (!semesterExists) {
        const err = new Error("Semester not found");
        err.statusCode = 404;
        throw err;
      }

      const studentExists = await Student.exists({ _id: student }).session(session);
      if (!studentExists) {
        const err = new Error("Student not found");
        err.statusCode = 404;
        throw err;
      }

      const courseExists = await Course.exists({ _id: course }).session(session);
      if (!courseExists) {
        const err = new Error("Course not found");
        err.statusCode = 404;
        throw err;
      }

      // 3) Prevent duplicates (student + course + semester)
      const dup = await Enrollment.exists({ student, course, semester }).session(session);
      if (dup) {
        const err = new Error("L'étudiant est déjà inscrit à ce cours pour ce semestre");
        err.statusCode = 409;
        throw err;
      }

      // 4) Create enrollment inside transaction
      const [created] = await Enrollment.create([req.body], { session });
      createdEnrollmentId = created._id;
    });

    // 5) Return populated enrollment (outside transaction)
    const populatedEnrollment = await Enrollment.findById(createdEnrollmentId)
      .populate("student", "firstName lastName studentCode")
      .populate("course", "name")
      .populate({
        path: "semester",
        select: "name startDate endDate",
        populate: { path: "academicYear", select: "name" },
      });

    return res.status(201).json(populatedEnrollment);
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
    let updatedId;

    await session.withTransaction(async () => {
      // 1) validate enrollment id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error("Invalid enrollment id");
        err.statusCode = 400;
        throw err;
      }

      // 2) fetch current
      const current = await Enrollment.findById(id).session(session);
      if (!current) {
        const err = new Error("Enrollment not found");
        err.statusCode = 404;
        throw err;
      }

      // 3) validate refs only if provided in body
      if (req.body.student !== undefined) {
        if (!mongoose.Types.ObjectId.isValid(req.body.student)) {
          const err = new Error("Invalid student id");
          err.statusCode = 400;
          throw err;
        }
        const exists = await Student.exists({ _id: req.body.student }).session(session);
        if (!exists) {
          const err = new Error("Student not found");
          err.statusCode = 404;
          throw err;
        }
      }

      if (req.body.course !== undefined) {
        if (!mongoose.Types.ObjectId.isValid(req.body.course)) {
          const err = new Error("Invalid course id");
          err.statusCode = 400;
          throw err;
        }
        const exists = await Course.exists({ _id: req.body.course }).session(session);
        if (!exists) {
          const err = new Error("Course not found");
          err.statusCode = 404;
          throw err;
        }
      }

      if (req.body.semester !== undefined) {
        if (!mongoose.Types.ObjectId.isValid(req.body.semester)) {
          const err = new Error("Invalid semester id");
          err.statusCode = 400;
          throw err;
        }
        const exists = await Semester.exists({ _id: req.body.semester }).session(session);
        if (!exists) {
          const err = new Error("Semester not found");
          err.statusCode = 404;
          throw err;
        }
      }

      // 4) anti-doublon avec les valeurs finales
      const finalStudent = req.body.student !== undefined ? req.body.student : current.student;
      const finalCourse = req.body.course !== undefined ? req.body.course : current.course;
      const finalSemester = req.body.semester !== undefined ? req.body.semester : current.semester;

      if (finalStudent && finalCourse && finalSemester) {
        const dup = await Enrollment.findOne({
          _id: { $ne: id },
          student: finalStudent,
          course: finalCourse,
          semester: finalSemester,
        })
          .session(session)
          .select("_id");

        if (dup) {
          const err = new Error(
            "Une inscription identique existe déjà (étudiant, cours, semestre)"
          );
          err.statusCode = 409;
          throw err;
        }
      }

      // 5) update
      const updated = await Enrollment.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        session,
      });

      if (!updated) {
        const err = new Error("Enrollment not found");
        err.statusCode = 404;
        throw err;
      }

      updatedId = updated._id;
    });

    // 6) populated response (outside transaction)
    const populated = await Enrollment.findById(updatedId)
      .populate("student", "firstName lastName studentCode")
      .populate("course", "name")
      .populate({
        path: "semester",
        select: "name startDate endDate",
        populate: { path: "academicYear", select: "name" },
      });

    return res.status(200).json(populated);
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
