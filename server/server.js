const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const jwt = require('jsonwebtoken');
const verifyToken = require('./authentication'); // Import the verifyToken middleware
const crypto = require('crypto'); // Import the crypto module


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Use the cors middleware
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://root:INF2003@clusterinf2003.k5hap9s.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Hashing function using the crypto module
const hashPassword = (password) => {
  const hash = crypto.createHash('sha256'); // You can use a more secure algorithm if needed
  hash.update(password + 'abc'); // Concatenate the password with your hash key
  return hash.digest('hex');
};


// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { email, password, hashKey, type, user_info } = req.body;

  try {
    await client.connect();
    const db = client.db('inf2003');
    const collection = db.collection('user');

    // Find the latest userId in the collection
    const latestUser = await collection.find().sort({ userId: -1 }).limit(1).toArray();

    // Calculate the new userId by incrementing the latest userId
    let newUserId = latestUser.length === 0 ? 1 : latestUser[0].userId + 1;

    // Ensure newUserId is not less than 1
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
    await client.close();
  }
});



// Your existing login endpoint with modifications for token generation
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await client.connect();
    const db = client.db('inf2003');
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
    await client.close();
  }
});

// Protected route example
app.get('/api/user', verifyToken, (req, res) => {
  // This endpoint is protected, only accessible with a valid token
  res.json({ success: true, user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// app.post('/api/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     await client.connect();
//     const db = client.db('inf2003');
//     const collection = db.collection('usertest');

//     // Hash the provided password before comparing it with the database
//     const hashedPassword = hashPassword(password);

//     const user = await collection.findOne({ email, password: hashedPassword });

//     if (user) {
//       res.status(200).json({ success: true, message: 'Login successful' });
//     } else {
//       res.status(401).json({ success: false, message: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   } finally {
//     await client.close();
//   }
// });

app.get('/api/topmodels', async (req, res) => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();
 
    try {
      // Execute the SQL query to get the top 5 car models by total sales
      const [rows] = await connection.query(`
        SELECT carmodel.cmID, carmodel.modelName, SUM(carsales.quantity) as totalSales
        FROM carsales
        JOIN post ON carsales.postID = post.postID
        JOIN carmodel ON post.cmID = carmodel.cmID
        GROUP BY carmodel.cmID, carmodel.modelName
        ORDER BY totalSales DESC
        LIMIT 5
      `);
 
      // Send the result as a JSON response
      res.status(200).json({ success: true, topModels: rows });
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  } catch (error) {
    console.error('Error:', error);
 
    // Send a JSON error response
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

