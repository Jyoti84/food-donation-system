import { useEffect, useState } from "react";
import CreateDonation from "./CreateDonation";

const API_URL = `${import.meta.env.VITE_API_URL}/api/donations/my-donations`;

function DonorDashboard({ onLogout }) {
    const [showCreateDonation, setShowCreateDonation] = useState(false);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyDonations = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

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

    useEffect(() => {
        fetchMyDonations();
    }, []);

    const handleDonationCreated = () => {
        setShowCreateDonation(false);
        fetchMyDonations();
    };

    // Statistics
    const totalDonations = donations.length;

    const availableDonations = donations.filter(
        (donation) => donation.status === "available"
    ).length;

    const claimedDonations = donations.filter(
        (donation) => donation.status === "claimed"
    ).length;

    const distributedDonations = donations.filter(
        (donation) => donation.status === "distributed"
    ).length;

    const getStatusStyle = (status) => {
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

    const getStatusMessage = (status) => {
        if (status === "available") {
            return "Waiting for a volunteer to claim this donation.";
        }

        if (status === "claimed") {
            return "A volunteer has claimed this donation.";
        }

        if (status === "picked") {
            return "The food has been picked up.";
        }

        if (status === "distributed") {
            return "The food has been successfully distributed.";
        }

        return "";
    };

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
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                    padding: "18px 4%",
                    boxSizing: "border-box",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
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
                        Share food. Spread kindness.
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
                        cursor: "pointer",
                        fontSize: "14px"
                    }}
                >
                    Logout
                </button>
            </header>

            {/* Main Content */}
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
                        marginBottom: "30px",
                        boxShadow:
                            "0 6px 20px rgba(52,78,65,0.08)",
                        boxSizing: "border-box"
                    }}
                >
                    <h1
                        style={{
                            margin: "0 0 10px",
                            color: "#344e41",
                            fontSize: "34px"
                        }}
                    >
                        Welcome, Donor! 👋
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#777",
                            fontSize: "16px"
                        }}
                    >
                        Your contribution can help put food on
                        someone's table.
                    </p>

                    <button
                        onClick={() =>
                            setShowCreateDonation(
                                !showCreateDonation
                            )
                        }
                        style={{
                            marginTop: "24px",
                            padding: "13px 24px",
                            border: "none",
                            borderRadius: "9px",
                            backgroundColor: "#198754",
                            color: "#ffffff",
                            fontSize: "15px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        {showCreateDonation
                            ? "✕ Close Form"
                            : "🍱 Create Donation"}
                    </button>
                </section>

                {/* Statistics */}
                <section
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(4, minmax(0, 1fr))",
                        gap: "20px",
                        marginBottom: "35px"
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "16px",
                            padding: "25px",
                            boxShadow:
                                "0 5px 18px rgba(0,0,0,0.06)",
                            borderLeft: "5px solid #198754"
                        }}
                    >
                        <div style={{ fontSize: "30px" }}>🍱</div>

                        <p
                            style={{
                                margin: "12px 0 5px",
                                color: "#777",
                                fontSize: "14px"
                            }}
                        >
                            Total Donations
                        </p>

                        <h2
                            style={{
                                margin: 0,
                                color: "#344e41",
                                fontSize: "30px"
                            }}
                        >
                            {totalDonations}
                        </h2>
                    </div>

                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "16px",
                            padding: "25px",
                            boxShadow:
                                "0 5px 18px rgba(0,0,0,0.06)",
                            borderLeft: "5px solid #20c997"
                        }}
                    >
                        <div style={{ fontSize: "30px" }}>🟢</div>

                        <p
                            style={{
                                margin: "12px 0 5px",
                                color: "#777",
                                fontSize: "14px"
                            }}
                        >
                            Available
                        </p>

                        <h2
                            style={{
                                margin: 0,
                                color: "#198754",
                                fontSize: "30px"
                            }}
                        >
                            {availableDonations}
                        </h2>
                    </div>

                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "16px",
                            padding: "25px",
                            boxShadow:
                                "0 5px 18px rgba(0,0,0,0.06)",
                            borderLeft: "5px solid #ffc107"
                        }}
                    >
                        <div style={{ fontSize: "30px" }}>🟡</div>

                        <p
                            style={{
                                margin: "12px 0 5px",
                                color: "#777",
                                fontSize: "14px"
                            }}
                        >
                            Claimed
                        </p>

                        <h2
                            style={{
                                margin: 0,
                                color: "#856404",
                                fontSize: "30px"
                            }}
                        >
                            {claimedDonations}
                        </h2>
                    </div>

                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "16px",
                            padding: "25px",
                            boxShadow:
                                "0 5px 18px rgba(0,0,0,0.06)",
                            borderLeft: "5px solid #7b1fa2"
                        }}
                    >
                        <div style={{ fontSize: "30px" }}>❤️</div>

                        <p
                            style={{
                                margin: "12px 0 5px",
                                color: "#777",
                                fontSize: "14px"
                            }}
                        >
                            Distributed
                        </p>

                        <h2
                            style={{
                                margin: 0,
                                color: "#7b1fa2",
                                fontSize: "30px"
                            }}
                        >
                            {distributedDonations}
                        </h2>
                    </div>
                </section>

                {/* Create Donation */}
                {showCreateDonation && (
                    <CreateDonation
                        onDonationCreated={handleDonationCreated}
                    />
                )}

                {/* Donations */}
                <section>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px"
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    margin: 0,
                                    color: "#344e41",
                                    fontSize: "26px"
                                }}
                            >
                                My Donations
                            </h2>

                            <p
                                style={{
                                    marginTop: "6px",
                                    color: "#777"
                                }}
                            >
                                Track the food you have shared.
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
                            {donations.length} Donation
                            {donations.length !== 1 ? "s" : ""}
                        </div>
                    </div>

                    {loading ? (
                        <div
                            style={{
                                width: "100%",
                                backgroundColor: "#ffffff",
                                padding: "40px",
                                borderRadius: "15px",
                                textAlign: "center",
                                boxSizing: "border-box"
                            }}
                        >
                            <p style={{ color: "#777" }}>
                                Loading your donations...
                            </p>
                        </div>
                    ) : donations.length === 0 ? (
                        <div
                            style={{
                                width: "100%",
                                backgroundColor: "#ffffff",
                                padding: "60px 20px",
                                borderRadius: "18px",
                                textAlign: "center",
                                boxShadow:
                                    "0 5px 18px rgba(0,0,0,0.06)",
                                boxSizing: "border-box"
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "55px",
                                    marginBottom: "15px"
                                }}
                            >
                                🍱
                            </div>

                            <h3
                                style={{
                                    margin: "0 0 10px",
                                    color: "#344e41",
                                    fontSize: "22px"
                                }}
                            >
                                No donations yet
                            </h3>

                            <p
                                style={{
                                    color: "#888",
                                    marginBottom: "22px"
                                }}
                            >
                                Start by sharing some food with
                                someone in need.
                            </p>

                            <button
                                onClick={() =>
                                    setShowCreateDonation(true)
                                }
                                style={{
                                    padding: "12px 22px",
                                    border: "none",
                                    borderRadius: "8px",
                                    backgroundColor: "#198754",
                                    color: "#ffffff",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                            >
                                Create Your First Donation
                            </button>
                        </div>
                    ) : (
                        <div
                            style={{
                                width: "100%",
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: "22px"
                            }}
                        >
                            {donations.map((donation) => (
                                <div
                                    key={donation._id}
                                    style={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: "16px",
                                        padding: "25px",
                                        boxShadow:
                                            "0 6px 18px rgba(0,0,0,0.07)",
                                        border:
                                            "1px solid #edf2ee"
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems: "flex-start",
                                            gap: "10px",
                                            marginBottom: "18px"
                                        }}
                                    >
                                        <h3
                                            style={{
                                                margin: 0,
                                                color: "#344e41",
                                                fontSize: "21px"
                                            }}
                                        >
                                            🍲 {donation.foodType}
                                        </h3>

                                        <span
                                            style={{
                                                ...getStatusStyle(
                                                    donation.status
                                                ),
                                                padding:
                                                    "6px 10px",
                                                borderRadius:
                                                    "20px",
                                                fontSize: "12px",
                                                fontWeight:
                                                    "bold",
                                                textTransform:
                                                    "capitalize",
                                                whiteSpace:
                                                    "nowrap"
                                            }}
                                        >
                                            {donation.status}
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            padding: "15px",
                                            backgroundColor:
                                                "#f8faf8",
                                            borderRadius: "10px",
                                            marginBottom: "15px"
                                        }}
                                    >
                                        <p
                                            style={{
                                                margin:
                                                    "0 0 10px",
                                                color: "#555"
                                            }}
                                        >
                                            📦{" "}
                                            <strong>
                                                Quantity:
                                            </strong>{" "}
                                            {donation.quantity}{" "}
                                            {donation.unit}
                                        </p>

                                        <p
                                            style={{
                                                margin: 0,
                                                color: "#555",
                                                lineHeight: "1.5"
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
                                            margin: 0,
                                            padding: "12px",
                                            backgroundColor:
                                                getStatusStyle(
                                                    donation.status
                                                ).backgroundColor,
                                            color: getStatusStyle(
                                                donation.status
                                            ).color,
                                            borderRadius: "9px",
                                            fontSize: "13px",
                                            lineHeight: "1.5"
                                        }}
                                    >
                                        {getStatusMessage(
                                            donation.status
                                        )}
                                    </p>
                                </div>
                            ))}
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
                    fontSize: "13px",
                    boxSizing: "border-box"
                }}
            >
                Together, we can reduce food waste 🌱❤️
            </footer>
        </div>
    );
}

export default DonorDashboard;