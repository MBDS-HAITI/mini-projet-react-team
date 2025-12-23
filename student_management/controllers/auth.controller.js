
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_SECRET } from "../config/env.js";

export const signIn = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Username or password incorrect");
            error.statusCode = 401;
            throw error;
        }

        // Access token (court)
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email,
                username: user.username
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        //  Refresh token (long)
        const refreshToken = jwt.sign(
            { id: user._id },
            JWT_REFRESH_SECRET,
            { expiresIn: JWT_REFRESH_EXPIRES_IN }
        );

        // Cookie HttpOnly envoyé seulement sur /api/v1/auths/refresh
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, //NODE_ENV === "production",
            sameSite: "lax",
            path: "/api/v1/auths/refresh",
        });

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

export const refreshToken = async (req, res, next) => {
    try {
        
        
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

       

        const user = await User.findOne({ _id: decoded.id });

        if (!user) return res.status(401).json({ message: "Unauthorized" });
        
        const accessToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email,
                username: user.username
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
        
        return res.status(200).json({ token: accessToken });
    } catch (error) {
        return res.status(403).json({ message: "Unauthorized" });
    }
};

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie("refreshToken", { path: "/api/v1/auths/refresh" });
        return res.status(200).json({ success: true, message: "Logged out" });
    } catch (error) {
        next(error);
    }
}

export const changePassword = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(userId);

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        next(error);
    }
}

export const me = async (req, res, next) => {
    try {
        const user = req.user;
        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}