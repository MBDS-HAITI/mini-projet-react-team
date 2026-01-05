
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_SECRET } from "../config/env.js";

export const signAccessToken = (user) => {
  return jwt.sign(
    {
        id: user._id,
        role: user.role,
        email: user.email,
        username: user.username
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}


export const signRefreshToken = (user) => {
  return jwt.sign(
        { id: user._id },
        JWT_REFRESH_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRES_IN }
      );
}