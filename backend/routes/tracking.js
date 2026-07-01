const express = require("express");
const router = express.Router();
const TrackingController = require("../controllers/TrackingController");
const { authMiddleware } = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// ROUTE PUBLIC (TANPA AUTH) - HARUS DI ATAS AUTH MIDDLEWARE
router.get("/public/:trackingNumber", TrackingController.publicTrack);

// ROUTE PROTECTED (PAKAI AUTH) - DILETAKKAN DI BAWAH
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