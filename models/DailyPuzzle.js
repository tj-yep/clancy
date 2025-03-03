// models/DailyPuzzle.js
const mongoose = require('mongoose');

const DailyPuzzleSchema = new mongoose.Schema({
  date: {
    type: String, // e.g. "2025-01-27"
    required: true,
    unique: true
  },
  winningBlock: {
    type: Number, // e.g. an integer 0..575
    required: true
  },
  // Optionally store additional puzzle info if needed
});

module.exports = mongoose.model('DailyPuzzle', DailyPuzzleSchema);
