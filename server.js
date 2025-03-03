// server.js
require('dotenv').config(); // Load the .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const puzzleRoutes = require('./routes/puzzleRoutes');
const guessRoutes = require('./routes/guessRoutes');
const trafficRoutes = require('./routes/trafficRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Replace this with your actual MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Setup routes
app.use('/puzzle', puzzleRoutes);
app.use('/guess', guessRoutes);
app.use('/traffic', trafficRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
