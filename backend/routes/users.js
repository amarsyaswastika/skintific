const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authMiddleware, isAdmin } = require("../middleware/auth");

// ==================== ROUTE UNTUK PROFILE SENDIRI (SEMUA ROLE) ====================
// Customer, Courier, Staff, Admin bisa akses profile mereka sendiri
router.get("/profile", authMiddleware, UserController.getProfile);
router.put("/profile", authMiddleware, UserController.updateProfile);
router.put("/profile/password", authMiddleware, UserController.updateOwnPassword);

// ==================== ROUTE UNTUK ADMIN (MANAGE ALL USERS) ====================
// Semua endpoint di bawah ini hanya bisa diakses oleh admin
router.get("/", authMiddleware, isAdmin, UserController.index);
router.get("/:id", authMiddleware, isAdmin, UserController.show);
router.post("/", authMiddleware, isAdmin, UserController.store);
router.put("/:id", authMiddleware, isAdmin, UserController.update);
router.put("/:id/role", authMiddleware, isAdmin, UserController.updateRole);
router.put("/:id/password", authMiddleware, isAdmin, UserController.updatePassword);
router.delete("/:id", authMiddleware, isAdmin, UserController.destroy);

module.exports = router;