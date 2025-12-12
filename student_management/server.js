// Inject environment variables from .env file
import dotenv from 'dotenv';
import express from 'express';
import mongoose from'mongoose';
import studentroutes from './routes/student.route.js';
import courseRoutes from './routes/course.route.js';
import gradesRoutes from './routes/grades.route.js';


dotenv.config();

// Enable mongoose debug mode in development environment
if (process.env.NODE_ENV === "development") {
    mongoose.set("debug", true);
}


const app = express();

// Set the port and MongoDB URI from environment variables .env
const port = process.env.PORT || 8010;
const mongodbUri = process.env.MONGODB_URI;

// Middleware to parse JSON bodies and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// routes 
app.use("/api/students", studentroutes);
app.use("/api/courses", courseRoutes);
app.use('/api/grades', gradesRoutes);

mongoose.connect(mongodbUri)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(port,()=>{
            console.log(`Server is running on port ${port}`);
        });  
    })
    .catch(err => {
        console.error("Error connecting to MongoDB: ", err);
    }); 
    






export default app;


