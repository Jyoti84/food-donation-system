import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

function VolunteerDashboard({ onLogout }) {
    const [donations, setDonations] = useState([]);
    const [claimedDonations, setClaimedDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [claimedLoading, setClaimedLoading] = useState(true);
    const [otpInputs, setOtpInputs] = useState({});

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const fetchDonations = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/donations`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            setDonations(data.donations);
        } catch (error) {
            console.error("Fetch donations error:", error);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };

    const fetchClaimedDonations = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/donations/my-claimed`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            setClaimedDonations(data.donations);
        } catch (error) {
            console.error("Fetch claimed donations error:", error);
            alert("Server error");
        } finally {
            setClaimedLoading(false);
        }
    };

    const claimDonation = async (donationId) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/donations/${donationId}/claim`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Donation claimed successfully");

            fetchDonations();
            fetchClaimedDonations();
        } catch (error) {
            console.error("Claim donation error:", error);
            alert("Server error");
        }
    };

    const generateOTP = async (donationId) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/donations/${donationId}/otp`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert(`OTP generated: ${data.otp}`);

            fetchClaimedDonations();
        } catch (error) {
            console.error("Generate OTP error:", error);
            alert("Server error");
        }
    };

    const verifyOTP = async (donationId) => {
        try {
            const token = localStorage.getItem("token");
            const otp = otpInputs[donationId];

            if (!otp) {
                alert("Please enter OTP");
                return;
            }

            const response = await fetch(
                `${API_URL}/api/donations/${donationId}/verify-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        otp
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("OTP verified successfully");

            setOtpInputs((prev) => ({
                ...prev,
                [donationId]: ""
            }));

            fetchClaimedDonations();
        } catch (error) {
            console.error("Verify OTP error:", error);
            alert("Server error");
        }
    };

    const markAsDistributed = async (donationId) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/donations/${donationId}/distribute`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Donation marked as distributed");

            fetchClaimedDonations();
        } catch (error) {
            console.error("Distribute donation error:", error);
            alert("Server error");
        }
    };

    useEffect(() => {
        fetchDonations();
        fetchClaimedDonations();
    }, []);

    const statusStyle = (status) => {
        if (status === "available") {
            return {
                backgroundColor: "#e8f5e9",
                color: "#198754"
            };
        }

        if (status === "claimed") {
            return {
                backgroundColor: "#fff3cd",
                color: "#856404"
            };
        }

        if (status === "picked") {
            return {
                backgroundColor: "#e3f2fd",
                color: "#1565c0"
            };
        }

        if (status === "distributed") {
            return {
                backgroundColor: "#f3e5f5",
                color: "#7b1fa2"
            };
        }

        return {
            backgroundColor: "#eeeeee",
            color: "#555"
        };
    };

    const getFreshness = (bestBefore) => {
        if (!bestBefore) {
            return {
                text: "No expiry time",
                backgroundColor: "#eeeeee",
                color: "#555"
            };
        }

        const now = new Date();
        const expiry = new Date(bestBefore);

        const difference = expiry - now;
        const hours = difference / (1000 * 60 * 60);

        if (difference <= 0) {
            return {
                text: "Expired",
                backgroundColor: "#ffebee",
                color: "#c62828"
            };
        }

        if (hours <= 6) {
            return {
                text: "Urgent - Expires Soon",
                backgroundColor: "#ffebee",
                color: "#c62828"
            };
        }

        if (hours <= 24) {
            return {
                text: "Expiring Within 24 Hours",
                backgroundColor: "#fff3cd",
                color: "#856404"
            };
        }

        return {
            text: "Fresh",
            backgroundColor: "#e8f5e9",
            color: "#198754"
        };
    };

    const filteredDonations = donations.filter((donation) => {
        const searchText = search.trim().toLowerCase();

        const foodType = String(
            donation.foodType || ""
        ).toLowerCase();

        const pickupAddress = String(
            donation.pickupAddress || ""
        ).toLowerCase();

        const matchesSearch =
            searchText === "" ||
            foodType.includes(searchText) ||
            pickupAddress.includes(searchText);

        const matchesFilter =
            filter === "all" ||
            donation.status === filter;

        return matchesSearch && matchesFilter;
    });

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                background:
                    "linear-gradient(135deg, #f1f8f3, #e8f5e9)",
                fontFamily: "Arial, sans-serif"
            }}
        >
            {/* Header */}

            <header
                style={{
                    width: "100%",
                    backgroundColor: "#ffffff",
                    padding: "18px 4%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow:
                        "0 2px 10px rgba(0,0,0,0.08)",
                    boxSizing: "border-box"
                }}
            >
                <div>
                    <h2
                        style={{
                            margin: 0,
                            color: "#198754",
                            fontSize: "26px"
                        }}
                    >
                        🍲 FoodShare
                    </h2>

                    <p
                        style={{
                            margin: "4px 0 0",
                            color: "#777",
                            fontSize: "13px"
                        }}
                    >
                        Volunteer Dashboard
                    </p>
                </div>

                <button
                    onClick={onLogout}
                    style={{
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "8px",
                        backgroundColor: "#198754",
                        color: "#ffffff",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Logout
                </button>
            </header>

            {/* Main */}

            <main
                style={{
                    width: "100%",
                    padding: "45px 4%",
                    boxSizing: "border-box"
                }}
            >
                {/* Welcome */}

                <section
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "18px",
                        padding: "35px",
                        marginBottom: "35px",
                        boxShadow:
                            "0 6px 20px rgba(52,78,65,0.08)"
                    }}
                >
                    <h1
                        style={{
                            margin: "0 0 10px",
                            color: "#344e41",
                            fontSize: "34px"
                        }}
                    >
                        Welcome, Volunteer! 🤝
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#777",
                            fontSize: "16px"
                        }}
                    >
                        Help collect and distribute food to
                        people who need it.
                    </p>
                </section>

                {/* Available Donations */}

                <section style={{ marginBottom: "45px" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px",
                            flexWrap: "wrap",
                            gap: "15px"
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    margin: 0,
                                    color: "#344e41",
                                    fontSize: "27px"
                                }}
                            >
                                Available Donations 🍱
                            </h2>

                            <p
                                style={{
                                    marginTop: "6px",
                                    color: "#777"
                                }}
                            >
                                Food donations waiting to be
                                collected.
                            </p>
                        </div>

                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                padding: "10px 18px",
                                borderRadius: "10px",
                                color: "#198754",
                                fontWeight: "bold",
                                boxShadow:
                                    "0 3px 10px rgba(0,0,0,0.06)"
                            }}
                        >
                            {filteredDonations.length} Available
                        </div>
                    </div>

                    {/* Search */}

                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            padding: "18px",
                            borderRadius: "14px",
                            marginBottom: "25px",
                            display: "flex",
                            gap: "15px",
                            flexWrap: "wrap",
                            boxShadow:
                                "0 4px 12px rgba(0,0,0,0.05)"
                        }}
                    >
                        <input
                            type="text"
                            placeholder="🔎 Search food or pickup address..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            style={{
                                flex: 1,
                                minWidth: "250px",
                                padding: "13px 15px",
                                border:
                                    "1px solid #dfe7e1",
                                borderRadius: "9px",
                                fontSize: "14px",
                                outline: "none",
                                boxSizing: "border-box"
                            }}
                        />

                        <select
                            value={filter}
                            onChange={(e) =>
                                setFilter(e.target.value)
                            }
                            style={{
                                padding: "13px 18px",
                                border:
                                    "1px solid #dfe7e1",
                                borderRadius: "9px",
                                fontSize: "14px",
                                backgroundColor:
                                    "#ffffff",
                                cursor: "pointer"
                            }}
                        >
                            <option value="all">
                                All Donations
                            </option>

                            <option value="available">
                                Available
                            </option>
                        </select>
                    </div>

                    {/* Donations */}

                    {loading ? (
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                padding: "40px",
                                borderRadius: "15px",
                                textAlign: "center"
                            }}
                        >
                            Loading donations...
                        </div>
                    ) : filteredDonations.length === 0 ? (
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                padding: "55px 20px",
                                borderRadius: "18px",
                                textAlign: "center",
                                boxShadow:
                                    "0 5px 18px rgba(0,0,0,0.06)"
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "55px",
                                    marginBottom: "15px"
                                }}
                            >
                                🔎
                            </div>

                            <h3
                                style={{
                                    margin: "0 0 10px",
                                    color: "#344e41"
                                }}
                            >
                                No matching donations
                            </h3>

                            <p
                                style={{
                                    color: "#888",
                                    margin: 0
                                }}
                            >
                                Try another food name or
                                pickup address.
                            </p>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: "24px"
                            }}
                        >
                            {filteredDonations.map(
                                (donation) => {
                                    const freshness =
                                        getFreshness(
                                            donation.bestBefore
                                        );

                                    return (
                                        <div
                                            key={
                                                donation._id
                                            }
                                            style={{
                                                backgroundColor:
                                                    "#ffffff",
                                                borderRadius:
                                                    "16px",
                                                padding:
                                                    "25px",
                                                boxShadow:
                                                    "0 6px 18px rgba(0,0,0,0.07)"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems:
                                                        "flex-start",
                                                    gap: "10px"
                                                }}
                                            >
                                                <h3
                                                    style={{
                                                        margin:
                                                            "0 0 18px",
                                                        color:
                                                            "#344e41",
                                                        fontSize:
                                                            "21px"
                                                    }}
                                                >
                                                    🍲{" "}
                                                    {
                                                        donation.foodType
                                                    }
                                                </h3>

                                                <span
                                                    style={{
                                                        ...statusStyle(
                                                            donation.status
                                                        ),
                                                        padding:
                                                            "6px 10px",
                                                        borderRadius:
                                                            "20px",
                                                        fontSize:
                                                            "12px",
                                                        fontWeight:
                                                            "bold",
                                                        textTransform:
                                                            "capitalize"
                                                    }}
                                                >
                                                    {
                                                        donation.status
                                                    }
                                                </span>
                                            </div>

                                            <div
                                                style={{
                                                    padding:
                                                        "15px",
                                                    backgroundColor:
                                                        "#f8faf8",
                                                    borderRadius:
                                                        "10px",
                                                    marginBottom:
                                                        "15px"
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        margin:
                                                            "0 0 10px",
                                                        color:
                                                            "#555"
                                                    }}
                                                >
                                                    📦{" "}
                                                    <strong>
                                                        Quantity:
                                                    </strong>{" "}
                                                    {
                                                        donation.quantity
                                                    }{" "}
                                                    {
                                                        donation.unit
                                                    }
                                                </p>

                                                <p
                                                    style={{
                                                        margin:
                                                            "0 0 10px",
                                                        color:
                                                            "#555",
                                                        lineHeight:
                                                            "1.5"
                                                    }}
                                                >
                                                    📍{" "}
                                                    <strong>
                                                        Pickup:
                                                    </strong>{" "}
                                                    {
                                                        donation.pickupAddress
                                                    }
                                                </p>

                                                <p
                                                    style={{
                                                        margin: 0,
                                                        color:
                                                            "#555",
                                                        lineHeight:
                                                            "1.5"
                                                    }}
                                                >
                                                    ⏰{" "}
                                                    <strong>
                                                        Best
                                                        Before:
                                                    </strong>{" "}
                                                    {donation.bestBefore
                                                        ? new Date(
                                                              donation.bestBefore
                                                          ).toLocaleString()
                                                        : "Not specified"}
                                                </p>
                                            </div>

                                            {/* Freshness */}

                                            <div
                                                style={{
                                                    padding:
                                                        "9px 12px",
                                                    borderRadius:
                                                        "8px",
                                                    backgroundColor:
                                                        freshness.backgroundColor,
                                                    color:
                                                        freshness.color,
                                                    fontSize:
                                                        "13px",
                                                    fontWeight:
                                                        "bold",
                                                    marginBottom:
                                                        "15px"
                                                }}
                                            >
                                                {freshness.text}
                                            </div>

                                            <button
                                                onClick={() =>
                                                    claimDonation(
                                                        donation._id
                                                    )
                                                }
                                                style={{
                                                    width: "100%",
                                                    padding:
                                                        "13px",
                                                    border: "none",
                                                    borderRadius:
                                                        "9px",
                                                    backgroundColor:
                                                        "#198754",
                                                    color:
                                                        "#ffffff",
                                                    fontWeight:
                                                        "bold",
                                                    fontSize:
                                                        "14px",
                                                    cursor:
                                                        "pointer"
                                                }}
                                            >
                                                Claim Donation
                                            </button>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </section>

                {/* Claimed Donations */}

                <section>
                    <div
                        style={{
                            marginBottom: "20px"
                        }}
                    >
                        <h2
                            style={{
                                margin: 0,
                                color: "#344e41",
                                fontSize: "27px"
                            }}
                        >
                            My Claimed Donations 📦
                        </h2>

                        <p
                            style={{
                                marginTop: "6px",
                                color: "#777"
                            }}
                        >
                            Manage the donations you have
                            claimed.
                        </p>
                    </div>

                    {claimedLoading ? (
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                padding: "40px",
                                borderRadius: "15px",
                                textAlign: "center"
                            }}
                        >
                            Loading claimed donations...
                        </div>
                    ) : claimedDonations.length === 0 ? (
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                padding: "45px",
                                borderRadius: "18px",
                                textAlign: "center"
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "45px"
                                }}
                            >
                                📦
                            </div>

                            <p
                                style={{
                                    color: "#777"
                                }}
                            >
                                You haven't claimed any
                                donations yet.
                            </p>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(320px, 1fr))",
                                gap: "22px"
                            }}
                        >
                            {claimedDonations.map(
                                (donation) => (
                                    <div
                                        key={
                                            donation._id
                                        }
                                        style={{
                                            backgroundColor:
                                                "#ffffff",
                                            borderRadius:
                                                "16px",
                                            padding: "25px",
                                            boxShadow:
                                                "0 6px 18px rgba(0,0,0,0.07)"
                                        }}
                                    >
                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "flex-start",
                                                gap: "10px"
                                            }}
                                        >
                                            <h3
                                                style={{
                                                    margin:
                                                        "0 0 18px",
                                                    color:
                                                        "#344e41",
                                                    fontSize:
                                                        "21px"
                                                }}
                                            >
                                                🍲{" "}
                                                {
                                                    donation.foodType
                                                }
                                            </h3>

                                            <span
                                                style={{
                                                    ...statusStyle(
                                                        donation.status
                                                    ),
                                                    padding:
                                                        "6px 10px",
                                                    borderRadius:
                                                        "20px",
                                                    fontSize:
                                                        "12px",
                                                    fontWeight:
                                                        "bold",
                                                    textTransform:
                                                        "capitalize"
                                                }}
                                            >
                                                {
                                                    donation.status
                                                }
                                            </span>
                                        </div>

                                        <div
                                            style={{
                                                padding:
                                                    "15px",
                                                backgroundColor:
                                                    "#f8faf8",
                                                borderRadius:
                                                    "10px",
                                                marginBottom:
                                                    "15px"
                                            }}
                                        >
                                            <p
                                                style={{
                                                    margin:
                                                        "0 0 10px",
                                                    color:
                                                        "#555"
                                                }}
                                            >
                                                📦{" "}
                                                <strong>
                                                    Quantity:
                                                </strong>{" "}
                                                {
                                                    donation.quantity
                                                }{" "}
                                                {
                                                    donation.unit
                                                }
                                            </p>

                                            <p
                                                style={{
                                                    margin: 0,
                                                    color:
                                                        "#555"
                                                }}
                                            >
                                                📍{" "}
                                                <strong>
                                                    Pickup:
                                                </strong>{" "}
                                                {
                                                    donation.pickupAddress
                                                }
                                            </p>
                                        </div>

                                        <p
                                            style={{
                                                color:
                                                    "#555"
                                            }}
                                        >
                                            OTP Verified:{" "}
                                            <strong>
                                                {donation.otpVerified
                                                    ? "Yes ✓"
                                                    : "No"}
                                            </strong>
                                        </p>

                                        {donation.status ===
                                            "claimed" &&
                                            !donation.otpVerified && (
                                                <div
                                                    style={{
                                                        marginTop:
                                                            "18px",
                                                        padding:
                                                            "18px",
                                                        backgroundColor:
                                                            "#fffaf0",
                                                        borderRadius:
                                                            "10px"
                                                    }}
                                                >
                                                    <button
                                                        onClick={() =>
                                                            generateOTP(
                                                                donation._id
                                                            )
                                                        }
                                                        style={{
                                                            width:
                                                                "100%",
                                                            padding:
                                                                "11px",
                                                            border:
                                                                "none",
                                                            borderRadius:
                                                                "8px",
                                                            backgroundColor:
                                                                "#198754",
                                                            color:
                                                                "#fff",
                                                            fontWeight:
                                                                "bold",
                                                            cursor:
                                                                "pointer"
                                                        }}
                                                    >
                                                        Generate
                                                        OTP
                                                    </button>

                                                    <input
                                                        type="text"
                                                        maxLength="6"
                                                        placeholder="Enter 6-digit OTP"
                                                        value={
                                                            otpInputs[
                                                                donation
                                                                    ._id
                                                            ] ||
                                                            ""
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setOtpInputs(
                                                                (
                                                                    prev
                                                                ) => ({
                                                                    ...prev,
                                                                    [donation._id]:
                                                                        e
                                                                            .target
                                                                            .value
                                                                })
                                                            )
                                                        }
                                                        style={{
                                                            width:
                                                                "100%",
                                                            padding:
                                                                "11px",
                                                            marginTop:
                                                                "12px",
                                                            border:
                                                                "1px solid #ddd",
                                                            borderRadius:
                                                                "8px",
                                                            boxSizing:
                                                                "border-box"
                                                        }}
                                                    />

                                                    <button
                                                        onClick={() =>
                                                            verifyOTP(
                                                                donation._id
                                                            )
                                                        }
                                                        style={{
                                                            width:
                                                                "100%",
                                                            padding:
                                                                "11px",
                                                            marginTop:
                                                                "10px",
                                                            border:
                                                                "none",
                                                            borderRadius:
                                                                "8px",
                                                            backgroundColor:
                                                                "#1565c0",
                                                            color:
                                                                "#fff",
                                                            fontWeight:
                                                                "bold",
                                                            cursor:
                                                                "pointer"
                                                        }}
                                                    >
                                                        Verify
                                                        OTP
                                                    </button>
                                                </div>
                                            )}

                                        {donation.status ===
                                            "picked" && (
                                            <button
                                                onClick={() =>
                                                    markAsDistributed(
                                                        donation._id
                                                    )
                                                }
                                                style={{
                                                    width:
                                                        "100%",
                                                    marginTop:
                                                        "18px",
                                                    padding:
                                                        "13px",
                                                    border:
                                                        "none",
                                                    borderRadius:
                                                        "9px",
                                                    backgroundColor:
                                                        "#7b1fa2",
                                                    color:
                                                        "#ffffff",
                                                    fontWeight:
                                                        "bold",
                                                    cursor:
                                                        "pointer"
                                                }}
                                            >
                                                ✓ Mark as
                                                Distributed
                                            </button>
                                        )}

                                        {donation.status ===
                                            "distributed" && (
                                            <div
                                                style={{
                                                    marginTop:
                                                        "18px",
                                                    padding:
                                                        "12px",
                                                    backgroundColor:
                                                        "#f3e5f5",
                                                    color:
                                                        "#7b1fa2",
                                                    borderRadius:
                                                        "9px",
                                                    textAlign:
                                                        "center",
                                                    fontWeight:
                                                        "bold"
                                                }}
                                            >
                                                ✓ Successfully
                                                Distributed
                                            </div>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </section>
            </main>

            <footer
                style={{
                    width: "100%",
                    textAlign: "center",
                    padding: "25px",
                    color: "#777",
                    fontSize: "13px"
                }}
            >
                Thank you for helping reduce food waste 🌱❤️
            </footer>
        </div>
    );
}

export default VolunteerDashboard;