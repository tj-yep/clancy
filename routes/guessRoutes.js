// routes/guessRoutes.js
const express = require('express');
const DailyPuzzle = require('../models/DailyPuzzle');
const Guess = require('../models/Guess');

const router = express.Router();

function getDateString() {
  return new Date().toISOString().split('T')[0];
}

// POST /guess
// Body: { userId, guessIndex }
router.post('/', async (req, res) => {
  try {
    const { userId, guessIndex } = req.body;
    const today = getDateString();

    // 1. Find today's puzzle
    const puzzle = await DailyPuzzle.findOne({ date: today });
    if (!puzzle) {
      return res.status(404).json({ error: 'No puzzle for today.' });
    }

    // 2. Check how many guesses the user has made today
    const guessCount = await Guess.countDocuments({ userId, date: today });
    if (guessCount >= 10) {
      return res.status(403).json({
        message: 'You have used up your 10 guesses for today.'
      });
    }

    // 3. Compare guess to the winning block
    const isCorrect = (parseInt(guessIndex, 10) === puzzle.winningBlock);

    // 4. Save guess in DB
    const guessDoc = new Guess({
      userId,
      date: today,
      guessIndex: parseInt(guessIndex, 10),
      correct: isCorrect
    });
    await guessDoc.save();

    // 5. Respond to user
    if (isCorrect) {
      return res.json({
        message: 'You found the winning block! Congratulations!',
        correct: true,
      });
    } else {
      const guessesUsed = guessCount + 1;
      const guessesLeft = 10 - guessesUsed;
      return res.json({
        message: 'Incorrect guess.',
        correct: false,
        guessesLeft,
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process guess.' });
  }
});

module.exports = router;
