const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        // Email already exists check
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) return res.status(400).json("Email already exists!");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username, // Model field 'username' se match kiya
            email: req.body.email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json("User not found!");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json("Wrong password!");

        // Token banana (Secret key process.env se uthana best hai)
       // Login logic ke andar jahan token sign ho raha hai
const token = jwt.sign(
    { id: user._id }, 
    "shivam_secret_key", // 🔥 .env se match hona chahiye
    { expiresIn: "3d" }
);

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, token });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;