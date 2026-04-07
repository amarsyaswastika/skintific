const express = require("express");
const router = express.Router();
const ShipmentController = require("../controllers/ShipmentController");
const { authMiddleware, isAdmin, isStaff, isCourier } = require("../middleware/auth");

router.get("/", authMiddleware, isAdmin, ShipmentController.index);
router.get("/user/:userId", authMiddleware, ShipmentController.getUserShipments);
router.get("/my", authMiddleware, ShipmentController.getUserShipments);
router.get("/track/:trackingNumber", ShipmentController.track);
router.get("/:id", authMiddleware, ShipmentController.show);
router.post("/", authMiddleware, ShipmentController.store);
router.put("/:id", authMiddleware, isAdmin, ShipmentController.update);
router.put("/:id/status", authMiddleware, isCourier, ShipmentController.updateStatus);
router.delete("/:id", authMiddleware, isAdmin, ShipmentController.destroy);

module.exports = router;