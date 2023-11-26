const jwt = require('jsonwebtoken');

const secretKey = 'INF2003Project'; // Replace with your secret key

function verifyToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = verifyToken;
