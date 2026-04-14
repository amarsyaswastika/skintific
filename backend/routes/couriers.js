const express = require("express");
const router = express.Router();
const CourierController = require("../controllers/CourierController");
const { authMiddleware, isAdmin, isStaff } = require("../middleware/auth");

router.get("/", authMiddleware, CourierController.index);
router.get("/:id", authMiddleware, CourierController.show);
router.post("/", authMiddleware, isAdmin, CourierController.store);
router.put("/:id", authMiddleware, isAdmin, CourierController.update);
router.delete("/:id", authMiddleware, isAdmin, CourierController.destroy);

module.exports = router;

