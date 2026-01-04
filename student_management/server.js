
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import mongoose from'mongoose';

import academicYearRoutes from './routes/academic-year.route.js';
import authRoutes from './routes/auth.route.js';
import oauthRoutes from './routes/oauth.route.js';
import userRoutes from './routes/user.route.js';
import semesterRoutes from './routes/semester.route.js';
import studentRoutes from './routes/student.route.js';
import courseRoutes from './routes/course.route.js';
import enrollmentRoutes from './routes/enrollment.route.js';
import gradeRoutes from './routes/grade.route.js';

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from './config/swagger.js';

import { HOST_BASE_URL, MONGODB_URI, NODE_ENV, PORT } from './config/env.js';
import { passport, session, secret, configureGooglePassport, requireLogin } from "./auths/auth.js";

import { CORS_OPTIONS } from './config/cors.js';
import errorMiddleware from "./middlewares/error.middleware.js";
import { adminAuthorize, authorize, scolariteAuthorize } from "./middlewares/auth.middleware.js";



// Enable mongoose debug mode in development environment
if (NODE_ENV === "development") {
    mongoose.set("debug", true);
}


const app = express();

// Pour accepter les connexions cross-domain (CORS)
app.use(cors(CORS_OPTIONS));

app.use("/api/v1/swagger/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

// Middleware to parse JSON bodies and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// routes 
app.use("/api/v1/auths", authRoutes);
app.use("/api/v1/users", authorize, adminAuthorize, userRoutes);
app.use("/api/v1/academicyears", authorize, scolariteAuthorize, academicYearRoutes);
app.use("/api/v1/semesters", authorize, scolariteAuthorize, semesterRoutes);
app.use("/api/v1/students", authorize, studentRoutes);
app.use("/api/v1/courses",authorize, courseRoutes);
app.use("/api/v1/enrollments", authorize, enrollmentRoutes);
app.use('/api/v1/grades', authorize, gradeRoutes);

//authorize(pou course)
app.use(errorMiddleware);



//Test authentication route
export const authenticaton_base = "/api/vx"; // évite les typos et garde ça simple

// Configure passport strategy (à faire une seule fois)
configureGooglePassport();


// app.use(authenticaton_base, session({
//   secret,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     httpOnly: true,
//     sameSite: "lax",
//     secure: true, // OK car tu es en https.createServer
//   },
// }));

// app.use(authenticaton_base, passport.initialize());
// app.use(authenticaton_base, passport.session());


// // OAuth routes
// app.use(`${authenticaton_base}`, oauthRoutes)

//  app.get(`${authenticaton_base}/authenticated`, requireLogin, (req, res) => res.json({ user: req.user }));

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    
    app.listen(PORT,"0.0.0.0", () => {
      console.log(`HTTP server is running on ${HOST_BASE_URL}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
    process.exit(1);
  });

export default app;


