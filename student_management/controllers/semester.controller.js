import mongoose from "mongoose";
import Semester from "../models/semester.model.js";
import AcademicYear from "../models/academic-year.model.js";

export const postSemester = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    let createdSemester;

    await session.withTransaction(async () => {
      const { academicYear } = req.body;

      // 1) Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(academicYear)) {
        const err = new Error("Invalid academicYear id");
        err.statusCode = 400;
        throw err;
      }

      // 2) Check existence (FK-like)
      const exists = await AcademicYear.exists({ _id: academicYear }).session(session);
      if (!exists) {
        const err = new Error("AcademicYear not found");
        err.statusCode = 404;
        throw err;
      }

      // 3) Create Semester inside transaction
      const [semester] = await Semester.create([req.body], { session });
      createdSemester = semester;
    });

    return res.status(201).json(createdSemester);
  } catch (err) {
    return next(err); // handled by your errorMiddleware
  } finally {
    await session.endSession();
  }
};



export const getAllSemesters = async (req, res) => {
    try {
        const semesters = await Semester.find()
                                    .populate("academicYear", "name");
        res.status(200).json(semesters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllSemestersByAcademicYear = async (req, res) => {
    try {
        const { academicYearId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(academicYearId)) {
                                             
            return res.status(400).json({ message: "Academic Year invalide" });
        }

        const semesters = await Semester.find({ academicYear: academicYearId })
                                           .populate("academicYear", "name");
        res.status(200).json(semesters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSemester = async (req, res) => {
    try {
        const { id } = req.params;
        const semester = await Semester.findById(id).populate("academicYear", "name");
        if (!semester) {
            return res.status(404).json({ message: `Semester not found` });
        }
        res.status(200).json(semester);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putSemester = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;
    let updatedSemester;

    await session.withTransaction(async () => {
      // 1) Validate semester id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error("Invalid semester id");
        err.statusCode = 400;
        throw err;
      }

      // 2) If academicYear is being updated, validate it + check existence
      if (req.body.academicYear !== undefined) {
        if (!mongoose.Types.ObjectId.isValid(req.body.academicYear)) {
          const err = new Error("Invalid academicYear id");
          err.statusCode = 400;
          throw err;
        }

        const exists = await AcademicYear.exists({ _id: req.body.academicYear }).session(session);
        if (!exists) {
          const err = new Error("AcademicYear not found");
          err.statusCode = 404;
          throw err;
        }
      }

      // 3) Update inside transaction (runValidators works with update)
      updatedSemester = await Semester.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true, session }
      );

      if (!updatedSemester) {
        const err = new Error("Semester not found");
        err.statusCode = 404;
        throw err;
      }
    });

    // populate outside transaction is OK here
    const populated = await Semester.findById(updatedSemester._id)
      .populate("academicYear", "name")
      .exec();

    return res.status(200).json(populated);
  } catch (err) {
    return next(err);
  } finally {
    await session.endSession();
  }
};


export const deleteSemester = async (req, res) => {
    try {
        const semester = await Semester.findByIdAndDelete(req.params.id);
        if (!semester) return res.status(404).json({ message: "Semester not found" });
        return res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
