const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");
const { registerSchema, loginSchema } = require("../schemas/user.schema");

router.post("/register", validate(registerSchema), userController.register);
router.post("/login", validate(loginSchema), userController.login);
router.get("/me", authMiddleware, userController.getProfile);

module.exports = router;