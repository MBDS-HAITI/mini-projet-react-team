// Inject environment variables from .env file
require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');

// Enable mongoose debug mode in development environment
if (process.env.NODE_ENV === "development") {
    mongoose.set("debug", true);
}

const productRoutes = require('./routes/student.route.js');
const courseRoutes = require('./routes/course.route.js');

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
app.use("/api/students", productRoutes);
app.use("/api/courses", courseRoutes);


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
    






module.exports = app;


