const db = require('../config/db');

// Get all professors
const getAllProfessors = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT P.professor_id, P.professor_name, D.department_name, U.university_name, P.rating, P.ratings_count 
      FROM Professors P
      JOIN Departments D ON P.department_id = D.department_id
      JOIN Universities U ON D.university_id = U.university_id
    `;
    db.query(query, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

// Get a professor by name
const getProfessorByName = (name) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT P.*, D.department_name, U.university_name, AVG(PR.quality) AS rating, AVG(PR.difficulty) AS difficulty, SUM(CASE WHEN PR.would_take_again = 1 THEN 1 ELSE 0 END) * 100 / COUNT(PR.professor_id) AS would_take_again FROM Professors P JOIN Departments D ON P.department_id = D.department_id JOIN Universities U ON D.university_id = U.university_id LEFT JOIN ProfessorRatings PR ON P.professor_id = PR.professor_id WHERE P.professor_name = ? GROUP BY P.professor_id, P.user_id, P.department_id, P.professor_name, P.ratings_count, D.department_name, U.university_name;';
    console.log("Executing query:", query, "with name:", [name]);
    db.query(query, [name], (err, results) => {
      console.error("Database query error:", err);
      console.log("Query results:", results);
      if (err) reject(err);
      if (results.length === 0) {
        reject({ message: 'Professor not found' });
      } else {
        resolve(results[0]);
      }
    });
  });
};

// Get professor by ID
const getProfessorById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT P.*, D.department_name, U.university_name
      FROM Professors P
      JOIN Departments D ON P.department_id = D.department_id
      JOIN Universities U ON D.university_id = U.university_id
      WHERE P.professor_id = ?
    `;
    db.query(query, [id], (err, results) => {
      if (err) reject(err);
      if (results.length === 0) {
        reject({ message: 'Professor not found' });
      } else {
        resolve(results[0]);
      }
    });
  });
};

// Add review to professor
const addReviewToProfessor = (professorId, reviewData) => {
  return new Promise((resolve, reject) => {
    const {
      student_id,
      quality,
      difficulty,
      would_take_again,
      for_credits,
      attendance,
      review
    } = reviewData;

    const insertReviewQuery = `
      INSERT INTO ProfessorRatings 
      (professor_id, student_id, quality, difficulty, would_take_again, for_credits, attendance, review) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(insertReviewQuery, [
      professorId,
      student_id,
      quality,
      difficulty,
      would_take_again,
      for_credits,
      attendance,
      review
    ], (err) => {
      if (err) reject(err);

      const updateProfessorQuery = `
        UPDATE Professors
        SET rating = (rating * ratings_count + ?) / (ratings_count + 1),
            ratings_count = ratings_count + 1
        WHERE professor_id = ?
      `;

      db.query(updateProfessorQuery, [quality, professorId], (err2) => {
        if (err2) reject(err2);
        resolve('Review added successfully');
      });
    });
  });
};

// Get all reviews for a professor
const getProfessorReviews = (professorId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM ProfessorRatings 
      WHERE professor_id = ? 
      ORDER BY rated_on DESC;`;
    db.query(query, [professorId], (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

const getProfessorSuggestions = (query) => {
  return new Promise((resolve, reject) => {
      const searchQuery = `%${query}%`;
      const suggestionQuery = `
          SELECT professor_name 
          FROM Professors 
          WHERE professor_name LIKE ? 
          LIMIT 10
      `;
      db.query(suggestionQuery, [searchQuery], (err, results) => {
          if (err) reject(err);
          const suggestions = results.map(row => row.professor_name);
          resolve(suggestions);
      });
  });
};

module.exports = {
  getAllProfessors,
  getProfessorById,
  getProfessorByName,
  addReviewToProfessor,
  getProfessorReviews,
  getProfessorSuggestions
};
