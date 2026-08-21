const Donation = require("../models/Donation");

const createDonation = async (req, res) => {
    const { foodType, quantity, unit, bestBefore, pickupAddress } = req.body;

    const donation = await Donation.create({
        donor: req.user.id,
        foodType,
        quantity,
        unit,
        bestBefore,
        pickupAddress
    });

    res.status(201).json({
        message: "Donation created successfully",
        donation
    });
};

const getAvailableDonations = async (req, res) => {
    const donations = await Donation.find({
        status: "available"
    });

    res.status(200).json({
        donations
    });
};

const getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({
            donor: req.user.id
        });

        res.status(200).json({
            donations
        });
    } catch (error) {
        console.error("My donations error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const claimDonation = async (req, res) => {
    const { id } = req.params;

    const donation = await Donation.findOneAndUpdate(
        {
            _id: id,
            status: "available"
        },
        {
            status: "claimed",
            claimedBy: req.user.id
        },
        {
            new: true
        }
    );

    if (!donation) {
        return res.status(400).json({
            message: "Donation is already claimed or does not exist"
        });
    }

    return res.status(200).json({
        message: "Donation claimed successfully",
        donation
    });
};

const generateOTP = async (req, res) => {
    const { id } = req.params;

    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    const donation = await Donation.findOneAndUpdate(
        {
            _id: id,
            status: "claimed",
            claimedBy: req.user.id
        },
        {
            otp
        },
        {
            new: true
        }
    );

    if (!donation) {
        return res.status(400).json({
            message: "Donation not found or not claimed by you"
        });
    }

    return res.status(200).json({
        message: "OTP generated successfully",
        otp
    });
};

const verifyOTP = async (req, res) => {
    const { id } = req.params;
    const { otp } = req.body;

    const donation = await Donation.findOne({
        _id: id,
        status: "claimed",
        claimedBy: req.user.id
    });

    if (!donation) {
        return res.status(400).json({
            message: "Donation not found or not claimed by you"
        });
    }

    if (donation.otp !== otp) {
        return res.status(400).json({
            message: "Invalid OTP"
        });
    }

    donation.status = "picked";
    donation.otpVerified = true;

    await donation.save();

    return res.status(200).json({
        message: "OTP verified successfully",
        donation
    });
};

const getMyClaimedDonations = async (req, res) => {
    try {
        console.log("my-claimed route reached");
        console.log("User:", req.user);

        const donations = await Donation.find({
            claimedBy: req.user.id
        });

        console.log("Donations found:", donations.length);

        res.status(200).json({
            donations
        });
    } catch (error) {
        console.error("My claimed donations error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const markAsDistributed = async (req, res) => {
    const { id } = req.params;

    const donation = await Donation.findOne({
        _id: id,
        status: "picked",
        claimedBy: req.user.id
    });

    if (!donation) {
        return res.status(400).json({
            message: "Donation not found or not assigned to you"
        });
    }

    donation.status = "distributed";

    await donation.save();

    return res.status(200).json({
        message: "Donation marked as distributed",
        donation
    });
};

module.exports = {
    createDonation,
    getAvailableDonations,
    getMyDonations,
    claimDonation,
    generateOTP,
    verifyOTP,
    markAsDistributed,
    getMyClaimedDonations
};
