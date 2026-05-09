const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const resultRoutes = require('./routes/resultRoutes');

// Routes Import
const quizRoutes = require('./routes/quizRoutes');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();

// --- Middleware ---
app.use(express.json()); // Body parser: JSON data handle karne ke liye
app.use(cors()); // Cross-Origin Resource Sharing allow karne ke liye

// --- Routes Registration ---
// Inhe upar rakhna behtar hai taaki server ready hote hi routes map ho jayein
app.use('/api/auth', authRoutes); 
app.use('/api/quizzes', quizRoutes);
app.use('/api/results', resultRoutes);

// --- MongoDB Connection ---
// Humein ensure karna hai ki hum naye Mongoose options use karein (optional in latest Mongoose but safe)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully...");
    // Server tabhi listen karega jab DB connect ho jayega
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1); 
  });

// --- Root/Test Route ---
app.get('/', (req, res) => {
    res.status(200).json({ message: "Quiz Maker API is running perfectly! 🚀" });
});

// --- 404 Route Handler ---
// Agar koi galat endpoint hit kare toh "Cannot GET /" ki jagah ye dikhega
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Route not found!" });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error!";
    console.error("Internal Error:", err.stack); // Debugging ke liye console mein error log hoga
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});