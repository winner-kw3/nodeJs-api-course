const crypto = require("crypto");
const prisma = require("../db/prisma");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; 



const generateRefreshToken = () => crypto.randomBytes(64).toString("hex");

const safeUser = (user) => ({
  id: user.id,
  nom: user.nom,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});



const registerUser = async (nom, email, password) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Erreur : veuillez choisir un autre email");

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { nom, email, password: hashedPassword },
  });

  
  const accessToken = generateToken({ id: user.id, email: user.email, role: user.role });
  return { accessToken, user: safeUser(user) };
};



const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Utilisateur non trouvé");

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error("Mot de passe incorrect");

  const accessToken = generateToken({ id: user.id, email: user.email, role: user.role });

  const rawRefreshToken = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      token: rawRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });

  return { accessToken, refreshToken: rawRefreshToken, user: safeUser(user) };
};



const refreshTokens = async (rawToken) => {
  const stored = await prisma.refreshToken.findUnique({
    where: { token: rawToken },
    include: { user: true },
  });

  if (!stored) throw new Error("Refresh token invalide ou révoqué.");

  if (stored.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    throw new Error("Refresh token expiré.");
  }

  
  const newRawToken = generateRefreshToken();
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: {
      token: newRawToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });

  const accessToken = generateToken({
    id: stored.user.id,
    email: stored.user.email,
    role: stored.user.role,
  });

  return { accessToken, newRefreshToken: newRawToken };
};



const revokeRefreshToken = async (rawToken) => {
  await prisma.refreshToken.deleteMany({ where: { token: rawToken } });
};



const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Utilisateur non trouvé");
  return safeUser(user);
};

module.exports = {
  registerUser,
  loginUser,
  refreshTokens,
  revokeRefreshToken,
  getProfile,
};