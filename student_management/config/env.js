// config/env.js
import { config } from 'dotenv';

config({path: '.env'});

// All dependencies in file .env
export const { PORT,
    NODE_ENV,
    MONGODB_URI,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_CALLBACK_URL,
    FRONT_URL,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN,
    HOST_BASE_URL
 }=  process.env