import { useEffect, useState } from "react";
import CreateDonation from "./CreateDonation";

const API_URL = `${import.meta.env.VITE_API_URL}/api/donations`;

function DonorDashboard({ onLogout }) {
    const [showCreateDonation, setShowCreateDonation] = useState(false);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generatedOtps, setGeneratedOtps] = useState({});

    // Edit states
    const [editingDonation, setEditingDonation] = useState(null);
    const [editForm, setEditForm] = useState({
        foodType: "",
        quantity: "",
        unit: "kg",
        bestBefore: "",
        pickupAddress: ""
    });
    const [editProofImage, setEditProofImage] = useState(null);
    const [updating, setUpdating] = useState(false);

    const fetchMyDonations = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/my-donations`, {
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

    // Generate OTP - DONOR
    const generateOTP = async (donationId) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/${donationId}/otp`,
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

            setGeneratedOtps((prev) => ({
                ...prev,
                [donationId]: data.otp
            }));

            alert("OTP generated successfully");
        } catch (error) {
            console.error("Generate OTP error:", error);
            alert("Server error");
        }
    };

    // Start editing donation
    const startEditing = (donation) => {
        if (donation.status !== "available") {
            alert("Only available donations can be edited.");
            return;
        }

        setEditingDonation(donation);

        setEditForm({
            foodType: donation.foodType || "",
            quantity: donation.quantity || "",
            unit: donation.unit || "kg",
            bestBefore: donation.bestBefore
                ? new Date(donation.bestBefore)
                      .toISOString()
                      .split("T")[0]
                : "",
            pickupAddress: donation.pickupAddress || ""
        });

        setEditProofImage(null);
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingDonation(null);

        setEditForm({
            foodType: "",
            quantity: "",
            unit: "kg",
            bestBefore: "",
            pickupAddress: ""
        });

        setEditProofImage(null);
    };

    // Handle edit input
    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle new proof image
    const handleEditImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setEditProofImage(null);
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB.");
            e.target.value = "";
            return;
        }

        setEditProofImage(file);
    };

    // Update donation
    const updateDonation = async (e) => {
        e.preventDefault();

        if (!editingDonation) {
            return;
        }

        try {
            setUpdating(true);

            const token = localStorage.getItem("token");

            const formData = new FormData();

            formData.append("foodType", editForm.foodType);
            formData.append("quantity", editForm.quantity);
            formData.append("unit", editForm.unit);
            formData.append("bestBefore", editForm.bestBefore);
            formData.append(
                "pickupAddress",
                editForm.pickupAddress
            );

            // New proof image is optional
            if (editProofImage) {
                formData.append(
                    "donorProofImage",
                    editProofImage
                );
            }

            const response = await fetch(
                `${API_URL}/${editingDonation._id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Donation updated successfully!");

            cancelEditing();
            fetchMyDonations();

        } catch (error) {
            console.error("Update donation error:", error);
            alert("Server error");
        } finally {
            setUpdating(false);
        }
    };

    // Delete donation
    const deleteDonation = async (donationId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this donation?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/${donationId}`,
                {
                    method: "DELETE",
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

            alert("Donation deleted successfully!");

            setDonations((prev) =>
                prev.filter(
                    (donation) => donation._id !== donationId
                )
            );

        } catch (error) {
            console.error("Delete donation error:", error);
            alert("Server error");
        }
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
            return "A volunteer has claimed this donation. Generate an OTP and share it with the volunteer.";
        }

        if (status === "picked") {
            return "The food has been picked up successfully.";
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
                        cursor: "pointer"
                    }}
                >
                    Logout
                </button>
            </header>

            <main
                style={{
                    width: "100%",
                    padding: "45px 4%",
                    boxSizing: "border-box"
                }}
            >
                {/* Welcome Section */}
                <section
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "18px",
                        padding: "35px",
                        marginBottom: "30px",
                        boxShadow:
                            "0 6px 20px rgba(52,78,65,0.08)"
                    }}
                >
                    <h1
                        style={{
                            margin: "0 0 10px",
                            color: "#344e41"
                        }}
                    >
                        Welcome, Donor! 👋
                    </h1>

                    <p style={{ color: "#777" }}>
                        Your contribution can help put food on someone's table.
                    </p>

                    <button
                        onClick={() =>
                            setShowCreateDonation(!showCreateDonation)
                        }
                        style={{
                            marginTop: "15px",
                            padding: "13px 24px",
                            border: "none",
                            borderRadius: "9px",
                            backgroundColor: "#198754",
                            color: "#ffffff",
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
                    {[
                        ["🍱", "Total Donations", totalDonations, "#344e41"],
                        ["🟢", "Available", availableDonations, "#198754"],
                        ["🟡", "Claimed", claimedDonations, "#856404"],
                        ["❤️", "Distributed", distributedDonations, "#7b1fa2"]
                    ].map(([icon, title, value, color]) => (
                        <div
                            key={title}
                            style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "16px",
                                padding: "25px",
                                boxShadow:
                                    "0 5px 18px rgba(0,0,0,0.06)"
                            }}
                        >
                            <div style={{ fontSize: "30px" }}>{icon}</div>

                            <p
                                style={{
                                    margin: "12px 0 5px",
                                    color: "#777"
                                }}
                            >
                                {title}
                            </p>

                            <h2
                                style={{
                                    margin: 0,
                                    color
                                }}
                            >
                                {value}
                            </h2>
                        </div>
                    ))}
                </section>

                {/* Create Donation */}
                {showCreateDonation && (
                    <CreateDonation
                        onDonationCreated={handleDonationCreated}
                    />
                )}

                {/* Edit Donation Form */}
                {editingDonation && (
                    <section
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "18px",
                            padding: "30px",
                            marginBottom: "30px",
                            boxShadow:
                                "0 6px 20px rgba(52,78,65,0.08)",
                            border: "1px solid #c8e6c9"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "20px"
                            }}
                        >
                            <h2
                                style={{
                                    margin: 0,
                                    color: "#344e41"
                                }}
                            >
                                ✏️ Edit Donation
                            </h2>

                            <button
                                onClick={cancelEditing}
                                style={{
                                    border: "none",
                                    backgroundColor: "#eeeeee",
                                    color: "#555",
                                    borderRadius: "8px",
                                    padding: "8px 14px",
                                    cursor: "pointer"
                                }}
                            >
                                ✕ Cancel
                            </button>
                        </div>

                        <form onSubmit={updateDonation}>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(250px, 1fr))",
                                    gap: "18px"
                                }}
                            >
                                {/* Food Type */}
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "7px",
                                            fontWeight: "bold",
                                            color: "#344e41"
                                        }}
                                    >
                                        Food Type
                                    </label>

                                    <input
                                        type="text"
                                        name="foodType"
                                        value={editForm.foodType}
                                        onChange={handleEditChange}
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            border:
                                                "1px solid #ccc",
                                            borderRadius: "8px",
                                            boxSizing: "border-box"
                                        }}
                                    />
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "7px",
                                            fontWeight: "bold",
                                            color: "#344e41"
                                        }}
                                    >
                                        Quantity
                                    </label>

                                    <input
                                        type="number"
                                        name="quantity"
                                        value={editForm.quantity}
                                        onChange={handleEditChange}
                                        min="1"
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            border:
                                                "1px solid #ccc",
                                            borderRadius: "8px",
                                            boxSizing: "border-box"
                                        }}
                                    />
                                </div>

                                {/* Unit */}
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "7px",
                                            fontWeight: "bold",
                                            color: "#344e41"
                                        }}
                                    >
                                        Unit
                                    </label>

                                    <select
                                        name="unit"
                                        value={editForm.unit}
                                        onChange={handleEditChange}
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            border:
                                                "1px solid #ccc",
                                            borderRadius: "8px",
                                            boxSizing: "border-box",
                                            backgroundColor: "#ffffff"
                                        }}
                                    >
                                        <option value="kg">kg</option>
                                        <option value="grams">grams</option>
                                        <option value="litres">litres</option>
                                        <option value="pieces">pieces</option>
                                    </select>
                                </div>

                                {/* Best Before */}
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "7px",
                                            fontWeight: "bold",
                                            color: "#344e41"
                                        }}
                                    >
                                        Best Before
                                    </label>

                                    <input
                                        type="date"
                                        name="bestBefore"
                                        value={editForm.bestBefore}
                                        onChange={handleEditChange}
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            border:
                                                "1px solid #ccc",
                                            borderRadius: "8px",
                                            boxSizing: "border-box"
                                        }}
                                    />
                                </div>

                                {/* Pickup Address */}
                                <div
                                    style={{
                                        gridColumn:
                                            "1 / -1"
                                    }}
                                >
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "7px",
                                            fontWeight: "bold",
                                            color: "#344e41"
                                        }}
                                    >
                                        Pickup Address
                                    </label>

                                    <textarea
                                        name="pickupAddress"
                                        value={editForm.pickupAddress}
                                        onChange={handleEditChange}
                                        required
                                        rows="3"
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            border:
                                                "1px solid #ccc",
                                            borderRadius: "8px",
                                            boxSizing: "border-box",
                                            resize: "vertical"
                                        }}
                                    />
                                </div>

                                {/* New Proof Image */}
                                <div
                                    style={{
                                        gridColumn:
                                            "1 / -1"
                                    }}
                                >
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "7px",
                                            fontWeight: "bold",
                                            color: "#344e41"
                                        }}
                                    >
                                        Replace Food Proof Image
                                        <span
                                            style={{
                                                fontWeight: "normal",
                                                color: "#777",
                                                fontSize: "12px"
                                            }}
                                        >
                                            {" "}
                                            (Optional)
                                        </span>
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handleEditImageChange
                                        }
                                    />

                                    {editProofImage && (
                                        <p
                                            style={{
                                                marginTop: "8px",
                                                color: "#198754",
                                                fontSize: "13px"
                                            }}
                                        >
                                            📷{" "}
                                            {editProofImage.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={updating}
                                style={{
                                    marginTop: "22px",
                                    padding: "13px 25px",
                                    border: "none",
                                    borderRadius: "9px",
                                    backgroundColor:
                                        updating
                                            ? "#9bb8a5"
                                            : "#198754",
                                    color: "#ffffff",
                                    fontWeight: "bold",
                                    cursor: updating
                                        ? "not-allowed"
                                        : "pointer"
                                }}
                            >
                                {updating
                                    ? "Updating..."
                                    : "💾 Update Donation"}
                            </button>
                        </form>
                    </section>
                )}

                {/* My Donations */}
                <section>
                    <h2
                        style={{
                            color: "#344e41"
                        }}
                    >
                        My Donations
                    </h2>

                    {loading ? (
                        <p>Loading your donations...</p>
                    ) : donations.length === 0 ? (
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                padding: "50px",
                                borderRadius: "15px",
                                textAlign: "center"
                            }}
                        >
                            <h3>No donations yet 🍱</h3>
                            <p>Create your first donation to help someone.</p>
                        </div>
                    ) : (
                        <div
                            style={{
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
                                            "0 6px 18px rgba(0,0,0,0.07)"
                                    }}
                                >
                                    {/* Food Header */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "18px"
                                        }}
                                    >
                                        <h3
                                            style={{
                                                margin: 0,
                                                color: "#344e41"
                                            }}
                                        >
                                            🍲 {donation.foodType}
                                        </h3>

                                        <span
                                            style={{
                                                ...getStatusStyle(
                                                    donation.status
                                                ),
                                                padding: "6px 10px",
                                                borderRadius: "20px",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                textTransform: "capitalize"
                                            }}
                                        >
                                            {donation.status}
                                        </span>
                                    </div>

                                    {/* Edit/Delete Buttons */}
                                    {donation.status === "available" && (
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "10px",
                                                marginBottom: "15px"
                                            }}
                                        >
                                            <button
                                                onClick={() =>
                                                    startEditing(
                                                        donation
                                                    )
                                                }
                                                style={{
                                                    flex: 1,
                                                    padding: "10px",
                                                    border: "none",
                                                    borderRadius: "8px",
                                                    backgroundColor:
                                                        "#198754",
                                                    color: "#ffffff",
                                                    fontWeight: "bold",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                ✏️ Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteDonation(
                                                        donation._id
                                                    )
                                                }
                                                style={{
                                                    flex: 1,
                                                    padding: "10px",
                                                    border: "none",
                                                    borderRadius: "8px",
                                                    backgroundColor:
                                                        "#dc3545",
                                                    color: "#ffffff",
                                                    fontWeight: "bold",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    )}

                                    {/* Donation Details */}
                                    <div
                                        style={{
                                            padding: "15px",
                                            backgroundColor: "#f8faf8",
                                            borderRadius: "10px",
                                            marginBottom: "15px"
                                        }}
                                    >
                                        <p
                                            style={{
                                                margin: "0 0 10px",
                                                color: "#555"
                                            }}
                                        >
                                            📦 <strong>Quantity:</strong>{" "}
                                            {donation.quantity}{" "}
                                            {donation.unit}
                                        </p>

                                        <p
                                            style={{
                                                margin: 0,
                                                color: "#555"
                                            }}
                                        >
                                            📍 <strong>Pickup:</strong>{" "}
                                            {donation.pickupAddress}
                                        </p>
                                    </div>

                                    {/* Donor Proof Image */}
                                    {donation.donorProofImage && (
                                        <div
                                            style={{
                                                padding: "15px",
                                                backgroundColor: "#f8faf8",
                                                borderRadius: "10px",
                                                marginBottom: "15px"
                                            }}
                                        >
                                            <h4
                                                style={{
                                                    margin: "0 0 10px",
                                                    color: "#344e41"
                                                }}
                                            >
                                                📷 Food Proof
                                            </h4>

                                            <img
                                                src={
                                                    donation.donorProofImage
                                                }
                                                alt="Donated food proof"
                                                style={{
                                                    width: "100%",
                                                    maxHeight: "220px",
                                                    objectFit: "cover",
                                                    borderRadius: "10px",
                                                    display: "block"
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Volunteer Details */}
                                    {donation.claimedBy && (
                                        <div
                                            style={{
                                                padding: "15px",
                                                backgroundColor: "#e8f5e9",
                                                borderRadius: "10px",
                                                marginBottom: "15px",
                                                border:
                                                    "1px solid #c8e6c9"
                                            }}
                                        >
                                            <h4
                                                style={{
                                                    margin: "0 0 10px",
                                                    color: "#198754"
                                                }}
                                            >
                                                🤝 Volunteer Details
                                            </h4>

                                            <p
                                                style={{
                                                    margin: "0 0 7px",
                                                    color: "#555"
                                                }}
                                            >
                                                👤 <strong>Name:</strong>{" "}
                                                {donation.claimedBy.name}
                                            </p>

                                            <p
                                                style={{
                                                    margin: 0,
                                                    color: "#555"
                                                }}
                                            >
                                                📧 <strong>Email:</strong>{" "}
                                                {donation.claimedBy.email}
                                            </p>
                                        </div>
                                    )}

                                    {/* Generate OTP Section */}
                                    {donation.status === "claimed" && (
                                        <div
                                            style={{
                                                padding: "15px",
                                                backgroundColor: "#fff8e1",
                                                borderRadius: "10px",
                                                marginBottom: "15px",
                                                border:
                                                    "1px solid #ffe082",
                                                textAlign: "center"
                                            }}
                                        >
                                            <h4
                                                style={{
                                                    margin: "0 0 12px",
                                                    color: "#856404"
                                                }}
                                            >
                                                🔐 Pickup OTP
                                            </h4>

                                            {generatedOtps[
                                                donation._id
                                            ] ? (
                                                <>
                                                    <div
                                                        style={{
                                                            fontSize: "28px",
                                                            fontWeight:
                                                                "bold",
                                                            letterSpacing:
                                                                "6px",
                                                            color: "#198754",
                                                            marginBottom:
                                                                "10px"
                                                        }}
                                                    >
                                                        {
                                                            generatedOtps[
                                                                donation
                                                                    ._id
                                                            ]
                                                        }
                                                    </div>

                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            color: "#777",
                                                            fontSize:
                                                                "13px"
                                                        }}
                                                    >
                                                        Share this OTP with
                                                        the volunteer for
                                                        pickup verification.
                                                    </p>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        generateOTP(
                                                            donation._id
                                                        )
                                                    }
                                                    style={{
                                                        padding:
                                                            "11px 20px",
                                                        border: "none",
                                                        borderRadius:
                                                            "8px",
                                                        backgroundColor:
                                                            "#f0ad4e",
                                                        color: "#ffffff",
                                                        fontWeight:
                                                            "bold",
                                                        cursor:
                                                            "pointer"
                                                    }}
                                                >
                                                    🔐 Generate OTP
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Volunteer Distribution Proof */}
                                    {donation.status === "distributed" &&
                                        donation.volunteerProofImage && (
                                            <div
                                                style={{
                                                    padding: "18px",
                                                    backgroundColor:
                                                        "#f3e5f5",
                                                    borderRadius:
                                                        "12px",
                                                    marginBottom:
                                                        "15px",
                                                    border:
                                                        "1px solid #ce93d8"
                                                }}
                                            >
                                                <h4
                                                    style={{
                                                        margin:
                                                            "0 0 10px",
                                                        color:
                                                            "#7b1fa2"
                                                    }}
                                                >
                                                    ✅ Food Distributed
                                                    Successfully
                                                </h4>

                                                <p
                                                    style={{
                                                        margin:
                                                            "0 0 12px",
                                                        color: "#555",
                                                        fontSize:
                                                            "13px"
                                                    }}
                                                >
                                                    The volunteer has
                                                    uploaded proof that
                                                    your donated food was
                                                    distributed.
                                                </p>

                                                <h4
                                                    style={{
                                                        margin:
                                                            "0 0 10px",
                                                        color:
                                                            "#7b1fa2"
                                                    }}
                                                >
                                                    📷 Distribution Proof
                                                </h4>

                                                <img
                                                    src={
                                                        donation.volunteerProofImage
                                                    }
                                                    alt="Volunteer distribution proof"
                                                    style={{
                                                        width: "100%",
                                                        maxHeight:
                                                            "250px",
                                                        objectFit:
                                                            "cover",
                                                        borderRadius:
                                                            "10px",
                                                        display: "block"
                                                    }}
                                                />
                                            </div>
                                        )}

                                    {/* Status Message */}
                                    <p
                                        style={{
                                            margin: 0,
                                            padding: "12px",
                                            backgroundColor:
                                                getStatusStyle(
                                                    donation.status
                                                ).backgroundColor,
                                            color:
                                                getStatusStyle(
                                                    donation.status
                                                ).color,
                                            borderRadius: "9px",
                                            fontSize: "13px"
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
                    textAlign: "center",
                    padding: "25px",
                    color: "#777",
                    fontSize: "13px"
                }}
            >
                Together, we can reduce food waste 🌱❤️
            </footer>
        </div>
    );
}

export default DonorDashboard;