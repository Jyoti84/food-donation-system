const express = require("express");

const router = express.Router();

const {
    getAllUsers,
    getStats,
    getAllDonations
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");

router.get("/users", protect, getAllUsers);
router.get("/stats", protect, getStats);
router.get("/donations", protect, getAllDonations);

module.exports = router;
