
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signIn = async (req, res, next)=>{
    try {
        const { username, password } = req.body;

        const user = await User.findOne({username});

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;            
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            const error = new Error("Username or password incorrect");
            error.statusCode = 401;
            throw error;  
        }

        // token: payload doit être un objet
        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN } 
        );

        return res.status(200).json({
            success: true,
            message: "User signed in successfuly",
            data: {
                token,
                user
            }
        })

        
    } catch (error) {
        next(error)
    }
}

const signOut = async (req, res, next)=>{

}