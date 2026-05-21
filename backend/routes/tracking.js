const express = require("express");
const router = express.Router();
const TrackingController = require("../controllers/TrackingController");
const { authMiddleware, isAdmin, isStaff } = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// Hanya admin & staff yang bisa akses semua route di bawah
router.use(authMiddleware, authorize("admin", "staff"));

router.get("/", TrackingController.index);
router.get("/shipment/:shipmentId", TrackingController.getByShipment);
router.get("/:id", TrackingController.show);
router.post("/", TrackingController.store);
router.put("/:id", TrackingController.update);
router.delete("/:id", isAdmin, TrackingController.destroy);

module.exports = router;