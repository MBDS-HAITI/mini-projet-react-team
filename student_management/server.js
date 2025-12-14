
import express from 'express';
import mongoose from'mongoose';
import studentroutes from './routes/student.route.js';
import courseRoutes from './routes/course.route.js';
import gradesRoutes from './routes/grades.route.js';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from './config/swagger.js';
import { MONGODB_URI, NODE_ENV, PORT } from './config/env.js';
import fs from "fs";
import https from "https";



// Enable mongoose debug mode in development environment
if (NODE_ENV === "development") {
    mongoose.set("debug", true);
}


const app = express();
const key = fs.readFileSync("./data/react_team.key");
const cert = fs.readFileSync("./data/react_team.crt");

app.use("/swagger/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.use("/api/v1/students", studentroutes);
app.use("/api/v1/courses", courseRoutes);
app.use('/api/v1/grades', gradesRoutes);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    https.createServer({ key, cert }, app).listen(PORT, () => {
      console.log(`HTTPS server is running on https://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
    process.exit(1);
  });






export default app;


