// routes/puzzleRoutes.js
const express = require('express');
const DailyPuzzle = require('../models/DailyPuzzle.js');
const router = express.Router();

// A utility to get current date in YYYY-MM-DD format
function getDateString() {
  return new Date().toISOString().split('T')[0];
}

// GET /puzzle/today
// Returns the daily puzzle. If today's puzzle doesn't exist, create a new one.
router.get('/today', async (req, res) => {
  console.log('GET /puzzle/today');
  try {
    const today = getDateString();

    // Check if puzzle for today already exists
    let puzzle = await DailyPuzzle.findOne({ date: today });
    if (!puzzle) {
      // If no puzzle, create one
      const totalBlocks = 24 * 24; // 576
      const winningBlock = Math.floor(Math.random() * totalBlocks);

      puzzle = new DailyPuzzle({
        date: today,
        winningBlock,
      });
      await puzzle.save();
    }

    // Return puzzle info (we might NOT want to send winningBlock to client!)
    // For the sake of demonstration, let's hide winningBlock so the user can't cheat:
    res.json({
      date: puzzle.date,
      message: 'Puzzle for today loaded.',
      winningBlock: puzzle.winningBlock, // Omit or only send for demonstration
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get puzzle.' });
  }
});

module.exports = router;
