const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "supersecret";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Token manquant" });

    const token = authHeader.split(" ")[1];
    try {
        const user = jwt.verify(token, SECRET);
        req.user = user;
        next();
    } catch {
        res.status(403).json({ message: "Token invalide" });
    }
};

const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Accès réservé aux admins" });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };