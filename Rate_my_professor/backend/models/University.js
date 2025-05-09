// models/University.js
const db = require('../config/db');

const UniversityModel = {
  /**
   * Retrieves a university and its associated ratings and reviews by university name.
   * @param {string} universityName - The name of the university to retrieve.
   * @returns {Promise<{ university: object, reviews: array }>} - A promise that resolves to an object containing the university details and an array of reviews.
   * @throws {Error} - If there is an error during the database query.
   */
  getUniversityByName: async (universityName) => {
    try {
      // 1. Fetch university details by name
      const universityQuery = `SELECT university_id, university_name, location, established_year FROM Universities WHERE university_name = ?;`;
      console.log('Executing university query:', universityQuery, [universityName]); // ADD THIS LINE
      const [universityResult] = await db.promise().query(universityQuery, [universityName]);
      console.log('University result:', universityResult);

      if (universityResult.length === 0) {
        return null; // Or you could throw an error:  throw new Error('University not found');
      }
      const university = universityResult[0];


      // 2. Fetch associated ratings and reviews
      const reviewsQuery = `
        SELECT 
          ur.*,
          u.full_name as student_name -- get the student's name
        FROM UniversityRatings ur
        LEFT JOIN Users u ON ur.student_id = u.user_id
        WHERE ur.university_id = ?
        ORDER BY ur.rated_on DESC;
      `;
      const [reviewsResult] = await db.promise().query(reviewsQuery, [university.university_id]);

      // 3. Return the combined data
      const reviews = reviewsResult.map(row => ({
        rating_id: row.rating_id,
        student_id: row.student_id,
        student_name: row.student_name, // Include student name in review data
        rating: row.rating,
        location: row.location_rating,
        reputation: row.reputation,
        opportunity: row.opportunity,
        happiness: row.happiness,
        internet: row.internet,
        faculty: row.faculty,
        clubs: row.clubs,
        social: row.social,
        food: row.food,
        safety: row.safety,
        review_text: row.review_text,
        date: row.rated_on.toISOString().split('T')[0] // Format the date
      }));
      return { university, reviews };
    } catch (error) {
      console.error('Error in UniversityModel.getUniversityByName:', error);
      throw error; // Re-throw the error to be handled in the controller
    }
  },

  getUniversityNamesByQuery: (query) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT university_name
        FROM Universities
        WHERE university_name LIKE ?
        LIMIT 10;
      `;
      db.query(sql, [`%${query}%`], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        const names = results.map(row => row.university_name);
        resolve(names);
      });
    });
  },
};

module.exports = UniversityModel;