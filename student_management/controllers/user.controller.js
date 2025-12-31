import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import Student from "../models/student.model.js";
import mongoose from "mongoose";


export const postUser = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { email, username, password, role, student } = req.body;

    let createdUserObj;

    await session.withTransaction(async () => {
      // 1) Uniqueness check inside transaction
      const filter = { $or: [{ email }, { username }, { "providers.email": email }] };
      const existingUser = await User.findOne(filter).session(session);
      if (existingUser) {
        const err = new Error("User already exists");
        err.statusCode = 409;
        throw err;
      }

      // 2) If role is STUDENT, student is required + must exist
      const isStudentRole = role === "STUDENT"; 
      if (isStudentRole) {
        if (!student) {
          const err = new Error("student is required for STUDENT role");
          err.statusCode = 400;
          throw err;
        }
        if (!mongoose.Types.ObjectId.isValid(student)) {
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

        // un étudiant = un user
        const alreadyLinked = await User.exists({ student }).session(session);
        if (alreadyLinked) {
          const err = new Error("This student is already linked to a user");
          err.statusCode = 409;
          throw err;
        }
      }

      // 3) Hash password
      const plainPassword = password ?? `${username}2526`;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(plainPassword, salt);

      // 4) Create user
      const newUser = await User.create(
        [
          {
            email,
            username,
            password: hashedPassword,
            role,
            student: isStudentRole ? student : null,
          },
        ],
        { session }
      );

      const userObj = newUser[0].toObject();
      delete userObj.password;
      createdUserObj = userObj;
    });

    return res.status(201).json({ success: true, user: createdUserObj });
  } catch (err) {
    return next(err);
  } finally {
    await session.endSession();
  }
};

export const getAllUsers = async(req, res) => {
   try {
        const users = await User.find();
        res.status(200).json(users);
   } catch (error) {
        res.status(500).json({message: error.message});
   }
};

export const getUsers = async (req,res)=>{
    try {
        const {page =1, pageSize = 10, sortBy="username", asc="true", search=""} = req.query;
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(pageSize, 10) || 10, 1), 100);
        const skipNum = (pageNum - 1) * limitNum;

        const sortDir = (String(asc).toLowerCase() === "true") ? 1 : -1;

        // Filtre de recherche 
        const filter = search
        ? {
            $or: [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ]
            }
        : {};

        const [users, total] = await Promise.all([
            User.find(filter)
                .sort({ [sortBy]: sortDir })
                .skip(skipNum)
                .limit(limitNum),
            User.countDocuments(filter)
            ]);
        
        if (!users) {
            return res.status(404).json({isSuccess: false, message: `User not found`});
        }
        res.status(200).json({
            isSuccess: true,
            data: users,
            pagination: {
                page: pageNum,
                pageSize: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            },
            message:""
        });
    } catch (error) {
        res.status(500).json({isSuccess: false, message: error.message});
    }
}

export const getUser = async (req,res)=>{
    try {
        const {id} = req.params;
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({message: `User not found`});
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getUserStudent = async (req,res)=>{
    try {
        const {studentId} = req.params;
        const user = await User.findOne({student: studentId});
        if (!user) {
            return res.status(404).json({message: `User not found`});
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const putUser = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    // bloque les champs sensibles
    delete req.body.username;
    delete req.body.password;

    let updatedUser;

    await session.withTransaction(async () => {
      // 1) validate user id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error("Invalid user id");
        err.statusCode = 400;
        throw err;
      }

      // 2) fetch current user (needed to know current role/student)
      const current = await User.findById(id).session(session);
      if (!current) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }

      // Determine the final values AFTER update
      const finalRole = req.body.role ?? current.role;
      const finalStudent = req.body.student !== undefined ? req.body.student : current.student;

      const isStudentRole = finalRole === "STUDENT" || finalRole === "student"; // adapte à ton enum

      // 3) business rules for student role
      if (isStudentRole) {
        // student must exist and be valid
        if (!finalStudent) {
          const err = new Error("student is required for STUDENT role");
          err.statusCode = 400;
          throw err;
        }
        if (!mongoose.Types.ObjectId.isValid(finalStudent)) {
          const err = new Error("Invalid student id");
          err.statusCode = 400;
          throw err;
        }

        const studentExists = await Student.exists({ _id: finalStudent }).session(session);
        if (!studentExists) {
          const err = new Error("Student not found");
          err.statusCode = 404;
          throw err;
        }

        // Prevent linking same student to another user
        const alreadyLinked = await User.findOne({ student: finalStudent, _id: { $ne: id } })
          .session(session)
          .select("_id");
        if (alreadyLinked) {
          const err = new Error("This student is already linked to another user");
          err.statusCode = 409;
          throw err;
        }
      } else {
        // if role is not student, force student to null (optional but clean)
        req.body.student = null;
      }

      // 4) update in transaction
      updatedUser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        session,
      }).select("-password"); // hide password if it exists
    });

    return res.status(200).json(updatedUser);
  } catch (err) {
    return next(err);
  } finally {
    await session.endSession();
  }
};

export const resetUserPassword = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    await session.withTransaction(async () => {

      // 2) validate user id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error("Invalid user id");
        err.statusCode = 400;
        throw err;
      }

      // 3) validate newPassword
      if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
        const err = new Error("newPassword must be at least 6 characters");
        err.statusCode = 400;
        throw err;
      }

      // 4) load user
      const user = await User.findById(id).select("+password").session(session);
      if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }

      // 5) hash + save
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save({ session });
    });

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    return next(err);
  } finally {
    await session.endSession();
  }
};

export const deleteUser = async (req,res)=>{
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(User);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
