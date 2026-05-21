const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const { authMiddleware, isAdmin } = require("../middleware/auth");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/profile", authMiddleware, AuthController.profile);
router.put("/profile", authMiddleware, AuthController.updateProfile);
router.get("/users", authMiddleware, isAdmin, AuthController.getAllUsers);

module.exports = router;
