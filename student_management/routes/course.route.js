import express from 'express'
import { postCourse, getAllCourses,getCourse, putCourse, deleteCourse }  from '../controllers/course.controller.js';

const router = express.Router();


//Define links or routes to controller functions;
router.post('/', postCourse);
router.get('/', getAllCourses);
router.get('/:id', getCourse);
router.put('/:id', putCourse);
router.delete('/:id', deleteCourse);

export default router;

