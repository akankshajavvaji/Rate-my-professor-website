// routes/universities.js

const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityController');

router.get('/', universityController.getAllUniversities);
router.get('/name/:name', universityController.getUniversityByName);
router.post('/review', universityController.addReview);

router.get('/suggestions', universityController.getUniversitySuggestions);

module.exports = router;
