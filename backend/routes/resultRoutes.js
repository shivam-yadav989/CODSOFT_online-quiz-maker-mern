const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const authMiddleware = require('../middleware/authMiddleware');

// 🔥 YAHAN DHAYAN DO: Sirf '/save' hona chahiye
router.post('/save', authMiddleware, async (req, res) => {
    try {
        const { quizId, score, totalQuestions } = req.body;
        
        const newResult = new Result({
            quiz: quizId,
            user: req.user.id,
            score,
            totalQuestions
        });

        await newResult.save();
        res.status(201).json({ message: "Score saved!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;