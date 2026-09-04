import { useEffect, useRef, useState } from "react";
import CreateDonation from "./CreateDonation";
import "./DonorDashboard.css";

const API_URL = `${import.meta.env.VITE_API_URL}/api/donations`;

function DonorDashboard({ onLogout }) {
    const [showCreateDonation, setShowCreateDonation] = useState(false);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generatedOtps, setGeneratedOtps] = useState({});

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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Navbar dropdown states
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    // Tracks whether the current notifications have been viewed
    const [notificationsSeen, setNotificationsSeen] = useState(false);

    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    const fetchMyDonations = async () => {
        try {
            setLoading(true);

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

            setDonations(data.donations || []);
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

    // Close navbar dropdowns when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setNotificationOpen(false);
            }

            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    const handleDonationCreated = () => {
        setShowCreateDonation(false);
        fetchMyDonations();
    };

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
        } catch (error) {
            console.error("Generate OTP error:", error);
            alert("Server error");
        }
    };

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

    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

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
            formData.append("pickupAddress", editForm.pickupAddress);

            if (editProofImage) {
                formData.append("donorProofImage", editProofImage);
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

            cancelEditing();
            fetchMyDonations();
        } catch (error) {
            console.error("Update donation error:", error);
            alert("Server error");
        } finally {
            setUpdating(false);
        }
    };

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

    const scrollToSection = (id) => {
        const element = document.getElementById(id);

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        setSidebarOpen(false);
        setNotificationOpen(false);
        setProfileOpen(false);
    };

    const openCreateDonation = () => {
        setShowCreateDonation(true);
        setSidebarOpen(false);
        setNotificationOpen(false);
        setProfileOpen(false);

        setTimeout(() => {
            const element = document.getElementById(
                "create-donation"
            );

            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }, 100);
    };

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

    // Notifications based on current donor activity
    const notifications = [];

    if (availableDonations > 0) {
        notifications.push({
            id: "available",
            icon: "🍱",
            title: "Donations available",
            message: `${availableDonations} donation${
                availableDonations > 1 ? "s are" : " is"
            } currently waiting for a volunteer.`
        });
    }

    if (claimedDonations > 0) {
        notifications.push({
            id: "claimed",
            icon: "🤝",
            title: "Donation claimed",
            message: `${claimedDonations} donation${
                claimedDonations > 1 ? "s have" : " has"
            } been claimed by a volunteer.`
        });
    }

    if (distributedDonations > 0) {
        notifications.push({
            id: "distributed",
            icon: "❤️",
            title: "Food distributed",
            message: `${distributedDonations} donation${
                distributedDonations > 1 ? "s have" : " has"
            } been successfully distributed.`
        });
    }

    /*
        Reset notification status whenever the actual
        notification counts change.

        This means if a new claimed/distributed/available
        notification appears, the red dot comes back.
    */
    useEffect(() => {
        if (notifications.length > 0) {
            setNotificationsSeen(false);
        }
    }, [
        availableDonations,
        claimedDonations,
        distributedDonations
    ]);

    return (
        <div className="donor-dashboard">

            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`donor-sidebar ${
                    sidebarOpen ? "sidebar-open" : ""
                }`}
            >
                <div className="sidebar-brand">
                    <div className="brand-icon">🍲</div>

                    <div>
                        <h2>FoodShare</h2>
                        <span>Donor Portal</span>
                    </div>
                </div>

                <div className="sidebar-section">
                    <p className="sidebar-heading">MAIN</p>

                    <button
                        className="sidebar-link active"
                        onClick={() =>
                            scrollToSection("dashboard-top")
                        }
                    >
                        <span>▣</span>
                        Dashboard
                    </button>

                    <button
                        className="sidebar-link"
                        onClick={() =>
                            scrollToSection("my-donations")
                        }
                    >
                        <span>🍱</span>
                        My Donations
                    </button>

                    <button
                        className="sidebar-link"
                        onClick={openCreateDonation}
                    >
                        <span>＋</span>
                        Create Donation
                    </button>
                </div>

                <div className="sidebar-section">
                    <p className="sidebar-heading">ACTIVITY</p>

                    <button
                        className="sidebar-link"
                        onClick={() =>
                            scrollToSection("my-donations")
                        }
                    >
                        <span>📜</span>
                        Donation Activity
                    </button>

                    <button
                        className="sidebar-link"
                        onClick={() =>
                            scrollToSection("impact-section")
                        }
                    >
                        <span>❤️</span>
                        My Impact
                    </button>
                </div>

                <div className="sidebar-bottom">
                    <button
                        className="sidebar-link logout-link"
                        onClick={onLogout}
                    >
                        <span>↪</span>
                        Logout
                    </button>
                </div>
            </aside>

            <div className="donor-main">

                <header className="dashboard-navbar">

                    <div className="navbar-left">

                        <button
                            className="mobile-menu-button"
                            onClick={() =>
                                setSidebarOpen(!sidebarOpen)
                            }
                        >
                            ☰
                        </button>

                        <div>
                            <p className="breadcrumb">
                                Donor Portal <span>/</span> Dashboard
                            </p>

                            <h1>Dashboard</h1>
                        </div>

                    </div>

                    <div className="navbar-right">

                        {/* Notification */}
                        <div
                            className="notification-wrapper"
                            ref={notificationRef}
                        >

                            <button
                                className="notification-button"
                                onClick={() => {
                                    setNotificationOpen((prev) => {
                                        const nextState = !prev;

                                        /*
                                            When opening notifications,
                                            mark them as seen.
                                        */
                                        if (nextState) {
                                            setNotificationsSeen(true);
                                        }

                                        return nextState;
                                    });

                                    setProfileOpen(false);
                                }}
                                aria-label="Notifications"
                            >
                                🔔

                                {notifications.length > 0 &&
                                    !notificationsSeen && (
                                        <span className="notification-dot" />
                                    )}
                            </button>

                            {notificationOpen && (
                                <div className="notification-dropdown">

                                    <div className="dropdown-header">

                                        <div>
                                            <h3>Notifications</h3>

                                            <span>
                                                Recent activity
                                            </span>
                                        </div>

                                        <button
                                            onClick={() =>
                                                setNotificationOpen(
                                                    false
                                                )
                                            }
                                        >
                                            ✕
                                        </button>

                                    </div>

                                    <div className="notification-list">

                                        {notifications.length === 0 ? (
                                            <div className="no-notifications">

                                                <div>🔔</div>

                                                <p>
                                                    No new notifications
                                                </p>

                                                <span>
                                                    You're all caught up!
                                                </span>

                                            </div>
                                        ) : (
                                            notifications.map(
                                                (notification) => (
                                                    <button
                                                        className="notification-item"
                                                        key={
                                                            notification.id
                                                        }
                                                        onClick={() =>
                                                            scrollToSection(
                                                                "my-donations"
                                                            )
                                                        }
                                                    >

                                                        <div className="notification-icon">
                                                            {
                                                                notification.icon
                                                            }
                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {
                                                                    notification.title
                                                                }
                                                            </strong>

                                                            <p>
                                                                {
                                                                    notification.message
                                                                }
                                                            </p>

                                                        </div>

                                                    </button>
                                                )
                                            )
                                        )}

                                    </div>

                                </div>
                            )}

                        </div>

                        {/* Profile */}
                        <div
                            className="profile-wrapper"
                            ref={profileRef}
                        >

                            <button
                                className="user-profile profile-button"
                                onClick={() => {
                                    setProfileOpen(
                                        (prev) => !prev
                                    );

                                    setNotificationOpen(false);
                                }}
                            >

                                <div className="user-avatar">
                                    D
                                </div>

                                <div className="user-info">

                                    <strong>Donor</strong>

                                    <span>
                                        Food Contributor
                                    </span>

                                </div>

                                <span className="profile-arrow">
                                    {profileOpen ? "⌃" : "⌄"}
                                </span>

                            </button>

                            {profileOpen && (
                                <div className="profile-dropdown">

                                    <div className="profile-dropdown-info">

                                        <div className="profile-dropdown-avatar">
                                            D
                                        </div>

                                        <div>

                                            <strong>Donor</strong>

                                            <span>
                                                Food Contributor
                                            </span>

                                        </div>

                                    </div>

                                    <div className="dropdown-divider" />

                                    <button
                                        className="profile-menu-item"
                                        onClick={() =>
                                            scrollToSection(
                                                "dashboard-top"
                                            )
                                        }
                                    >
                                        <span>▣</span>
                                        Dashboard
                                    </button>

                                    <button
                                        className="profile-menu-item"
                                        onClick={() =>
                                            scrollToSection(
                                                "my-donations"
                                            )
                                        }
                                    >
                                        <span>🍱</span>
                                        My Donations
                                    </button>

                                    <button
                                        className="profile-menu-item"
                                        onClick={
                                            openCreateDonation
                                        }
                                    >
                                        <span>＋</span>
                                        Create Donation
                                    </button>

                                    <div className="dropdown-divider" />

                                    <button
                                        className="profile-menu-item logout-menu-item"
                                        onClick={onLogout}
                                    >
                                        <span>↪</span>
                                        Logout
                                    </button>

                                </div>
                            )}

                        </div>

                    </div>

                </header>

                <main className="dashboard-content">

                    <section
                        id="dashboard-top"
                        className="welcome-section"
                    >

                        <div className="welcome-content">

                            <span className="welcome-badge">
                                🌱 Making a difference
                            </span>

                            <h2>
                                Welcome back, Donor! 👋
                            </h2>

                            <p>
                                Your contribution can help put food
                                on someone's table and reduce food
                                waste.
                            </p>

                            <button
                                className="primary-action"
                                onClick={openCreateDonation}
                            >
                                <span>＋</span>
                                Donate Food
                            </button>

                        </div>

                        <div className="welcome-illustration">
                            <div className="illustration-circle">
                                🍱
                            </div>
                        </div>

                    </section>

                    <section className="stats-grid">

                        <div className="stat-card">

                            <div className="stat-icon total-icon">
                                🍱
                            </div>

                            <div>
                                <p>Total Donations</p>
                                <h3>{totalDonations}</h3>
                            </div>

                            <span className="stat-arrow">↗</span>

                        </div>

                        <div className="stat-card">

                            <div className="stat-icon available-icon">
                                ✓
                            </div>

                            <div>
                                <p>Available</p>
                                <h3>{availableDonations}</h3>
                            </div>

                            <span className="stat-arrow">↗</span>

                        </div>

                        <div className="stat-card">

                            <div className="stat-icon claimed-icon">
                                🤝
                            </div>

                            <div>
                                <p>Claimed</p>
                                <h3>{claimedDonations}</h3>
                            </div>

                            <span className="stat-arrow">↗</span>

                        </div>

                        <div className="stat-card">

                            <div className="stat-icon distributed-icon">
                                ❤️
                            </div>

                            <div>
                                <p>Distributed</p>
                                <h3>{distributedDonations}</h3>
                            </div>

                            <span className="stat-arrow">↗</span>

                        </div>

                    </section>

                    {showCreateDonation && (
                        <section
                            id="create-donation"
                            className="dashboard-panel create-panel"
                        >

                            <div className="panel-header">

                                <div>

                                    <span className="panel-label">
                                        DONATION
                                    </span>

                                    <h2>Create a Donation</h2>

                                    <p>
                                        Share surplus food with people
                                        who need it.
                                    </p>

                                </div>

                                <button
                                    className="close-panel-button"
                                    onClick={() =>
                                        setShowCreateDonation(false)
                                    }
                                >
                                    ✕
                                </button>

                            </div>

                            <CreateDonation
                                onDonationCreated={
                                    handleDonationCreated
                                }
                            />

                        </section>
                    )}

                    {editingDonation && (
                        <section className="dashboard-panel edit-panel">

                            <div className="panel-header">

                                <div>

                                    <span className="panel-label">
                                        UPDATE
                                    </span>

                                    <h2>Edit Donation</h2>

                                    <p>
                                        Update the details of your
                                        available donation.
                                    </p>

                                </div>

                                <button
                                    className="close-panel-button"
                                    onClick={cancelEditing}
                                >
                                    ✕
                                </button>

                            </div>

                            <form
                                onSubmit={updateDonation}
                                className="edit-form"
                            >

                                <div className="form-grid">

                                    <div className="form-field">

                                        <label>
                                            Food Type
                                        </label>

                                        <input
                                            type="text"
                                            name="foodType"
                                            value={
                                                editForm.foodType
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Quantity
                                        </label>

                                        <input
                                            type="number"
                                            name="quantity"
                                            value={
                                                editForm.quantity
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            min="1"
                                            required
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Unit
                                        </label>

                                        <select
                                            name="unit"
                                            value={editForm.unit}
                                            onChange={
                                                handleEditChange
                                            }
                                        >

                                            <option value="kg">
                                                kg
                                            </option>

                                            <option value="grams">
                                                grams
                                            </option>

                                            <option value="litres">
                                                litres
                                            </option>

                                            <option value="pieces">
                                                pieces
                                            </option>

                                        </select>

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Best Before
                                        </label>

                                        <input
                                            type="date"
                                            name="bestBefore"
                                            value={
                                                editForm.bestBefore
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />

                                    </div>

                                    <div className="form-field full-width">

                                        <label>
                                            Pickup Address
                                        </label>

                                        <textarea
                                            name="pickupAddress"
                                            value={
                                                editForm.pickupAddress
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            rows="3"
                                            required
                                        />

                                    </div>

                                    <div className="form-field full-width">

                                        <label>
                                            Replace Food Proof Image
                                            <span>
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
                                            <p className="selected-file">
                                                📷{" "}
                                                {
                                                    editProofImage.name
                                                }
                                            </p>
                                        )}

                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="save-button"
                                >
                                    {updating
                                        ? "Updating..."
                                        : "💾 Update Donation"}
                                </button>

                            </form>

                        </section>
                    )}

                    <section
                        id="my-donations"
                        className="donations-section"
                    >

                        <div className="section-heading">

                            <div>

                                <span className="section-label">
                                    YOUR ACTIVITY
                                </span>

                                <h2>My Donations</h2>

                                <p>
                                    Track and manage the food you've
                                    shared.
                                </p>

                            </div>

                            <button
                                className="outline-action"
                                onClick={openCreateDonation}
                            >
                                ＋ New Donation
                            </button>

                        </div>

                        {loading ? (
                            <div className="empty-state">

                                <div className="loading-spinner"></div>

                                <p>
                                    Loading your donations...
                                </p>

                            </div>
                        ) : donations.length === 0 ? (
                            <div className="empty-state">

                                <div className="empty-icon">
                                    🍱
                                </div>

                                <h3>No donations yet</h3>

                                <p>
                                    Create your first donation and
                                    help someone in need.
                                </p>

                                <button
                                    className="primary-action"
                                    onClick={openCreateDonation}
                                >
                                    ＋ Create Donation
                                </button>

                            </div>
                        ) : (
                            <div className="donations-grid">

                                {donations.map((donation) => (
                                    <div
                                        className="donation-card"
                                        key={donation._id}
                                    >

                                        <div className="donation-card-header">

                                            <div className="food-title">

                                                <div className="food-icon">
                                                    🍲
                                                </div>

                                                <div>

                                                    <h3>
                                                        {
                                                            donation.foodType
                                                        }
                                                    </h3>

                                                    <span>
                                                        Donation
                                                    </span>

                                                </div>

                                            </div>

                                            <span
                                                className="status-badge"
                                                style={getStatusStyle(
                                                    donation.status
                                                )}
                                            >
                                                {donation.status}
                                            </span>

                                        </div>

                                        {donation.status ===
                                            "available" && (
                                            <div className="card-actions">

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        startEditing(
                                                            donation
                                                        )
                                                    }
                                                >
                                                    ✏️ Edit
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        deleteDonation(
                                                            donation._id
                                                        )
                                                    }
                                                >
                                                    🗑️ Delete
                                                </button>

                                            </div>
                                        )}

                                        <div className="donation-details">

                                            <div className="detail-item">

                                                <span>📦</span>

                                                <div>

                                                    <small>
                                                        Quantity
                                                    </small>

                                                    <strong>
                                                        {
                                                            donation.quantity
                                                        }{" "}
                                                        {
                                                            donation.unit
                                                        }
                                                    </strong>

                                                </div>

                                            </div>

                                            <div className="detail-item">

                                                <span>📍</span>

                                                <div>

                                                    <small>
                                                        Pickup Location
                                                    </small>

                                                    <strong>
                                                        {
                                                            donation.pickupAddress
                                                        }
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>

                                        {donation.donorProofImage && (
                                            <div className="proof-section">

                                                <h4>
                                                    📷 Food Proof
                                                </h4>

                                                <img
                                                    src={
                                                        donation.donorProofImage
                                                    }
                                                    alt="Donated food proof"
                                                />

                                            </div>
                                        )}

                                        {donation.claimedBy && (
                                            <div className="volunteer-section">

                                                <h4>
                                                    🤝 Volunteer Details
                                                </h4>

                                                <p>
                                                    <strong>
                                                        Name:
                                                    </strong>{" "}
                                                    {
                                                        donation
                                                            .claimedBy
                                                            .name
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Email:
                                                    </strong>{" "}
                                                    {
                                                        donation
                                                            .claimedBy
                                                            .email
                                                    }
                                                </p>

                                            </div>
                                        )}

                                        {donation.status ===
                                            "claimed" && (
                                            <div className="otp-section">

                                                <h4>
                                                    🔐 Pickup OTP
                                                </h4>

                                                {generatedOtps[
                                                    donation._id
                                                ] ? (
                                                    <>
                                                        <div className="otp-code">
                                                            {
                                                                generatedOtps[
                                                                    donation
                                                                        ._id
                                                                ]
                                                            }
                                                        </div>

                                                        <p>
                                                            Share this OTP
                                                            with the
                                                            volunteer for
                                                            pickup
                                                            verification.
                                                        </p>
                                                    </>
                                                ) : (
                                                    <button
                                                        className="generate-otp-button"
                                                        onClick={() =>
                                                            generateOTP(
                                                                donation._id
                                                            )
                                                        }
                                                    >
                                                        🔐 Generate OTP
                                                    </button>
                                                )}

                                            </div>
                                        )}

                                        {donation.status ===
                                            "distributed" &&
                                            donation.volunteerProofImage && (
                                                <div className="distribution-section">

                                                    <h4>
                                                        ✅ Food Distributed
                                                        Successfully
                                                    </h4>

                                                    <p>
                                                        The volunteer has
                                                        uploaded proof
                                                        that your donated
                                                        food was
                                                        distributed.
                                                    </p>

                                                    <h4>
                                                        📷 Distribution
                                                        Proof
                                                    </h4>

                                                    <img
                                                        src={
                                                            donation.volunteerProofImage
                                                        }
                                                        alt="Volunteer distribution proof"
                                                    />

                                                </div>
                                            )}

                                        <div
                                            className="status-message"
                                            style={{
                                                backgroundColor:
                                                    getStatusStyle(
                                                        donation.status
                                                    )
                                                        .backgroundColor,
                                                color:
                                                    getStatusStyle(
                                                        donation.status
                                                    ).color
                                            }}
                                        >
                                            {getStatusMessage(
                                                donation.status
                                            )}
                                        </div>

                                    </div>
                                ))}

                            </div>
                        )}

                    </section>

                    <section
                        id="impact-section"
                        className="impact-section"
                    >

                        <div className="impact-icon">
                            🌱
                        </div>

                        <div>

                            <span>YOUR IMPACT</span>

                            <h2>
                                Every donation makes a difference.
                            </h2>

                            <p>
                                By sharing surplus food, you're helping
                                reduce waste and making sure good food
                                reaches people who need it.
                            </p>

                        </div>

                    </section>

                </main>

                <footer className="dashboard-footer">

                    <p>
                        Together, we can reduce food waste
                        <span> 🌱❤️</span>
                    </p>

                    <span>
                        FoodShare • Donor Portal
                    </span>

                </footer>

            </div>

        </div>
    );
}

export default DonorDashboard;