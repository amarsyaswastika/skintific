const express = require("express");
const router = express.Router();
const RateController = require("../controllers/RateController");
const { authMiddleware } = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// Semua route harus login dulu
router.use(authMiddleware);

// GET all rates - Admin & Staff bisa akses (Courier TIDAK)
router.get("/", authorize("admin", "staff"), RateController.index);

// GET rate by id - Admin & Staff bisa akses
router.get("/:id", authorize("admin", "staff"), RateController.show);

// POST calculate - Untuk hitung ongkir, bisa diakses semua (termasuk Courier)
router.post("/calculate", authorize("admin", "staff", "courier"), RateController.calculate);

// CREATE, UPDATE, DELETE - Hanya admin & staff
router.post("/", authorize("admin", "staff"), RateController.store);
router.put("/:id", authorize("admin", "staff"), RateController.update);
router.delete("/:id", authorize("admin"), RateController.destroy);

module.exports = router;