const express = require("express");
const router = express.Router();
const CourierController = require("../controllers/CourierController");
const { authMiddleware, isAdmin, isStaff, isCourier } = require("../middleware/auth");
const upload = require("../middleware/upload");



router.get("/", authMiddleware, CourierController.index);
router.get("/:id", authMiddleware, CourierController.show);
router.post("/", authMiddleware, isAdmin, CourierController.store);
router.put("/:id", authMiddleware, isAdmin, CourierController.update);
router.delete("/:id", authMiddleware, isAdmin, CourierController.destroy);
// POST create courier  - DENGAN UPLOAD LOGO
router.post("/", authMiddleware, isAdmin,isCourier,isStaff upload.single("logo"), CourierController.store);

// PUT update courier  - DENGAN UPLOAD LOGO (OPTIONAL)
router.put("/:id", authMiddleware, isAdmin,isCourier, isStaff upload.single("logo"), CourierController.update);

// DELETE courier 
router.delete("/:id", authMiddleware, isAdmin,isCourier, isStaff CourierController.destroy);

module.exports = router;

