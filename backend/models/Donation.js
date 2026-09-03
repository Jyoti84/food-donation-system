const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
    {
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        claimedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        foodType: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true
        },

        unit: {
            type: String,
            default: "kg"
        },

        bestBefore: {
            type: Date,
            required: true
        },

        pickupAddress: {
            type: String,
            required: true
        },

        // Donor proof image
        donorProofImage: {
            type: String,
            default: null
        },

        // Volunteer distribution proof image
        volunteerProofImage: {
            type: String,
            default: null
        },

        status: {
            type: String,
            enum: [
                "available",
                "claimed",
                "picked",
                "distributed",
                "expired"
            ],
            default: "available"
        },

        otp: {
            type: String,
            default: null
        },

        otpVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Donation", donationSchema);