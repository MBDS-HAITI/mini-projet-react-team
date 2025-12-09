const express = require('express');
const router = express.Router();

const gradesController = require('../controllers/grades.controller.js');
const { postGrades, getAllgrades, getGrades, putGrades, deleteGrades } = gradesController;

router.post('/', postGrades);
router.get('/', getAllgrades);
router.get('/:id', getGrades);
router.put('/:id', putGrades);
router.delete('/:id', deleteGrades);

module.exports = router;
