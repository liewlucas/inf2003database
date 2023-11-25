const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto'); // Import the crypto module

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://root:INF2003@clusterinf2003.k5hap9s.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Hashing function using the crypto module
const hashPassword = (password) => {
  const hash = crypto.createHash('sha256'); // You can use a more secure algorithm if needed
  hash.update(password + 'abc'); // Concatenate the password with your hash key
  return hash.digest('hex');
};

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await client.connect();
    const db = client.db('inf2003');
    const collection = db.collection('usertest');

    // Hash the provided password before comparing it with the database
    const hashedPassword = hashPassword(password);

    const user = await collection.findOne({ email, password: hashedPassword });

    if (user) {
      res.status(200).json({ success: true, message: 'Login successful' });
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
