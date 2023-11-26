// server.js

const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3002;

// MySQL database connection configuration
const db = mysql.createConnection({
  host: '35.247.119.23',
  port: 3306,
  user: 'root',
  password: 'inf2003@SIT',
  database: 'inf2003', // Replace with your actual database name
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

// Your API endpoints go here...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
  
    // Check credentials against the database
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        if (results.length > 0) {
          // User found, send a success response
          res.json({ success: true, message: 'Login successful' });
        } else {
          // User not found or incorrect credentials
          res.status(401).json({ error: 'Invalid credentials' });
        }
      }
    });
  });
  