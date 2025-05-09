// backend/routes/professors.js
const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');

const {
    getAllProfessors,
    getProfessorById,
    getProfessorByName,
    addReviewToProfessor,
    getProfessorReviews,
    getProfessorSuggestions // ← Add this
} = require('../controllers/professorController');

router.get('/', getAllProfessors);
router.get('/:id', getProfessorById);
router.get('/suggestions', getProfessorSuggestions);
router.get('/name/:name', getProfessorByName);
router.get('/:id/reviews', getProfessorReviews);  // ← New route for fetching reviews
router.post('/:id/review', addReviewToProfessor);

router.get('/compare/name/:name', professorController.getProfessorByNameForCompare);
router.get('/compare/:id', professorController.getProfessorByIdForCompare);

module.exports = router;
