const express = require("express");
const router = express.Router();
const RateController = require("../controllers/RateController");
const { authMiddleware } = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// HANYA ADMIN yang bisa kelola tarif
router.use(authMiddleware);
router.use(authorize("admin")); // ← staff, customer, courier TIDAK BISA

router.get("/", RateController.index);
router.get("/:id", RateController.show);
router.post("/", RateController.store);
router.put("/:id", RateController.update);
router.delete("/:id", RateController.destroy);
router.post("/calculate", RateController.calculate);

module.exports = router;