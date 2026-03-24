const userService = require('../services/user.service');

const COOKIE_NAME = 'refreshToken';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, 
  path: '/',
};



const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await userService.registerUser(name, email, password);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const { accessToken, refreshToken, user } = await userService.loginUser(email, password);

    res.cookie(COOKIE_NAME, refreshToken, cookieOptions);

    res.status(200).json({ accessToken, user });
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
};



const refresh = async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ message: 'Refresh token manquant.' });
    }

    
    const { accessToken, newRefreshToken } = await userService.refreshTokens(token);

    res.cookie(COOKIE_NAME, newRefreshToken, cookieOptions);

    res.status(200).json({ accessToken });
  } catch (e) {
    
    res.clearCookie(COOKIE_NAME, { path: '/' });
    res.status(401).json({ message: e.message });
  }
};



const logout = async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (token) {
      await userService.revokeRefreshToken(token);
    }

    res.clearCookie(COOKIE_NAME, { path: '/' });
    res.status(200).json({ message: 'Déconnexion réussie.' });
  } catch (e) {
    
    res.clearCookie(COOKIE_NAME, { path: '/' });
    res.status(500).json({ message: e.message });
  }
};



const getProfile = async (req, res) => {
  try {
    const profile = await userService.getProfile(req.user.id);
    res.status(200).json({ success: true, data: profile });
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

module.exports = { register, login, refresh, logout, getProfile };