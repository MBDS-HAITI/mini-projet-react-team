const express = require('express');
const router = express.Router();

const courseController = require('../controllers/course.controller.js');
const { postCourse, getAllCourses,getCourse, putCourse, deleteCourse } = courseController;

//Define links or routes to controller functions;
router.post('/', postCourse);
router.get('/', getAllCourses);
router.get('/:id', getCourse);
router.put('/:id', putCourse);
router.delete('/:id', deleteCourse);


module.exports = router;
