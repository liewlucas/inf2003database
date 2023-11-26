const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const mysql = require('mysql2/promise'); // Using 'mysql2/promise' for async/await support
const crypto = require('crypto');

const verifyToken = require('./authentication');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// MongoDB Configuration
const mongoURI = 'mongodb+srv://root:INF2003@clusterinf2003.k5hap9s.mongodb.net/?retryWrites=true&w=majority';
const mongoClient = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// MySQL Configuration
const mysqlConfig = {
  host: '35.247.119.23',
  user: 'root',
  password: 'inf2003@SIT',
  database: 'inf2003',
};
const pool = mysql.createPool(mysqlConfig);

// Hashing function using the crypto module
const hashPassword = (password) => {
  const hash = crypto.createHash('sha256');
  hash.update(password + 'abc');
  return hash.digest('hex');
};

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { email, password, hashKey, type, user_info } = req.body;

  try {
    await mongoClient.connect();
    const db = mongoClient.db('inf2003');
    const collection = db.collection('user');

    // Find the latest userId in the collection
    const latestUser = await collection.find().sort({ userId: -1 }).limit(1).toArray();

    // Calculate the new userId by incrementing the latest userId
    let newUserId = latestUser.length === 0 ? 1 : latestUser[0].userId + 1;
    newUserId = Math.max(newUserId, 1);

    // Hash the provided password before storing it in the database
    const hashedPassword = hashPassword(password);

    // Create a new user object
    const newUser = {
      userId: newUserId,
      email,
      password: hashedPassword,
      hashKey,
      type,
      user_info,
    };

    // Insert the new user into the database
    const result = await collection.insertOne(newUser);

    res.status(201).json({ success: true, message: 'Registration successful', userId: result.insertedId });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await mongoClient.close();
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await mongoClient.connect();
    const db = mongoClient.db('inf2003');
    const collection = db.collection('user');

    // Hash the provided password before comparing it with the database
    const hashedPassword = hashPassword(password);

    const user = await collection.findOne({ email, password: hashedPassword });

    if (user) {
      // Generate a JWT token
      const token = jwt.sign({ email: user.email, userId: user._id }, 'INF2003', { expiresIn: '1h' });

      res.status(200).json({ success: true, message: 'Login successful', token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await mongoClient.close();
  }
});

// Protected route example
app.get('/api/user', verifyToken, (req, res) => {
  // This endpoint is protected, only accessible with a valid token
  res.json({ success: true, user: req.user });
});
app.get('/api/carmodels', async (req, res) => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    try {
      // Fetch all car models from the database
      const [rows] = await connection.query('SELECT * FROM carmodel');

      // Send the car models as a JSON response
      res.status(200).json({ success: true, carModels: rows });
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  } catch (error) {
    console.error('Error:', error);

    // Send a JSON error response
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});
app.get('/api/post', async (req, res) => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    try {
      // Fetch all car models from the database
      const [rows] = await connection.query('SELECT * FROM post');

      // Send the car models as a JSON response
      res.status(200).json({ success: true, carModels: rows });
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  } catch (error) {
    console.error('Error:', error);

    // Send a JSON error response
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});
// Create new post endpoint
app.post('/api/posts', async (req, res) => {
  const { postTitle, cmID, postDate, price, quantity } = req.body;

  try {
    console.log('Decoded Token Payload:', req.user);
    // If authentication is not required, you can handle the dealerID in a different way
    const dealerID = 2299

    // Create a new post object
    const newPost = {
      postTitle,
      cmID,
      postDate,
      price,
      quantity,
      dealerID,
    };

    // Get a connection from the pool
    const connection = await pool.getConnection();

    try {
      // Insert the new post into the database
      const [result] = await connection.query(
        'INSERT INTO post (postTitle, cmID, postDate, price, quantity, dealerID) VALUES (?, ?, ?, ?, ?, ?)',
        [newPost.postTitle, newPost.cmID, newPost.postDate, newPost.price, newPost.quantity, newPost.dealerID]
      );

      res.status(201).json({ success: true, message: 'Post created successfully', postId: result.insertId });
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  } catch (error) {
    console.error('Error:', error);

    // Send a JSON error response
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
