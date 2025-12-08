
const express = require('express');
const router = express.Router();

const productController = require('../controllers/student.controller.js');
const {postStudent, getAllStudents, getStudent, putStudent, deleteStudent} = productController;

// Define routes and link to controller functions
router.post('/', postStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.put('/:id', putStudent);
router.delete('/:id', deleteStudent);

module.exports = router;