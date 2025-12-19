
import express from "express";
import cors from "cors";
import mongoose from'mongoose';
import academicYearRoutes from './routes/academic-year.route.js';
import semesterRoutes from './routes/semester.route.js';
import studentRoutes from './routes/student.route.js';
import courseRoutes from './routes/course.route.js';
import enrollmentRoutes from './routes/enrollment.route.js';
import gradesRoutes from './routes/grades.route.js';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from './config/swagger.js';
import { MONGODB_URI, NODE_ENV, PORT } from './config/env.js';
import { passport, session, secret, configureGooglePassport, requireLogin } from "./auth/auth.js";
import fs from "fs";
import https from "https";
import { CORS_OPTIONS } from './config/cors.js';



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
app.use( cors(CORS_OPTIONS)
);

// routes 
app.use("/api/v1/academicyears", academicYearRoutes);
app.use("/api/v1/semesters", semesterRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);
app.use('/api/v1/grades', gradesRoutes);

//Test authentication route
const authenticaton_base = "/api/vx"; // évite les typos et garde ça simple

// Configure passport strategy (à faire une seule fois)
configureGooglePassport();


app.use(authenticaton_base, session({
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: true, // OK car tu es en https.createServer
  },
}));

app.use(authenticaton_base, passport.initialize());
app.use(authenticaton_base, passport.session());

// OAuth routes
app.get(`${authenticaton_base}/auth/google`,
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(`${authenticaton_base}/auth/google/callback`,
  passport.authenticate("google", { failureRedirect: `${authenticaton_base}/auth/fail` }),
  (req, res) => res.redirect(`${authenticaton_base}/authenticated`)
);

app.get(`${authenticaton_base}/auth/fail`, (req, res) => res.status(401).send("Auth failed"));

app.get(`${authenticaton_base}/authenticated`, requireLogin, (req, res) => res.json({ user: req.user }));

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


