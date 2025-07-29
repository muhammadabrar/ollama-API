const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'API key is required',
      message: 'Please provide an API key in the x-api-key header or Authorization header'
    });
  }

  // Remove 'Bearer ' prefix if present
  const cleanApiKey = apiKey.replace('Bearer ', '');
  
  if (cleanApiKey !== process.env.API_KEY) {
    return res.status(403).json({
      error: 'Invalid API key',
      message: 'The provided API key is invalid'
    });
  }

  next();
};

module.exports = apiKeyAuth; 