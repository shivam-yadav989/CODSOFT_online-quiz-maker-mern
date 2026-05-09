const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz'); 
const authMiddleware = require('../middleware/authMiddleware');

// POST: /api/quizzes/create
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { title, questions, description } = req.body;

        // 1. Double Check: Kya authMiddleware ne user ID set ki?
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Auth failed: User ID missing in token" });
        }

        // 2. Data Cleaning: Frontend se aane wale extra fields (like correctAnswer string) filter ho jayenge
        const formattedQuestions = questions.map(q => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswerIndex: q.correctAnswerIndex
        }));

        const newQuiz = new Quiz({
            title,
            questions: formattedQuestions,
            description: description || `Quiz by ${req.user.username || 'User'}`,
            creator: req.user.id // Token se aayi ID hi use hogi
        });

        const savedQuiz = await newQuiz.save();
        
        // Response mein saved data bhejein
        res.status(201).json({
            message: "Quiz created successfully!",
            quiz: savedQuiz
        });

    } catch (err) {
        console.error("🔥 Backend Save Error:", err.message);
        
        // Agar Mongoose validation error hai toh detail mein batayein
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: "Validation Failed", details: err.message });
        }
        
        res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
});

// GET: /api/quizzes/all
router.get('/all', async (req, res) => {
    try {
        // .populate se creator ka sirf username aur email dikhega, password nahi
        const quizzes = await Quiz.find().populate('creator', 'username email'); 
        res.status(200).json(quizzes);
    } catch (err) {
        console.error("Fetch Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;