const express = require("express");
const router = express.Router();
const CourierController = require("../controllers/CourierController");
const { authMiddleware } = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/upload");

// HANYA ADMIN yang bisa kelola kurir
router.use(authMiddleware);
router.use(authorize("admin")); // ← staff, customer, courier TIDAK BISA

router.get("/", CourierController.index);
router.get("/:id", CourierController.show);
router.post("/", upload.single("logo"), CourierController.store);
router.put("/:id", upload.single("logo"), CourierController.update);
router.delete("/:id", CourierController.destroy);

module.exports = router;