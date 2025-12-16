import { config } from 'dotenv';

config({path: '.env'});

export const { PORT,
    NODE_ENV,
    MONGODB_URI,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET
 }=  process.env