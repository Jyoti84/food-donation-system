import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const VolunteerDashboard = ({ onLogout }) => {
    const [donations, setDonations] = useState([]);
    const [claimedDonations, setClaimedDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [claimedLoading, setClaimedLoading] = useState(true);

    const [otpInputs, setOtpInputs] = useState({});
    const [distributionProofs, setDistributionProofs] = useState({});
    const [uploadingProofs, setUploadingProofs] = useState({});

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const token = localStorage.getItem("token");

    // ================= FETCH AVAILABLE DONATIONS =================

    const fetchDonations = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/donations`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setDonations(data.donations || []);
            } else {
                alert(data.message || "Failed to fetch donations");
            }
        } catch (error) {
            console.error("Fetch donations error:", error);
            alert("Something went wrong while fetching donations");
        } finally {
            setLoading(false);
        }
    };

    // ================= FETCH CLAIMED DONATIONS =================

    const fetchClaimedDonations = async () => {
        try {
            setClaimedLoading(true);

            const response = await fetch(
                `${API_URL}/api/donations/my-claimed`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setClaimedDonations(data.donations || []);
            } else {
                alert(data.message || "Failed to fetch claimed donations");
            }
        } catch (error) {
            console.error("My claimed donations error:", error);
        } finally {
            setClaimedLoading(false);
        }
    };

    // ================= CLAIM DONATION =================

    const claimDonation = async (donationId) => {
        try {
            const response = await fetch(
                `${API_URL}/api/donations/${donationId}/claim`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Donation claimed successfully!");

                fetchDonations();
                fetchClaimedDonations();
            } else {
                alert(data.message || "Failed to claim donation");
            }
        } catch (error) {
            console.error("Claim donation error:", error);
            alert("Something went wrong while claiming donation");
        }
    };

    // ================= OTP INPUT =================

    const handleOtpChange = (donationId, value) => {
        setOtpInputs((prev) => ({
            ...prev,
            [donationId]: value,
        }));
    };

    // ================= VERIFY OTP =================

    const verifyOTP = async (donationId) => {
        const otp = otpInputs[donationId];

        if (!otp || otp.length !== 6) {
            alert("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/donations/${donationId}/verify-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        otp,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert(
                    "OTP verified successfully! Food marked as picked."
                );

                setOtpInputs((prev) => {
                    const updated = { ...prev };
                    delete updated[donationId];
                    return updated;
                });

                fetchClaimedDonations();
            } else {
                alert(data.message || "Invalid OTP");
            }
        } catch (error) {
            console.error("Verify OTP error:", error);
            alert("Something went wrong while verifying OTP");
        }
    };

    // ================= DISTRIBUTION PROOF FILE =================

    const handleDistributionProofChange = (donationId, file) => {
        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file only");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB");
            return;
        }

        setDistributionProofs((prev) => ({
            ...prev,
            [donationId]: file,
        }));
    };

    // ================= UPLOAD DISTRIBUTION PROOF =================

    const uploadDistributionProof = async (donationId) => {
        const file = distributionProofs[donationId];

        if (!file) {
            alert("Please select a distribution proof image first");
            return;
        }

        try {
            setUploadingProofs((prev) => ({
                ...prev,
                [donationId]: true,
            }));

            const formData = new FormData();

            formData.append("volunteerProofImage", file);

            const response = await fetch(
                `${API_URL}/api/donations/${donationId}/distribution-proof`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert(
                    "Distribution proof uploaded successfully!"
                );

                setDistributionProofs((prev) => {
                    const updated = { ...prev };
                    delete updated[donationId];
                    return updated;
                });

                fetchClaimedDonations();
            } else {
                alert(
                    data.message ||
                    "Failed to upload distribution proof"
                );
            }
        } catch (error) {
            console.error(
                "Distribution proof upload error:",
                error
            );

            alert(
                "Something went wrong while uploading proof"
            );
        } finally {
            setUploadingProofs((prev) => ({
                ...prev,
                [donationId]: false,
            }));
        }
    };

    // ================= MARK DISTRIBUTED =================

    const markAsDistributed = async (donationId) => {
        const donation = claimedDonations.find(
            (item) => item._id === donationId
        );

        if (!donation?.volunteerProofImage) {
            alert(
                "Please upload distribution proof before marking as distributed"
            );
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/donations/${donationId}/distribute`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert(
                    "Donation marked as distributed successfully!"
                );

                fetchClaimedDonations();
            } else {
                alert(
                    data.message ||
                    "Failed to mark donation as distributed"
                );
            }
        } catch (error) {
            console.error("Distribution error:", error);

            alert(
                "Something went wrong while updating donation"
            );
        }
    };

    // ================= INITIAL FETCH =================

    useEffect(() => {
        fetchDonations();
        fetchClaimedDonations();
    }, []);

    // ================= SEARCH + FILTER =================

    const filteredDonations = donations.filter((donation) => {
        const matchesSearch =
            donation.foodType
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            donation.pickupAddress
                ?.toLowerCase()
                .includes(search.toLowerCase());

        const matchesFilter =
            filter === "all" || donation.unit === filter;

        return matchesSearch && matchesFilter;
    });

    // ================= STYLES =================

    const pageStyle = {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f1f8f3, #e8f5e9)",
        fontFamily: "Arial, sans-serif",
        color: "#333",
    };

    const headerStyle = {
        background: "#198754",
        color: "white",
        padding: "18px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
    };

    const containerStyle = {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "35px 25px",
    };

    const cardStyle = {
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 5px 18px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb",
    };

    const sectionTitleStyle = {
        fontSize: "26px",
        fontWeight: "700",
        color: "#263238",
        marginBottom: "20px",
    };

    const inputStyle = {
        width: "100%",
        padding: "13px 15px",
        border: "1px solid #d1d5db",
        borderRadius: "9px",
        fontSize: "15px",
        outline: "none",
        boxSizing: "border-box",
    };

    const buttonStyle = {
        width: "100%",
        padding: "13px",
        border: "none",
        borderRadius: "9px",
        background: "#198754",
        color: "white",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
    };

    const infoTextStyle = {
        color: "#5f6368",
        fontSize: "15px",
        lineHeight: "1.6",
    };

    // ================= UI =================

    return (
        <div style={pageStyle}>

            {/* HEADER */}

            <header style={headerStyle}>
                <div>
                    <div
                        style={{
                            fontSize: "25px",
                            fontWeight: "700",
                        }}
                    >
                        🍲 FoodShare
                    </div>

                    <div
                        style={{
                            fontSize: "13px",
                            opacity: "0.9",
                            marginTop: "3px",
                        }}
                    >
                        Volunteer Dashboard
                    </div>
                </div>

                {onLogout && (
                    <button
                        onClick={onLogout}
                        style={{
                            background: "white",
                            color: "#198754",
                            border: "none",
                            padding: "9px 18px",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer",
                        }}
                    >
                        Logout
                    </button>
                )}
            </header>

            <div style={containerStyle}>

                {/* WELCOME */}

                <div
                    style={{
                        ...cardStyle,
                        marginBottom: "28px",
                        background:
                            "linear-gradient(135deg, #ffffff, #f7fff9)",
                    }}
                >
                    <h1
                        style={{
                            margin: "0 0 8px",
                            fontSize: "30px",
                            color: "#198754",
                        }}
                    >
                        Welcome, Volunteer! 👋
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            ...infoTextStyle,
                        }}
                    >
                        Find available food donations, claim them,
                        coordinate pickups and help distribute food
                        to people in need.
                    </p>
                </div>

                {/* SEARCH + FILTER */}

                <div
                    style={{
                        ...cardStyle,
                        marginBottom: "35px",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "minmax(0, 1fr) 200px",
                            gap: "15px",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="🔍 Search food or pickup location..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            style={inputStyle}
                        />

                        <select
                            value={filter}
                            onChange={(e) =>
                                setFilter(e.target.value)
                            }
                            style={inputStyle}
                        >
                            <option value="all">
                                All Units
                            </option>

                            <option value="kg">
                                kg
                            </option>

                            <option value="litre">
                                litre
                            </option>

                            <option value="pieces">
                                pieces
                            </option>

                            <option value="packets">
                                packets
                            </option>
                        </select>
                    </div>
                </div>

                {/* AVAILABLE DONATIONS */}

                <section style={{ marginBottom: "45px" }}>

                    <h2 style={sectionTitleStyle}>
                        Available Donations
                    </h2>

                    {loading ? (
                        <div
                            style={{
                                ...cardStyle,
                                textAlign: "center",
                                padding: "45px",
                            }}
                        >
                            <p style={infoTextStyle}>
                                Loading donations...
                            </p>
                        </div>
                    ) : filteredDonations.length === 0 ? (
                        <div
                            style={{
                                ...cardStyle,
                                textAlign: "center",
                                padding: "45px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "45px",
                                    marginBottom: "10px",
                                }}
                            >
                                🍽️
                            </div>

                            <h3
                                style={{
                                    margin: "0 0 8px",
                                    color: "#374151",
                                }}
                            >
                                No Available Donations
                            </h3>

                            <p style={infoTextStyle}>
                                There are currently no donations
                                matching your search.
                            </p>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: "22px",
                            }}
                        >
                            {filteredDonations.map((donation) => (
                                <div
                                    key={donation._id}
                                    style={cardStyle}
                                >

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "flex-start",
                                            gap: "10px",
                                            marginBottom: "18px",
                                        }}
                                    >
                                        <h3
                                            style={{
                                                margin: 0,
                                                fontSize: "21px",
                                                color: "#263238",
                                            }}
                                        >
                                            {donation.foodType}
                                        </h3>

                                        <span
                                            style={{
                                                background:
                                                    "#d1fae5",
                                                color:
                                                    "#047857",
                                                padding:
                                                    "6px 11px",
                                                borderRadius:
                                                    "20px",
                                                fontSize:
                                                    "12px",
                                                fontWeight:
                                                    "600",
                                                whiteSpace:
                                                    "nowrap",
                                            }}
                                        >
                                            Available
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            ...infoTextStyle,
                                            marginBottom: "20px",
                                        }}
                                    >
                                        <p>
                                            <strong>
                                                Quantity:
                                            </strong>{" "}
                                            {donation.quantity}{" "}
                                            {donation.unit}
                                        </p>

                                        <p>
                                            <strong>
                                                Best Before:
                                            </strong>{" "}
                                            {donation.bestBefore
                                                ? new Date(
                                                    donation.bestBefore
                                                ).toLocaleString()
                                                : "N/A"}
                                        </p>

                                        <p>
                                            <strong>
                                                Pickup Address:
                                            </strong>{" "}
                                            {donation.pickupAddress}
                                        </p>

                                        {/* DONOR PROOF IMAGE */}

                                        {donation.donorProofImage && (
                                            <div
                                                style={{
                                                    marginTop:
                                                        "15px",
                                                }}
                                            >
                                                <strong>
                                                    📷 Food Proof:
                                                </strong>

                                                <img
                                                    src={
                                                        donation.donorProofImage
                                                    }
                                                    alt="Food donation proof"
                                                    style={{
                                                        width:
                                                            "100%",
                                                        maxHeight:
                                                            "220px",
                                                        objectFit:
                                                            "cover",
                                                        borderRadius:
                                                            "10px",
                                                        marginTop:
                                                            "8px",
                                                        border:
                                                            "1px solid #e5e7eb",
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() =>
                                            claimDonation(
                                                donation._id
                                            )
                                        }
                                        style={buttonStyle}
                                    >
                                        🤝 Claim Donation
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* MY CLAIMED DONATIONS */}

                <section>

                    <h2 style={sectionTitleStyle}>
                        My Claimed Donations
                    </h2>

                    {claimedLoading ? (
                        <div
                            style={{
                                ...cardStyle,
                                textAlign: "center",
                                padding: "45px",
                            }}
                        >
                            <p style={infoTextStyle}>
                                Loading claimed donations...
                            </p>
                        </div>
                    ) : claimedDonations.length === 0 ? (
                        <div
                            style={{
                                ...cardStyle,
                                textAlign: "center",
                                padding: "45px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "45px",
                                    marginBottom: "10px",
                                }}
                            >
                                📦
                            </div>

                            <h3
                                style={{
                                    margin: "0 0 8px",
                                    color: "#374151",
                                }}
                            >
                                No Claimed Donations
                            </h3>

                            <p style={infoTextStyle}>
                                You have not claimed any donations yet.
                            </p>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(330px, 1fr))",
                                gap: "22px",
                            }}
                        >
                            {claimedDonations.map((donation) => {

                                let statusBackground = "#f3f4f6";
                                let statusColor = "#374151";

                                if (donation.status === "claimed") {
                                    statusBackground = "#fef3c7";
                                    statusColor = "#b45309";
                                } else if (
                                    donation.status === "picked"
                                ) {
                                    statusBackground = "#dbeafe";
                                    statusColor = "#1d4ed8";
                                } else if (
                                    donation.status === "distributed"
                                ) {
                                    statusBackground = "#d1fae5";
                                    statusColor = "#047857";
                                }

                                const selectedProof =
                                    distributionProofs[
                                        donation._id
                                    ];

                                const isUploading =
                                    uploadingProofs[
                                        donation._id
                                    ];

                                const proofUploaded =
                                    Boolean(
                                        donation.volunteerProofImage
                                    );

                                return (
                                    <div
                                        key={donation._id}
                                        style={cardStyle}
                                    >

                                        {/* CARD HEADER */}

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "flex-start",
                                                gap: "10px",
                                                marginBottom:
                                                    "18px",
                                            }}
                                        >
                                            <h3
                                                style={{
                                                    margin: 0,
                                                    fontSize:
                                                        "21px",
                                                    color:
                                                        "#263238",
                                                }}
                                            >
                                                {donation.foodType}
                                            </h3>

                                            <span
                                                style={{
                                                    background:
                                                        statusBackground,
                                                    color:
                                                        statusColor,
                                                    padding:
                                                        "6px 11px",
                                                    borderRadius:
                                                        "20px",
                                                    fontSize:
                                                        "12px",
                                                    fontWeight:
                                                        "700",
                                                    textTransform:
                                                        "capitalize",
                                                }}
                                            >
                                                {donation.status}
                                            </span>
                                        </div>

                                        {/* DETAILS */}

                                        <div
                                            style={{
                                                ...infoTextStyle,
                                                borderBottom:
                                                    "1px solid #eee",
                                                paddingBottom:
                                                    "16px",
                                            }}
                                        >
                                            <p>
                                                <strong>
                                                    Quantity:
                                                </strong>{" "}
                                                {donation.quantity}{" "}
                                                {donation.unit}
                                            </p>

                                            <p>
                                                <strong>
                                                    Pickup Address:
                                                </strong>{" "}
                                                {donation.pickupAddress}
                                            </p>

                                            <p>
                                                <strong>
                                                    OTP Verified:
                                                </strong>{" "}
                                                {donation.otpVerified
                                                    ? "Yes ✓"
                                                    : "No"}
                                            </p>

                                            {/* DONOR PROOF IMAGE */}

                                            {donation.donorProofImage && (
                                                <div
                                                    style={{
                                                        marginTop:
                                                            "15px",
                                                    }}
                                                >
                                                    <strong>
                                                        📷 Donor Food Proof:
                                                    </strong>

                                                    <img
                                                        src={
                                                            donation.donorProofImage
                                                        }
                                                        alt="Donor food proof"
                                                        style={{
                                                            width:
                                                                "100%",
                                                            maxHeight:
                                                                "220px",
                                                            objectFit:
                                                                "cover",
                                                            borderRadius:
                                                                "10px",
                                                            marginTop:
                                                                "8px",
                                                            border:
                                                                "1px solid #e5e7eb",
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* OTP VERIFICATION */}

                                        {donation.status === "claimed" &&
                                            !donation.otpVerified && (
                                                <div
                                                    style={{
                                                        marginTop:
                                                            "18px",
                                                        padding:
                                                            "17px",
                                                        background:
                                                            "#fffbeb",
                                                        border:
                                                            "1px solid #fde68a",
                                                        borderRadius:
                                                            "11px",
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            margin:
                                                                "0 0 12px",
                                                            color:
                                                                "#92400e",
                                                            fontSize:
                                                                "14px",
                                                            lineHeight:
                                                                "1.5",
                                                        }}
                                                    >
                                                        🔐 Ask the donor
                                                        for the 6-digit
                                                        OTP and enter it
                                                        below.
                                                    </p>

                                                    <input
                                                        type="text"
                                                        maxLength="6"
                                                        placeholder="Enter 6-digit OTP"
                                                        value={
                                                            otpInputs[
                                                                donation._id
                                                            ] ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleOtpChange(
                                                                donation._id,
                                                                e.target.value.replace(
                                                                    /\D/g,
                                                                    ""
                                                                )
                                                            )
                                                        }
                                                        style={{
                                                            ...inputStyle,
                                                            textAlign:
                                                                "center",
                                                            letterSpacing:
                                                                "7px",
                                                            fontSize:
                                                                "19px",
                                                            marginBottom:
                                                                "10px",
                                                        }}
                                                    />

                                                    <button
                                                        onClick={() =>
                                                            verifyOTP(
                                                                donation._id
                                                            )
                                                        }
                                                        style={{
                                                            ...buttonStyle,
                                                            background:
                                                                "#198754",
                                                        }}
                                                    >
                                                        ✓ Verify OTP
                                                    </button>
                                                </div>
                                            )}

                                        {/* PICKED */}

                                        {donation.status === "picked" && (
                                            <div
                                                style={{
                                                    marginTop:
                                                        "18px",
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        background:
                                                            "#eff6ff",
                                                        border:
                                                            "1px solid #bfdbfe",
                                                        color:
                                                            "#1d4ed8",
                                                        borderRadius:
                                                            "11px",
                                                        padding:
                                                            "16px",
                                                        marginBottom:
                                                            "15px",
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            margin:
                                                                "0 0 5px",
                                                            fontWeight:
                                                                "700",
                                                        }}
                                                    >
                                                        ✓ OTP Verified
                                                    </p>

                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize:
                                                                "14px",
                                                            lineHeight:
                                                                "1.5",
                                                        }}
                                                    >
                                                        Food has been
                                                        picked up.
                                                        Upload the
                                                        distribution
                                                        proof after
                                                        delivering the
                                                        food.
                                                    </p>
                                                </div>

                                                {/* DISTRIBUTION PROOF UPLOAD */}

                                                {!proofUploaded && (
                                                    <div
                                                        style={{
                                                            background:
                                                                "#f8fafc",
                                                            border:
                                                                "1px solid #cbd5e1",
                                                            borderRadius:
                                                                "11px",
                                                            padding:
                                                                "16px",
                                                            marginBottom:
                                                                "15px",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                margin:
                                                                    "0 0 10px",
                                                                fontWeight:
                                                                    "700",
                                                                color:
                                                                    "#334155",
                                                            }}
                                                        >
                                                            📷 Distribution
                                                            Proof
                                                        </p>

                                                        <p
                                                            style={{
                                                                margin:
                                                                    "0 0 12px",
                                                                fontSize:
                                                                    "13px",
                                                                color:
                                                                    "#64748b",
                                                                lineHeight:
                                                                    "1.5",
                                                            }}
                                                        >
                                                            Upload a photo
                                                            showing that
                                                            the donated
                                                            food has been
                                                            delivered.
                                                        </p>

                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) =>
                                                                handleDistributionProofChange(
                                                                    donation._id,
                                                                    e.target
                                                                        .files[0]
                                                                )
                                                            }
                                                            style={{
                                                                ...inputStyle,
                                                                marginBottom:
                                                                    "10px",
                                                            }}
                                                        />

                                                        {selectedProof && (
                                                            <div
                                                                style={{
                                                                    marginBottom:
                                                                        "10px",
                                                                    fontSize:
                                                                        "13px",
                                                                    color:
                                                                        "#475569",
                                                                }}
                                                            >
                                                                Selected:
                                                                {" "}
                                                                <strong>
                                                                    {
                                                                        selectedProof.name
                                                                    }
                                                                </strong>
                                                            </div>
                                                        )}

                                                        <button
                                                            onClick={() =>
                                                                uploadDistributionProof(
                                                                    donation._id
                                                                )
                                                            }
                                                            disabled={
                                                                !selectedProof ||
                                                                isUploading
                                                            }
                                                            style={{
                                                                ...buttonStyle,
                                                                background:
                                                                    selectedProof &&
                                                                    !isUploading
                                                                        ? "#0d6efd"
                                                                        : "#94a3b8",
                                                                cursor:
                                                                    selectedProof &&
                                                                    !isUploading
                                                                        ? "pointer"
                                                                        : "not-allowed",
                                                            }}
                                                        >
                                                            {isUploading
                                                                ? "Uploading..."
                                                                : "📤 Upload Distribution Proof"}
                                                        </button>
                                                    </div>
                                                )}

                                                {/* UPLOADED PROOF */}

                                                {proofUploaded && (
                                                    <div
                                                        style={{
                                                            background:
                                                                "#ecfdf5",
                                                            border:
                                                                "1px solid #a7f3d0",
                                                            borderRadius:
                                                                "11px",
                                                            padding:
                                                                "16px",
                                                            marginBottom:
                                                                "15px",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                margin:
                                                                    "0 0 10px",
                                                                fontWeight:
                                                                    "700",
                                                                color:
                                                                    "#047857",
                                                            }}
                                                        >
                                                            ✓ Distribution
                                                            Proof Uploaded
                                                        </p>

                                                        <img
                                                            src={
                                                                donation.volunteerProofImage
                                                            }
                                                            alt="Distribution proof"
                                                            style={{
                                                                width:
                                                                    "100%",
                                                                maxHeight:
                                                                    "220px",
                                                                objectFit:
                                                                    "cover",
                                                                borderRadius:
                                                                    "10px",
                                                                border:
                                                                    "1px solid #a7f3d0",
                                                            }}
                                                        />
                                                    </div>
                                                )}

                                                {/* MARK AS DISTRIBUTED */}

                                                <button
                                                    onClick={() =>
                                                        markAsDistributed(
                                                            donation._id
                                                        )
                                                    }
                                                    disabled={
                                                        !proofUploaded
                                                    }
                                                    style={{
                                                        ...buttonStyle,
                                                        background:
                                                            proofUploaded
                                                                ? "#198754"
                                                                : "#9ca3af",
                                                        cursor:
                                                            proofUploaded
                                                                ? "pointer"
                                                                : "not-allowed",
                                                        opacity:
                                                            proofUploaded
                                                                ? 1
                                                                : 0.7,
                                                    }}
                                                >
                                                    📦 Mark as Distributed
                                                </button>

                                                {!proofUploaded && (
                                                    <p
                                                        style={{
                                                            margin:
                                                                "8px 0 0",
                                                            textAlign:
                                                                "center",
                                                            fontSize:
                                                                "12px",
                                                            color:
                                                                "#6b7280",
                                                        }}
                                                    >
                                                        Upload distribution
                                                        proof to enable this
                                                        button.
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* DISTRIBUTED */}

                                        {donation.status ===
                                            "distributed" && (
                                                <div
                                                    style={{
                                                        marginTop:
                                                            "18px",
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            background:
                                                                "#ecfdf5",
                                                            border:
                                                                "1px solid #a7f3d0",
                                                            color:
                                                                "#047857",
                                                            borderRadius:
                                                                "11px",
                                                            padding:
                                                                "16px",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                margin:
                                                                    "0 0 5px",
                                                                fontWeight:
                                                                    "700",
                                                            }}
                                                        >
                                                            ✓ Donation
                                                            Distributed
                                                        </p>

                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                fontSize:
                                                                    "14px",
                                                                lineHeight:
                                                                    "1.5",
                                                            }}
                                                        >
                                                            This donation
                                                            has been
                                                            successfully
                                                            distributed.
                                                        </p>

                                                        {/* VOLUNTEER PROOF */}

                                                        {donation.volunteerProofImage && (
                                                            <div
                                                                style={{
                                                                    marginTop:
                                                                        "15px",
                                                                }}
                                                            >
                                                                <strong>
                                                                    📷 Distribution
                                                                    Proof:
                                                                </strong>

                                                                <img
                                                                    src={
                                                                        donation.volunteerProofImage
                                                                    }
                                                                    alt="Distribution proof"
                                                                    style={{
                                                                        width:
                                                                            "100%",
                                                                        maxHeight:
                                                                            "220px",
                                                                        objectFit:
                                                                            "cover",
                                                                        borderRadius:
                                                                            "10px",
                                                                        marginTop:
                                                                            "8px",
                                                                        border:
                                                                            "1px solid #a7f3d0",
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* FOOTER */}

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "50px",
                        padding: "20px",
                        color: "#6b7280",
                        fontSize: "13px",
                    }}
                >
                    FoodShare • Making a difference, one meal at a time ❤️
                </div>
            </div>
        </div>
    );
};

export default VolunteerDashboard;