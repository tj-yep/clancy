// models/Guess.js
const mongoose = require('mongoose');

const GuessSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: String, // also "2025-01-27" or a puzzle identifier
    required: true
  },
  guessIndex: {
    type: Number, // which block they guessed
    required: true
  },
  correct: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Guess', GuessSchema);
