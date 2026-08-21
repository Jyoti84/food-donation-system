const User = require("../models/User");
const Donation = require("../models/Donation");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            users
        });
    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalDonors = await User.countDocuments({
            role: "donor"
        });

        const totalVolunteers = await User.countDocuments({
            role: "volunteer"
        });

        const totalDonations = await Donation.countDocuments();

        const availableDonations = await Donation.countDocuments({
            status: "available"
        });

        const claimedDonations = await Donation.countDocuments({
            status: "claimed"
        });

        const pickedDonations = await Donation.countDocuments({
            status: "picked"
        });

        const distributedDonations = await Donation.countDocuments({
            status: "distributed"
        });

        res.status(200).json({
            totalUsers,
            totalDonors,
            totalVolunteers,
            totalDonations,
            availableDonations,
            claimedDonations,
            pickedDonations,
            distributedDonations
        });
    } catch (error) {
        console.error("Get stats error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find()
            .populate("donor", "name email")
            .populate("claimedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            donations
        });
    } catch (error) {
        console.error("Get all donations error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
module.exports = {
    getAllUsers,
    getStats,
    getAllDonations
};
