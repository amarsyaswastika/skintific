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

module.exports = router;
