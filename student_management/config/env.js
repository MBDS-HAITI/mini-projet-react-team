// config/env.js
import { config } from 'dotenv';

config({ path: '.env' });

// All dependencies in file .env
export const { PORT,
    NODE_ENV,
    MONGODB_URI,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_LINK_CALLBACK_URL,
    GOOGLE_LOGIN_CALLBACK_URL,
    FRONT_URL,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN,
    HOST_BASE_URL,
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USER,
    MAIL_PASS,
    MAIL_FROM,
    MAIL_FROM_NAME,
} = process.env