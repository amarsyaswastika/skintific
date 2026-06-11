const express = require("express");
const router = express.Router();
const TrackingController = require("../controllers/TrackingController");
const { authMiddleware, isAdmin, isCourier } = require("../middleware/auth");

router.get("/", authMiddleware, isAdmin, TrackingController.index);
router.get("/shipment/:shipmentId", authMiddleware, TrackingController.getByShipment);
router.get("/:id", authMiddleware, TrackingController.show);
router.post("/", authMiddleware, isCourier, TrackingController.store);
router.put("/:id", authMiddleware, isCourier, TrackingController.update);
router.delete("/:id", authMiddleware, isAdmin, TrackingController.destroy);

router.get("/", TrackingController.index);
router.get("/shipment/:shipmentId", TrackingController.getByShipment);
router.get("/:id", TrackingController.show);
router.post("/", TrackingController.store);
router.put("/:id", TrackingController.update);
router.delete("/:id", isAdmin, TrackingController.destroy);

module.exports = router;
const express = require("express");
const router = express.Router();
const TrackingController = require("../controllers/TrackingController");
const { authMiddleware } = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.use(authMiddleware);

// GET all tracking - Admin, Staff, Courier bisa lihat
router.get("/", authorize("admin", "staff", "courier"), TrackingController.index);

// GET by shipment id
router.get("/shipment/:shipmentId", authorize("admin", "staff", "courier"), TrackingController.getByShipment);

// GET by id
router.get("/:id", authorize("admin", "staff", "courier"), TrackingController.show);

// POST create tracking - Courier BISA update status
router.post("/", authorize("admin", "staff", "courier"), TrackingController.store);

// PUT update - Admin & staff
router.put("/:id", authorize("admin", "staff"), TrackingController.update);

// DELETE - Admin only
router.delete("/:id", authorize("admin"), TrackingController.destroy);

module.exports = router;
