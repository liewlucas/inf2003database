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


    // let newUserId = 1;

    const latestUser = await collection.find().sort({ _id: -1 }).limit(1).toArray();
    console.log('latestuser:', latestUser);

    if (latestUser.length > 0) {
      newUserId = latestUser[0].userid+1;
      console.log("Latest UserId:  ", newUserId)
    }

    // Calculate the new userId by incrementing the latest userId
    // newUserId = latestUser.length === 0 ? 1 : parseInt(latestUser[0].userId) + 1;

    // // Ensure newUserId is not less than 1
    // newUserId = Math.max(newUserId, 1);


    // Hash the provided password before storing it in the database
    const hashedPassword = hashPassword(password);


    // Create a new user object
    const newUser = {
      userid: newUserId,
      email,
      password: hashedPassword,
      hashKey,
      type,
      user_info,
    };

    // Insert the new user into the database
    const result = await collection.insertOne(newUser);

    res.status(201).json({ success: true, message: 'Registration successful', userId: result.insertedId });
    console.log('New User ID:', newUserId);

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

// New endpoint to get user details
app.get('/api/getuserdetails', verifyToken, async (req, res) => {
  try {
    await client.connect();
    const db = client.db('inf2003');
    const collection = db.collection('user');

    // Fetch user details from the database using the userId from the token
    const userDetails = await collection.findOne({ _id: req.user.userId });

    if (userDetails) {
      // Send the user details to the client
      res.json({ success: true, userDetails });
    } else {
      res.status(404).json({ success: false, message: 'User details not found' });
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


