const express = require("express");

const router = express.Router();

const {
    createDonation,
    getAvailableDonations,
    getMyDonations,
    claimDonation,
    generateOTP,
    verifyOTP,
    markAsDistributed,
    getMyClaimedDonations
} = require("../controllers/donationController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createDonation);
router.get("/", protect, getAvailableDonations);
router.get("/my-donations", protect, getMyDonations);
router.put("/:id/claim", protect, claimDonation);
router.post("/:id/otp", protect, generateOTP);
router.post("/:id/verify-otp", protect, verifyOTP);
router.put("/:id/distribute", protect, markAsDistributed);
router.get("/my-claimed", protect, getMyClaimedDonations);

module.exports = router;
