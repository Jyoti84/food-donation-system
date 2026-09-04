const express = require("express");

const router = express.Router();

const {
    getAllUsers,
    getStats,
    getAllDonations,
    deactivateUser,
    activateUser
} = require("../controllers/adminController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

// Get all users
router.get(
    "/users",
    protect,
    adminOnly,
    getAllUsers
);

// Get platform statistics
router.get(
    "/stats",
    protect,
    adminOnly,
    getStats
);

// Get all donations
router.get(
    "/donations",
    protect,
    adminOnly,
    getAllDonations
);

// Deactivate user
router.put(
    "/users/:id/deactivate",
    protect,
    adminOnly,
    deactivateUser
);

// Activate user
router.put(
    "/users/:id/activate",
    protect,
    adminOnly,
    activateUser
);

module.exports = router;