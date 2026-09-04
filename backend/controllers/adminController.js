const User = require("../models/User");
const Donation = require("../models/Donation");

// Get all users
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

// Get platform statistics
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

// Get all donations
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

// Deactivate user
const deactivateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Admin cannot deactivate their own account
        if (user._id.toString() === req.user.id.toString()) {
            return res.status(400).json({
                message: "You cannot deactivate your own account"
            });
        }

        user.isActive = false;

        await user.save();

        res.status(200).json({
            message: "User deactivated successfully"
        });
    } catch (error) {
        console.error("Deactivate user error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Activate user
const activateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.isActive = true;

        await user.save();

        res.status(200).json({
            message: "User activated successfully"
        });
    } catch (error) {
        console.error("Activate user error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getAllUsers,
    getStats,
    getAllDonations,
    deactivateUser,
    activateUser
};