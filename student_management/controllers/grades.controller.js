import Grades from '../models/grades.model.js';

export const postGrades = async (req, res) => {
   try {
      const grades = await Grades.create(req.body);
      res.status(201).json(grades);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

export const getAllgrades = async (req, res) => {
   try {
      const grades = await Grades.find()
         .populate('student')
         .populate('course');

      res.status(200).json(grades);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

export const getGrades = async (req, res) => {
   try {
      const { id } = req.params;
      const grades = await Grades.findById(id)
         .populate('student')
         .populate('course');

      if (!grades) {
         return res.status(404).json({ message: "Grades not found" });
      }

      res.status(200).json(grades);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

export const putGrades = async (req, res) => {
   try {
      const { id } = req.params;
      const grades = await Grades.findByIdAndUpdate(id, req.body);

      if (!grades) {
         return res.status(404).json({ message: "Grades not found" });
      }

      const updatedGrades = await Grades.findById(id)
         .populate('student')
         .populate('course');

      res.status(200).json(updatedGrades);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

export const deleteGrades = async (req, res) => {
   try {
      const grades = await Grades.findByIdAndDelete(req.params.id);

      if (!grades) {
         return res.status(404).json({ message: "Grades not found" });
      }

      res.status(200).json(grades);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

