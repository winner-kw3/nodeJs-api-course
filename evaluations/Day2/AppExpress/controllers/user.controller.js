const userService = require('../services/user.service');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await userService.registerUser(name, email, password);
        res.json(result);
    } catch (e) {
        res.status(400).json({ message: e.message }); // ← e.message, pas err.message
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userService.loginUser(email, password);
        res.json(result);
    } catch (e) {
        res.status(400).json({ message: e.message }); // ← e.message, pas err.message
    }
};

const getProfile = async (req, res) => {
    try {
        const profile = await userService.getProfile(req.user.id);
        res.json({ success: true, data: profile });
    } catch (e) {
        res.status(404).json({ message: e.message });
    }
};

module.exports = { register, login, getProfile };