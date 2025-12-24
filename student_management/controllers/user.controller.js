import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';


export const postUser = async (req, res) => {

  try {
    const { email, username, password, role, student } = req.body;

    const filter = {
      $or: [{ email }, { username }, { "providers.email": email }],
    };

    const existingUser = await User.findOne(filter);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const plainPassword = password ?? `${username}2526`; // pas de réassignation
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const newUser = await User.create({ email, username, password: hashedPassword, role, student: student||null });


    // renvoyer un objet propre (sans password)
    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).json({ success: true, user: userObj });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
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

export const putUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Empêche la modification de champs sensibles
    delete req.body.username;

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
