const express = require("express");
const router = express.Router();
const CourierController = require("../controllers/CourierController");
const { authMiddleware, isAdmin, isStaff, isCourier } = require("../middleware/auth");
const upload = require("../middleware/upload");

// GET all
router.get("/", authMiddleware, CourierController.index);

// GET by id
router.get("/:id", authMiddleware, CourierController.show);

// POST create courier (dengan upload logo)
router.post(
  "/",
  authMiddleware,
  isAdmin, // biasanya create hanya admin
  upload.single("logo"),
  CourierController.store
);

// PUT update courier (optional upload logo)
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  upload.single("logo"),
  CourierController.update
);

// DELETE courier
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  CourierController.destroy
);

module.exports = router;