const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        // 🔥 FIX: Secret key ko exact wahi rakho jo .env mein hai
        jwt.verify(token, "shivam_secret_key", (err, user) => {
            if (err) return res.status(403).json("Token valid nahi hai!");
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};

module.exports = verifyToken;