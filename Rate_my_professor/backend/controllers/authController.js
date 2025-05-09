const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register a new user
const register = (req, res) => {
    const { full_name, email, user_type, username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const insertUserSQL = 'INSERT INTO Users (full_name, email, user_type) VALUES (?, ?, ?)';
    db.query(insertUserSQL, [full_name, email, user_type], (err, userResult) => {
        if (err) {
            console.error('User insert error:', err);
            return res.status(500).json({ error: 'User creation failed' });
        }

        const userId = userResult.insertId;

        const insertLoginSQL = 'INSERT INTO LoginCredentials (user_id, username, password_hash) VALUES (?, ?, ?)';
        db.query(insertLoginSQL, [userId, username, hashedPassword], (err2) => {
            if (err2) {
                console.error('Login insert error:', err2);
                return res.status(500).json({ error: 'Login credentials creation failed' });
            }

            res.status(201).json({ message: 'User registered successfully' });
        });
    });
};

// Login user
const login = (req, res) => {
    const { username, password } = req.body;

    const sql = `
        SELECT U.user_id, U.full_name, U.email, U.user_type, L.password_hash
        FROM Users U
        JOIN LoginCredentials L ON U.user_id = L.user_id
        WHERE L.username = ?
    `;

    db.query(sql, [username], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = results[0];
        const isValid = bcrypt.compareSync(password, user.password_hash);
        if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
};

module.exports = { register, login };
