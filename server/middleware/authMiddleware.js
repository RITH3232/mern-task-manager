const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Grab the token from the request headers
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    // 2. Remove the word "Bearer " if it's there
    const actualToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    
    // 3. Verify the token using our secret key
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    
    // 4. Attach the decoded user ID to the request so the controller can use it
    req.user = decoded; 
    next(); // Pass the request to the controller!
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};