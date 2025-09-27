const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.patch("/users/:id", protect, authController.updateUser);
router.delete("/users/:id", protect, authController.deleteUser);

module.exports = router;
