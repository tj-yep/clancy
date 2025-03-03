// models/Guess.js
const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  id: { type: String, required: true },
  attempted: { type: Date, default: Date.now }
});

const visit = mongoose.model('visit', visitSchema);

module.exports = visit;
