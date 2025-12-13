
import express from 'express'
import {postStudent, getAllStudents, getStudent, putStudent, deleteStudent,getStudents} from '../controllers/student.controller.js';

const router = express.Router();

// Define routes and link to controller functions
router.post('/', postStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.put('/:id', putStudent);
router.delete('/:id', deleteStudent);
router.get('/filtered', getStudents);

export default router;