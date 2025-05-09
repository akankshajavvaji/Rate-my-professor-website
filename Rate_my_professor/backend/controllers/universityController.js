const db = require('../config/db');
const UniversityModel = require('../models/University');

// Get all universities
const getAllUniversities = (req, res) => {
    const sql = `SELECT * FROM Universities;`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send('Server Error');
        res.json(results);
    });
};

// Add review to university
const addReview = (req, res) => {
    const { universityId, student_id, rating, location, reputation, opportunity, happiness, internet, faculty, clubs, social, food, safety, review_text } = req.body;

    if (typeof rating !== 'number') {
        return res.status(400).send('Invalid review');
    }

    const insertReviewSQL = `
        INSERT INTO UniversityRatings 
        (university_id, student_id, rating, location, reputation, opportunity, happiness, internet, faculty, clubs, social, food, safety, review_text) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    db.query(insertReviewSQL, [
        universityId,
        student_id,
        rating,
        location,
        reputation,
        opportunity,
        happiness,
        internet,
        faculty,
        clubs,
        social,
        food,
        safety,
        review_text
    ], (err) => {
        if (err) return res.status(500).send('Error saving review');

        const updateUniSQL = `
            UPDATE Universities 
            SET rating = (rating * ratings_count + ?) / (ratings_count + 1), 
                ratings_count = ratings_count + 1 
            WHERE university_id = ?;
        `;
        db.query(updateUniSQL, [rating, universityId], (err2) => {
            if (err2) return res.status(500).send('Error updating rating');
            res.send('Review added');
        });
    });
};

/**
 * Retrieves a university by name, including its details and reviews.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */

const getUniversityByName = async (req, res) => {
    const { name } = req.params;
    console.log(`Attempting to find university with name: ${name}`);
    try {
      const result = await UniversityModel.getUniversityByName(name);
      console.log('Result from model:', result);
      if (!result) {
        return res.status(404).json({ error: 'University not found' });
      }
      res.json(result);
    } catch (error) {
        console.error('Error in getUniversityByName controller:', error);
      res.status(500).json({ error: 'Server Error' }); // Handle errors from the model
    }
  };


const getUniversitySuggestions = (req, res) => {
    const { query } = req.query;
    if (!query) {
      return res.json([]); // Return empty array if no query
    }
  
    UniversityModel.getUniversityNamesByQuery(query)
      .then(suggestions => {
        res.json(suggestions);
      })
      .catch(error => {
        console.error('Error fetching university suggestions:', error);
        res.status(500).json({ message: 'Error fetching university suggestions' });
      });
  };

module.exports = { getAllUniversities, addReview, getUniversityByName, getUniversitySuggestions };
