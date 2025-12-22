
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/env.js";
import User from '../models/user.model.js';

export const authorize = async (req, res, next)=>{
    try {
        let token;

        
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token){
            return res.status(401).json({message: "Unauthorized"})
        }

        const decoded = jwt.verify(token, JWT_SECRET)
        const user = await User.findById(decoded.id)
        
        if(!user || !user.isActive){
            return res.status(401).json({message: "Unauthorized"})
        }

        req.user=user;
        
        next();

    } catch (error) {
        return res.status(401).json({message: "Unauthorized"})
    }
}

export const adminAuthorize = async (req, res, next)=>{
    try {       
        
        if(!req.user){
            return res.status(401).json({message: "Unauthorized"})
        }
        if(req.user.role !== "ADMIN"){
            return res.status(401).json({message: "Unauthorized"})
        }
        next();

    } catch (error) {
        return res.status(401).json({message: "Unauthorized"})
    }
}

export const scolariteAuthorize = async (req, res, next)=>{
    try {
        
        
        if(!req.user){
            return res.status(401).json({message: "Unauthorized"})
        }
        // Un ADMIN peut faire tout ce qu'un SCOLARITE peut faire
        if(req.user.role !== "SCOLARITE" && req.user.role !== "ADMIN"){
            return res.status(401).json({message: "Unauthorized"})
        }
        next();

    } catch (error) {
        return res.status(401).json({message: "Unauthorized"})
    }
}