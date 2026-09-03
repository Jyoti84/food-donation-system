const Donation = require("../models/Donation");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const createDonation = async (req, res) => {
    try {
        const {
            foodType,
            quantity,
            unit,
            bestBefore,
            pickupAddress
        } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "Food proof image is required"
            });
        }

        const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "food-donation/donor-proofs"
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                Readable.from([req.file.buffer]).pipe(uploadStream);
            });
        };

        const result = await uploadToCloudinary();

        const donation = await Donation.create({
            donor: req.user.id,
            foodType,
            quantity,
            unit,
            bestBefore,
            pickupAddress,
            donorProofImage: result.secure_url
        });

        res.status(201).json({
            message: "Donation created successfully",
            donation
        });

    } catch (error) {
        console.error("Create donation error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getAvailableDonations = async (req, res) => {
    try {
        const donations = await Donation.find({
            status: "available"
        });

        res.status(200).json({
            donations
        });
    } catch (error) {
        console.error("Available donations error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({
            donor: req.user.id
        })
            .populate("claimedBy", "name email")
            .sort({ createdAt: -1 });

        console.log(
            "POPULATED DONATIONS:",
            JSON.stringify(donations, null, 2)
        );

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


// DONOR updates their own donation
const updateDonation = async (req, res) => {
    try {
        const { id } = req.params;

        const donation = await Donation.findOne({
            _id: id,
            donor: req.user.id
        });

        if (!donation) {
            return res.status(404).json({
                message: "Donation not found"
            });
        }

        // Only available donations can be edited
        if (donation.status !== "available") {
            return res.status(400).json({
                message:
                    "Only available donations can be edited"
            });
        }

        const {
            foodType,
            quantity,
            unit,
            bestBefore,
            pickupAddress
        } = req.body;

        // Update only provided fields
        if (foodType !== undefined) {
            donation.foodType = foodType;
        }

        if (quantity !== undefined) {
            donation.quantity = quantity;
        }

        if (unit !== undefined) {
            donation.unit = unit;
        }

        if (bestBefore !== undefined) {
            donation.bestBefore = bestBefore;
        }

        if (pickupAddress !== undefined) {
            donation.pickupAddress = pickupAddress;
        }

        // If donor uploads a new proof image
        if (req.file) {
            const uploadToCloudinary = () => {
                return new Promise((resolve, reject) => {
                    const uploadStream =
                        cloudinary.uploader.upload_stream(
                            {
                                folder:
                                    "food-donation/donor-proofs"
                            },
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );

                    Readable.from([req.file.buffer]).pipe(
                        uploadStream
                    );
                });
            };

            const result = await uploadToCloudinary();

            donation.donorProofImage = result.secure_url;
        }

        await donation.save();

        return res.status(200).json({
            message: "Donation updated successfully",
            donation
        });

    } catch (error) {
        console.error("Update donation error:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// DONOR deletes their own donation
const deleteDonation = async (req, res) => {
    try {
        const { id } = req.params;

        const donation = await Donation.findOne({
            _id: id,
            donor: req.user.id
        });

        if (!donation) {
            return res.status(404).json({
                message: "Donation not found"
            });
        }

        // Only available donations can be deleted
        if (donation.status !== "available") {
            return res.status(400).json({
                message:
                    "Only available donations can be deleted"
            });
        }

        await Donation.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Donation deleted successfully"
        });

    } catch (error) {
        console.error("Delete donation error:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const claimDonation = async (req, res) => {
    try {
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

    } catch (error) {
        console.error("Claim donation error:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// DONOR generates OTP after volunteer claims donation
const generateOTP = async (req, res) => {
    try {
        const { id } = req.params;

        const donation = await Donation.findOne({
            _id: id,
            donor: req.user.id,
            status: "claimed"
        });

        if (!donation) {
            return res.status(400).json({
                message: "Donation not found or not claimed yet"
            });
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        donation.otp = otp;
        donation.otpVerified = false;

        await donation.save();

        return res.status(200).json({
            message: "OTP generated successfully",
            otp
        });

    } catch (error) {
        console.error("Generate OTP error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// VOLUNTEER verifies OTP
const verifyOTP = async (req, res) => {
    try {
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

        if (!donation.otp) {
            return res.status(400).json({
                message: "OTP has not been generated by the donor yet"
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
            message: "OTP verified successfully. Food marked as picked.",
            donation
        });

    } catch (error) {
        console.error("Verify OTP error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// VOLUNTEER uploads distribution proof
const uploadDistributionProof = async (req, res) => {
    try {
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

        if (!req.file) {
            return res.status(400).json({
                message: "Distribution proof image is required"
            });
        }

        const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "food-donation/volunteer-proofs"
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                Readable.from([req.file.buffer]).pipe(uploadStream);
            });
        };

        const result = await uploadToCloudinary();

        donation.volunteerProofImage = result.secure_url;

        await donation.save();

        return res.status(200).json({
            message: "Distribution proof uploaded successfully",
            donation
        });

    } catch (error) {
        console.error("Distribution proof error:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const getMyClaimedDonations = async (req, res) => {
    try {
        const donations = await Donation.find({
            claimedBy: req.user.id
        }).sort({ createdAt: -1 });

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


// VOLUNTEER marks donation as distributed
const markAsDistributed = async (req, res) => {
    try {
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

        // Distribution proof is compulsory
        if (!donation.volunteerProofImage) {
            return res.status(400).json({
                message:
                    "Please upload distribution proof before marking as distributed"
            });
        }

        donation.status = "distributed";

        await donation.save();

        return res.status(200).json({
            message: "Donation marked as distributed",
            donation
        });

    } catch (error) {
        console.error("Mark as distributed error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
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
};