import express from 'express'
import { postGrades, getAllgrades, getGrades, putGrades, deleteGrades } from '../controllers/grades.controller.js';

const router = express.Router();



router.post('/', postGrades);
router.get('/', getAllgrades);
router.get('/:id', getGrades);
router.put('/:id', putGrades);
router.delete('/:id', deleteGrades);


export default router;