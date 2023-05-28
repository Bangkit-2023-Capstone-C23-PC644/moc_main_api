const jwt = require('jsonwebtoken');

async function verifyToken(req, res, next) {
    // Extract the JWT token from the request headers
    const token = req.headers.authorization;
  
    if (!token) {
      // If the token is missing, return an error response
      return res.status(401).json({ error: 'Missing token' });
    }
  
    try {
      // Verify and decode the JWT token
      const decoded = await jwt.verify(token, 'a');
  
      // Extract the user ID from the decoded token
      const nik = decoded.nik;
  
      // Attach the user ID to the request object for future use
      req.nik = nik;
  
      // Proceed to the next middleware or the actual handler
      return next();
    } catch (error) {
        console.log(error)
      // If the token is invalid, return an error response
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  module.exports= {verifyToken};