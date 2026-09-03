const express = require("express");

const router = express.Router();

const {
    createDonation,
    getAvailableDonations,
    getMyDonations,
    updateDonation,
    deleteDonation,
    claimDonation,
    generateOTP,
    verifyOTP,
    uploadDistributionProof,
    markAsDistributed,
    getMyClaimedDonations
} = require("../controllers/donationController");

const { protect } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

// Create donation + donor proof image
router.post(
    "/",
    protect,
    upload.single("donorProofImage"),
    createDonation
);

// Get available donations
router.get("/", protect, getAvailableDonations);

// Get donor's own donations
router.get("/my-donations", protect, getMyDonations);

// Get volunteer's claimed donations
router.get("/my-claimed", protect, getMyClaimedDonations);

// Donor edits their own donation
router.put(
    "/:id",
    protect,
    upload.single("donorProofImage"),
    updateDonation
);

// Donor deletes their own donation
router.delete(
    "/:id",
    protect,
    deleteDonation
);

// Volunteer claims donation
router.put("/:id/claim", protect, claimDonation);

// Donor generates OTP
router.post("/:id/otp", protect, generateOTP);

// Volunteer verifies OTP
router.post("/:id/verify-otp", protect, verifyOTP);

// Volunteer uploads distribution proof image
router.post(
    "/:id/distribution-proof",
    protect,
    upload.single("volunteerProofImage"),
    uploadDistributionProof
);

// Mark donation as distributed
router.put("/:id/distribute", protect, markAsDistributed);

module.exports = router;