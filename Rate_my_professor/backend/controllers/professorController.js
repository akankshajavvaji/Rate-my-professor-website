const ProfessorModel = require('../models/Professor');

const connection = require('../config/db'); 

// Get all professors
exports.getAllProfessors = (req, res) => {
  ProfessorModel.getAllProfessors()
    .then(professors => res.json(professors))
    .catch(err => res.status(500).json({ error: 'Error fetching professors' }));
};

// Get a professor by name
exports.getProfessorByName = (req, res) => {
  const { name } = req.params;
  console.log("Searching in Controller for:", name);
  ProfessorModel.getProfessorByName(name)
    .then(professor => res.json(professor))
    .catch(err => res.status(404).json({ error: err.message || 'Professor not found' }));
};

// Get professor by ID
exports.getProfessorById = (req, res) => {
  const { id } = req.params;
  ProfessorModel.getProfessorById(id)
    .then(professor => res.json(professor))
    .catch(err => res.status(404).json({ error: err.message || 'Professor not found' }));
};

// Add a review to a professor
exports.addReviewToProfessor = (req, res) => {
  const { id } = req.params;
  const reviewData = req.body;
  ProfessorModel.addReviewToProfessor(id, reviewData)
    .then(message => res.json({ message }))
    .catch(err => res.status(500).json({ error: 'Error adding review' }));
};

// Get all reviews for a professor
exports.getProfessorReviews = (req, res) => {
  const { id } = req.params;
  ProfessorModel.getProfessorReviews(id)
    .then(reviews => res.json(reviews))
    .catch(err => res.status(500).json({ error: 'Error fetching reviews' }));
};

// Get professor name suggestions
exports.getProfessorSuggestions = async (req, res) => {
  const { query } = req.query;
  if (query && query.length >= 2) {
      try {
          const suggestions = await ProfessorModel.getProfessorSuggestions(query);
          res.json(suggestions);
      } catch (error) {
          console.error('Error fetching professor suggestions:', error);
          res.status(500).json({ error: 'Failed to fetch suggestions' });
      }
  } else {
      res.json([]);
  }
};

exports.getProfessorByNameForCompare = async (req, res) => {
  const { name } = req.params;
  try {
      const professor = await ProfessorModel.getProfessorByName(name);
      if (!professor) {
          return res.status(404).json({ error: 'Professor not found' });
      }
      const reviews = await ProfessorModel.getProfessorReviews(professor.professor_id);
      res.json({ ...professor, reviews }); // Include the reviews in the response
  } catch (error) {
      console.error('Error fetching professor by name with reviews for compare:', error);
      res.status(500).json({ error: 'Failed to fetch professor' });
  }
};

exports.getProfessorByIdForCompare = async (req, res) => {
  const { id } = req.params;
  try {
      const professor = await ProfessorModel.getProfessorById(id);
      if (!professor) {
          return res.status(404).json({ error: 'Professor not found' });
      }
      const reviews = await ProfessorModel.getProfessorReviews(professor.professor_id);
      res.json({ ...professor, reviews }); // Include the reviews in the response
  } catch (error) {
      console.error('Error fetching professor by ID with reviews for compare:', error);
      res.status(500).json({ error: 'Failed to fetch professor' });
  }
};

