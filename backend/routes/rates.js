const express = require("express");
const router = express.Router();
const RateController = require("../controllers/RateController");
const { authMiddleware, isAdmin, isStaff } = require("../middleware/auth");

router.get("/", authMiddleware, RateController.getByRoute);
router.get("/all", authMiddleware, isAdmin, RateController.index);
router.get("/:id", authMiddleware, RateController.show);
router.post("/", authMiddleware, isAdmin, RateController.store);
router.post("/calculate", authMiddleware, RateController.calculate);
router.put("/:id", authMiddleware, isAdmin, RateController.update);
router.delete("/:id", authMiddleware, isAdmin, RateController.destroy);

module.exports = router;
