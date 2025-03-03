const express = require('express');
const visit = require('../models/visit');

const router = express.Router();


// POST /traffic
// Body: { userId
router.get('/log', async (req, res) => {
    try{
        const id = req.body.id;
        const newVisit = new visit({ attempted: new Date().getTime(), id: id });
        await newVisit.save();
        res.status(200).json({ message: `Visit recorded for ${id}` });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: 'Failed to record visit.' });
    }

});
module.exports = router;
