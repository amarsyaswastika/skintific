const express = require("express");
const router = express.Router();
const ShipmentController = require("../controllers/ShipmentController");
const { authMiddleware } = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// SEMUA ROUTE SHIPMENT hanya untuk admin & staff (yang sudah login dashboard)
router.use(authMiddleware);
router.use(authorize("admin", "staff")); // ← customer & courier TIDAK BISA akses

router.get("/dashboard/stats", ShipmentController.getStats);
router.get("/", ShipmentController.index);
router.get("/:id", ShipmentController.show);
router.post("/", ShipmentController.store);
router.put("/:id", ShipmentController.update);
router.put("/:id/status", ShipmentController.updateStatus);
router.delete("/:id", ShipmentController.destroy);
router.get("/:id/tracking", ShipmentController.getTrackingTimeline);

module.exports = router;