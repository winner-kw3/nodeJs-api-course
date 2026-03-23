
const prisma = require("../prisma/prisma");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");


const registerUser = async (nom, email, password) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Erreur : veuillez choisir un autre email");

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { nom, email, password: hashedPassword },
  });

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user, token };
};


const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Utilisateur non trouvé");

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error("Mot de passe incorrect");

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user, token };
};


const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Utilisateur non trouvé");

  return {
    id: user.id,
    nom: user.nom,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};