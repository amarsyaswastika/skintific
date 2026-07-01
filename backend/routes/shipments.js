const express = require("express");
const router = express.Router();
const ShipmentController = require("../controllers/ShipmentController");
const { authMiddleware } = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// Semua route harus login dulu
router.use(authMiddleware);

// ============ ROUTE STATIS ============

router.get("/dashboard/stats", authorize("admin", "staff", "courier"), ShipmentController.getStats);
router.get("/monthly-stats", authorize("admin", "staff", "courier"), ShipmentController.getMonthlyStats);

// ============ ROUTE DINAMIS ============
router.get("/", authorize("admin", "staff", "courier"), ShipmentController.index);
router.get("/:id", authorize("admin", "staff", "courier"), ShipmentController.show);
router.get("/:id/tracking", authorize("admin", "staff", "courier"), ShipmentController.getTrackingTimeline);

// ============ ROUTE WRITE ============
router.post("/", authorize("admin", "staff"), ShipmentController.store);
router.put("/:id", authorize("admin", "staff"), ShipmentController.update);
router.put("/:id/status", authorize("admin", "staff"), ShipmentController.updateStatus);
router.delete("/:id", authorize("admin"), ShipmentController.destroy);

module.exports = router;