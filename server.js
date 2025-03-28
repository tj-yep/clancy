// server.js
require('dotenv').config(); // Load the .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors({ origin: "*" })); // Allow requests from any domain
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.set('trust proxy', true);

// Replace this with your actual MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

const logSchema = new mongoose.Schema({
  ip: String,
  referrer: String,
  sessionId: String,
  pageUrl: String,
  userID: String,
  username: String,
  isMobile: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  action: String,
});
  
  const Log = mongoose.model('Log', logSchema);
  
  // 3) Middlewares
  app.use(bodyParser.json());
  
  
  // 4) Routes
  app.post('/log', async (req, res) => {
    try {
      // Improved IP extraction with proper proxy handling
      const visitorIP = (req.headers['x-forwarded-for'] || '')
        .split(',')[0]  // Get the first IP in case of multiple proxies
        .trim() || 
        req.socket.remoteAddress || 
        'Unknown';
        
      // Remove IPv6 prefix if present
      const cleanIP = visitorIP.replace(/^::ffff:/, '');
      
      // Rest of your code
      const { action, referrer, sessionId, pageUrl, userID, username } = req.body;
      
      const newLog = new Log({
        ip: cleanIP,  // Store the cleaned IP
        action: action || 'No action provided',
        referrer: referrer || 'No referrer provided',
        timestamp: new Date(),
        sessionId: sessionId || 'No sessionId provided',
        pageUrl: pageUrl || 'No pageUrl provided',
        userID: userID || 'No userID provided',
        username: username || 'No username provided',
        isMobile: req.body.isMobile || 'not provided',
      });
      
      await newLog.save();
      res.status(200).json({ status: 'OK', message: 'Log recorded' });
    } catch (error) {
      console.error('Error saving log:', error);
      res.status(500).json({ status: 'ERROR', message: 'Log not recorded' });
    }
  });
  app.get('/logcount', async (req, res) => {
    const logCount = await Log.countDocuments();
    res.status(200).json({ status: 'OK', message: 'Log count', logCount });
  });
  
  // GET /logs: optional route to fetch all logs (for testing or admin)
  app.get('/logs', async (req, res) => {
    // Retrieve secret token from query parameter (e.g. /logs?secret=...)
    const providedSecret = req.query.secret;
    // Compare to environment variable
    if (!providedSecret || providedSecret !== process.env.LOGS_SECRET) {
      // If secret is missing or invalid, deny access
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    try {
      const allLogs = await Log.find().sort({ timestamp: -1 });
      res.status(200).json(allLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).json({ status: 'ERROR', message: 'Could not fetch logs' });
    }
  });

  // Simple home route
  app.get('/', (req, res) => {
    res.send('moochies Logging API is running...');
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });