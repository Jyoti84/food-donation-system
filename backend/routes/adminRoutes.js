const express = require("express");

const router = express.Router();

const {
    getAllUsers,
    getStats,
    getAllDonations
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/users", protect, adminOnly, getAllUsers);

router.get("/stats", protect, adminOnly, getStats);

router.get("/donations", protect, adminOnly, getAllDonations);

module.exports = router;