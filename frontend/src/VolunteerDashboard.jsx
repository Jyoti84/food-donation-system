import React, {
    useEffect,
    useRef,
    useState,
} from "react";
import "./VolunteerDashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

const READ_NOTIFICATIONS_KEY =
    "foodshare_volunteer_read_notifications";

const VolunteerDashboard = ({ onLogout }) => {
    const [donations, setDonations] = useState([]);
    const [claimedDonations, setClaimedDonations] =
        useState([]);
    const [loading, setLoading] = useState(true);
    const [claimedLoading, setClaimedLoading] =
        useState(true);

    const [otpInputs, setOtpInputs] = useState({});
    const [distributionProofs, setDistributionProofs] =
        useState({});
    const [uploadingProofs, setUploadingProofs] =
        useState({});

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    // ================= TOPBAR STATES =================

    const [notificationOpen, setNotificationOpen] =
        useState(false);
    const [profileOpen, setProfileOpen] =
        useState(false);
    const [profileModalOpen, setProfileModalOpen] =
        useState(false);

    // ================= NOTIFICATION STATE =================

    const [readNotificationIds, setReadNotificationIds] =
        useState(() => {
            try {
                const stored = localStorage.getItem(
                    READ_NOTIFICATIONS_KEY
                );

                return stored
                    ? JSON.parse(stored)
                    : [];
            } catch (error) {
                console.error(
                    "Error reading notifications:",
                    error
                );

                return [];
            }
        });

    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    const token = localStorage.getItem("token");

    // ================= VOLUNTEER PROFILE =================

    const getVolunteerProfile = () => {
        let profile = {
            name: "Volunteer",
            email: "Not available",
            role: "Volunteer",
        };

        try {
            const storedUser =
                localStorage.getItem("user");

            if (storedUser) {
                const user = JSON.parse(storedUser);

                profile = {
                    name: user.name || "Volunteer",
                    email:
                        user.email ||
                        "Not available",
                    role: user.role
                        ? user.role
                              .charAt(0)
                              .toUpperCase() +
                          user.role.slice(1)
                        : "Volunteer",
                };

                return profile;
            }
        } catch (error) {
            console.error(
                "Error reading stored user:",
                error
            );
        }

        // Fallback to JWT payload
        try {
            if (token) {
                const payload = JSON.parse(
                    atob(token.split(".")[1])
                );

                profile = {
                    name:
                        payload.name ||
                        payload.username ||
                        "Volunteer",

                    email:
                        payload.email ||
                        "Not available",

                    role: payload.role
                        ? payload.role
                              .charAt(0)
                              .toUpperCase() +
                          payload.role.slice(1)
                        : "Volunteer",
                };
            }
        } catch (error) {
            console.error(
                "Unable to decode user token:",
                error
            );
        }

        return profile;
    };

    const volunteerProfile =
        getVolunteerProfile();

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
                setDonations(
                    data.donations || []
                );
            } else {
                alert(
                    data.message ||
                        "Failed to fetch donations"
                );
            }
        } catch (error) {
            console.error(
                "Fetch donations error:",
                error
            );

            alert(
                "Something went wrong while fetching donations"
            );
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
                setClaimedDonations(
                    data.donations || []
                );
            } else {
                alert(
                    data.message ||
                        "Failed to fetch claimed donations"
                );
            }
        } catch (error) {
            console.error(
                "My claimed donations error:",
                error
            );
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
                alert(
                    "Donation claimed successfully!"
                );

                fetchDonations();
                fetchClaimedDonations();
            } else {
                alert(
                    data.message ||
                        "Failed to claim donation"
                );
            }
        } catch (error) {
            console.error(
                "Claim donation error:",
                error
            );

            alert(
                "Something went wrong while claiming donation"
            );
        }
    };

    // ================= OTP =================

    const handleOtpChange = (
        donationId,
        value
    ) => {
        setOtpInputs((prev) => ({
            ...prev,
            [donationId]: value,
        }));
    };

    const verifyOTP = async (donationId) => {
        const otp = otpInputs[donationId];

        if (!otp || otp.length !== 6) {
            alert(
                "Please enter a valid 6-digit OTP"
            );
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/donations/${donationId}/verify-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ otp }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert(
                    "OTP verified successfully! Food marked as picked."
                );

                setOtpInputs((prev) => {
                    const updated = {
                        ...prev,
                    };

                    delete updated[donationId];

                    return updated;
                });

                fetchClaimedDonations();
            } else {
                alert(
                    data.message ||
                        "Invalid OTP"
                );
            }
        } catch (error) {
            console.error(
                "Verify OTP error:",
                error
            );

            alert(
                "Something went wrong while verifying OTP"
            );
        }
    };

    // ================= DISTRIBUTION PROOF =================

    const handleDistributionProofChange = (
        donationId,
        file
    ) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert(
                "Please select an image file only"
            );
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert(
                "Image size must be less than 5MB"
            );
            return;
        }

        setDistributionProofs((prev) => ({
            ...prev,
            [donationId]: file,
        }));
    };

    const uploadDistributionProof = async (
        donationId
    ) => {
        const file =
            distributionProofs[donationId];

        if (!file) {
            alert(
                "Please select a distribution proof image first"
            );
            return;
        }

        try {
            setUploadingProofs((prev) => ({
                ...prev,
                [donationId]: true,
            }));

            const formData = new FormData();

            formData.append(
                "volunteerProofImage",
                file
            );

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
                    const updated = {
                        ...prev,
                    };

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

    const markAsDistributed = async (
        donationId
    ) => {
        const donation =
            claimedDonations.find(
                (item) =>
                    item._id === donationId
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
            console.error(
                "Distribution error:",
                error
            );

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

    // ================= CLOSE DROPDOWNS ON OUTSIDE CLICK =================

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(
                    event.target
                )
            ) {
                setNotificationOpen(false);
            }

            if (
                profileRef.current &&
                !profileRef.current.contains(
                    event.target
                )
            ) {
                setProfileOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    // ================= SEARCH + FILTER =================

    const filteredDonations =
        donations.filter((donation) => {
            const searchValue =
                search.toLowerCase();

            const matchesSearch =
                donation.foodType
                    ?.toLowerCase()
                    .includes(searchValue) ||
                donation.pickupAddress
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesFilter =
                filter === "all" ||
                donation.unit === filter;

            return (
                matchesSearch &&
                matchesFilter
            );
        });

    // ================= COUNTS =================

    const availableCount =
        donations.length;

    const claimedCount =
        claimedDonations.filter(
            (donation) =>
                donation.status === "claimed"
        ).length;

    const pickedCount =
        claimedDonations.filter(
            (donation) =>
                donation.status === "picked"
        ).length;

    const distributedCount =
        claimedDonations.filter(
            (donation) =>
                donation.status === "distributed"
        ).length;

    // ================= NOTIFICATIONS =================

    const notifications = [];

    if (availableCount > 0) {
        notifications.push({
            id: "available",
            icon: "🍱",
            title: "New donations available",
            message: `${availableCount} food donation${
                availableCount > 1
                    ? "s are"
                    : " is"
            } currently available for pickup.`,
            type: "available",
        });
    }

    if (claimedCount > 0) {
        notifications.push({
            id: "claimed",
            icon: "📦",
            title: "Pickup pending",
            message: `You have ${claimedCount} claimed donation${
                claimedCount > 1
                    ? "s"
                    : ""
            } waiting for pickup verification.`,
            type: "claimed",
        });
    }

    const pendingOtpCount =
        claimedDonations.filter(
            (donation) =>
                donation.status ===
                    "claimed" &&
                !donation.otpVerified
        ).length;

    if (pendingOtpCount > 0) {
        notifications.push({
            id: "otp",
            icon: "🔐",
            title: "OTP verification required",
            message: `${pendingOtpCount} pickup${
                pendingOtpCount > 1
                    ? "s need"
                    : " needs"
            } OTP verification.`,
            type: "otp",
        });
    }

    if (pickedCount > 0) {
        notifications.push({
            id: "picked",
            icon: "🚚",
            title: "Food picked up",
            message: `${pickedCount} donation${
                pickedCount > 1
                    ? "s have"
                    : " has"
            } been picked up.`,
            type: "picked",
        });
    }

    if (distributedCount > 0) {
        notifications.push({
            id: "distributed",
            icon: "❤️",
            title: "Successful deliveries",
            message: `You have successfully distributed ${distributedCount} donation${
                distributedCount > 1
                    ? "s"
                    : ""
            }.`,
            type: "distributed",
        });
    }

    const unreadNotifications =
        notifications.filter(
            (notification) =>
                !readNotificationIds.includes(
                    notification.id
                )
        );

    const notificationCount =
        unreadNotifications.length;

    // ================= NAVIGATION =================

    const scrollToSection = (id) => {
        document
            .getElementById(id)
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });

        setSidebarOpen(false);
        setNotificationOpen(false);
        setProfileOpen(false);
    };

    // ================= TOPBAR HANDLERS =================

    const handleNotificationToggle = () => {
        setNotificationOpen((prev) => {
            const willOpen = !prev;

            if (willOpen && notifications.length > 0) {
                const allNotificationIds =
                    notifications.map(
                        (notification) =>
                            notification.id
                    );

                setReadNotificationIds(
                    allNotificationIds
                );

                localStorage.setItem(
                    READ_NOTIFICATIONS_KEY,
                    JSON.stringify(
                        allNotificationIds
                    )
                );
            }

            return willOpen;
        });

        setProfileOpen(false);
    };

    const handleProfileToggle = () => {
        setProfileOpen((prev) => !prev);
        setNotificationOpen(false);
    };

    const openProfile = () => {
        setProfileOpen(false);
        setProfileModalOpen(true);
    };

    const closeProfile = () => {
        setProfileModalOpen(false);
    };

    const handleNotificationClick = (
        notification
    ) => {
        setReadNotificationIds((prev) => {
            if (prev.includes(notification.id)) {
                return prev;
            }

            const updated = [
                ...prev,
                notification.id,
            ];

            localStorage.setItem(
                READ_NOTIFICATIONS_KEY,
                JSON.stringify(updated)
            );

            return updated;
        });

        if (
            notification.type ===
            "available"
        ) {
            scrollToSection(
                "available-donations"
            );
        } else {
            scrollToSection(
                "claimed-donations"
            );
        }
    };

    // ================= UI =================

    return (
        <div className="volunteer-dashboard">

            {/* MOBILE OVERLAY */}

            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                />
            )}

            {/* SIDEBAR */}

            <aside
                className={`volunteer-sidebar ${
                    sidebarOpen
                        ? "sidebar-open"
                        : ""
                }`}
            >
                <div className="sidebar-brand">

                    <div className="brand-icon">
                        🍲
                    </div>

                    <div>
                        <div className="brand-name">
                            FoodShare
                        </div>

                        <div className="brand-role">
                            Volunteer
                        </div>
                    </div>

                </div>

                <div className="sidebar-section">
                    <span>
                        MAIN MENU
                    </span>
                </div>

                <nav className="sidebar-nav">

                    <button
                        className="sidebar-link active"
                        onClick={() =>
                            scrollToSection(
                                "volunteer-home"
                            )
                        }
                    >
                        <span>⌂</span>
                        Dashboard
                    </button>

                    <button
                        className="sidebar-link"
                        onClick={() =>
                            scrollToSection(
                                "available-donations"
                            )
                        }
                    >
                        <span>🍱</span>
                        Available Donations
                    </button>

                    <button
                        className="sidebar-link"
                        onClick={() =>
                            scrollToSection(
                                "available-donations"
                            )
                        }
                    >
                        <span>📍</span>
                        Pickup Locations
                    </button>

                </nav>

                <div className="sidebar-section">
                    <span>
                        MY ACTIVITY
                    </span>
                </div>

                <nav className="sidebar-nav">

                    <button
                        className="sidebar-link"
                        onClick={() =>
                            scrollToSection(
                                "claimed-donations"
                            )
                        }
                    >
                        <span>📦</span>
                        My Claimed Donations
                    </button>

                    <button
                        className="sidebar-link"
                        onClick={() =>
                            scrollToSection(
                                "claimed-donations"
                            )
                        }
                    >
                        <span>✓</span>
                        Pickup History
                    </button>

                    <button
                        className="sidebar-link"
                        onClick={() =>
                            scrollToSection(
                                "impact-section"
                            )
                        }
                    >
                        <span>♡</span>
                        My Impact
                    </button>

                </nav>

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

            {/* MAIN */}

            <main className="volunteer-main">

                {/* TOP NAVBAR */}

                <header className="volunteer-topbar">

                    <div className="topbar-left">

                        <button
                            className="mobile-menu-btn"
                            onClick={() =>
                                setSidebarOpen(
                                    !sidebarOpen
                                )
                            }
                        >
                            ☰
                        </button>

                        <div>
                            <div className="breadcrumb">
                                FoodShare / Dashboard
                            </div>

                            <h1>
                                Volunteer Dashboard
                            </h1>
                        </div>

                    </div>

                    <div className="topbar-right">

                        {/* NOTIFICATION */}

                        <div
                            className="notification-wrapper"
                            ref={notificationRef}
                        >

                            <button
                                className={`notification-btn ${
                                    notificationOpen
                                        ? "notification-active"
                                        : ""
                                }`}
                                onClick={
                                    handleNotificationToggle
                                }
                                aria-label="Notifications"
                                aria-expanded={
                                    notificationOpen
                                }
                            >
                                🔔

                                {notificationCount >
                                    0 && (
                                    <span className="notification-count">
                                        {notificationCount >
                                        9
                                            ? "9+"
                                            : notificationCount}
                                    </span>
                                )}
                            </button>

                            {notificationOpen && (
                                <div className="notification-dropdown">

                                    <div className="notification-header">

                                        <div>
                                            <h3>
                                                Notifications
                                            </h3>

                                            <small>
                                                Stay updated with your activity
                                            </small>
                                        </div>

                                        <span>
                                            {
                                                unreadNotifications.length
                                            }
                                        </span>

                                    </div>

                                    {notifications.length ===
                                    0 ? (
                                        <div className="notification-empty">

                                            <div className="notification-empty-icon">
                                                🔔
                                            </div>

                                            <h4>
                                                No new notifications
                                            </h4>

                                            <p>
                                                You're all caught up!
                                            </p>

                                        </div>
                                    ) : (
                                        <div className="notification-list">

                                            {notifications.map(
                                                (
                                                    notification
                                                ) => {
                                                    const isRead =
                                                        readNotificationIds.includes(
                                                            notification.id
                                                        );

                                                    return (
                                                        <button
                                                            type="button"
                                                            key={
                                                                notification.id
                                                            }
                                                            className={`notification-item ${
                                                                isRead
                                                                    ? "notification-read"
                                                                    : "notification-unread"
                                                            }`}
                                                            onClick={() =>
                                                                handleNotificationClick(
                                                                    notification
                                                                )
                                                            }
                                                        >

                                                            <div className="notification-icon">
                                                                {
                                                                    notification.icon
                                                                }
                                                            </div>

                                                            <div className="notification-content">

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

                                                                <span className="notification-time">
                                                                    {isRead
                                                                        ? "Viewed"
                                                                        : "Tap to view"}
                                                                </span>

                                                            </div>

                                                            {!isRead && (
                                                                <span className="notification-unread-dot" />
                                                            )}

                                                        </button>
                                                    );
                                                }
                                            )}

                                        </div>
                                    )}

                                </div>
                            )}

                        </div>

                        {/* PROFILE */}

                        <div
                            className="profile-wrapper"
                            ref={profileRef}
                        >

                            <button
                                type="button"
                                className={`user-profile ${
                                    profileOpen
                                        ? "profile-active"
                                        : ""
                                }`}
                                onClick={
                                    handleProfileToggle
                                }
                                aria-label="Volunteer profile"
                                aria-expanded={
                                    profileOpen
                                }
                            >

                                <div className="user-avatar">
                                    {volunteerProfile.name
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="user-info">

                                    <strong>
                                        {
                                            volunteerProfile.name
                                        }
                                    </strong>

                                    <small>
                                        Food Contributor
                                    </small>

                                </div>

                                <span className="profile-arrow">
                                    {profileOpen
                                        ? "⌃"
                                        : "⌄"}
                                </span>

                            </button>

                            {profileOpen && (
                                <div className="profile-dropdown">

                                    <div className="profile-dropdown-header">

                                        <div className="profile-dropdown-user">

                                            <div className="profile-dropdown-avatar">
                                                {volunteerProfile.name
                                                    .charAt(
                                                        0
                                                    )
                                                    .toUpperCase()}
                                            </div>

                                            <div className="profile-dropdown-user-info">

                                                <strong>
                                                    {
                                                        volunteerProfile.name
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        volunteerProfile.email
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                        <div className="profile-dropdown-role">
                                            {
                                                volunteerProfile.role
                                            }
                                        </div>

                                    </div>

                                    <div className="profile-dropdown-body">

                                        <button
                                            type="button"
                                            className="profile-menu-btn"
                                            onClick={
                                                openProfile
                                            }
                                        >
                                            <span>
                                                👤
                                            </span>

                                            View Profile
                                        </button>

                                        <div className="profile-menu-divider" />

                                        <button
                                            type="button"
                                            className="profile-menu-btn logout-profile-btn"
                                            onClick={
                                                onLogout
                                            }
                                        >
                                            <span>
                                                ↪
                                            </span>

                                            Logout
                                        </button>

                                    </div>

                                </div>
                            )}

                        </div>

                    </div>
                </header>

                <div className="dashboard-content">

                    {/* WELCOME */}

                    <section
                        id="volunteer-home"
                        className="volunteer-welcome"
                    >

                        <div className="welcome-content">

                            <span className="welcome-badge">
                                ✨ Make an impact today
                            </span>

                            <h2>
                                Welcome back,{" "}
                                {
                                    volunteerProfile.name
                                }! 👋
                            </h2>

                            <p>
                                Help connect surplus food with
                                people who need it. Find a
                                donation, pick it up and make a
                                difference.
                            </p>

                            <button
                                className="primary-btn"
                                onClick={() =>
                                    scrollToSection(
                                        "available-donations"
                                    )
                                }
                            >
                                Find Donations →
                            </button>

                        </div>

                        <div className="welcome-visual">

                            <div className="visual-circle">
                                🤝
                            </div>

                            <div className="visual-card">

                                <strong>
                                    Every pickup matters
                                </strong>

                                <span>
                                    Share food. Spread hope.
                                </span>

                            </div>

                        </div>

                    </section>

                    {/* STATS */}

                    <section className="volunteer-stats">

                        <div className="stat-card">

                            <div className="stat-icon green">
                                🍱
                            </div>

                            <div>
                                <span>
                                    Available Donations
                                </span>

                                <strong>
                                    {
                                        availableCount
                                    }
                                </strong>
                            </div>

                        </div>

                        <div className="stat-card">

                            <div className="stat-icon yellow">
                                📦
                            </div>

                            <div>
                                <span>
                                    Claimed Donations
                                </span>

                                <strong>
                                    {
                                        claimedCount
                                    }
                                </strong>
                            </div>

                        </div>

                        <div className="stat-card">

                            <div className="stat-icon blue">
                                🚚
                            </div>

                            <div>
                                <span>
                                    Picked Up
                                </span>

                                <strong>
                                    {
                                        pickedCount
                                    }
                                </strong>
                            </div>

                        </div>

                        <div className="stat-card">

                            <div className="stat-icon mint">
                                ❤️
                            </div>

                            <div>
                                <span>
                                    Distributed
                                </span>

                                <strong>
                                    {
                                        distributedCount
                                    }
                                </strong>
                            </div>

                        </div>

                    </section>

                    {/* AVAILABLE DONATIONS */}

                    <section
                        id="available-donations"
                        className="dashboard-section"
                    >

                        <div className="section-heading">

                            <div>

                                <span className="section-eyebrow">
                                    FIND FOOD
                                </span>

                                <h2>
                                    Available Donations
                                </h2>

                                <p>
                                    Browse nearby food donations
                                    and claim one to help someone
                                    in need.
                                </p>

                            </div>

                            <span className="result-count">
                                {
                                    filteredDonations.length
                                }{" "}
                                available
                            </span>

                        </div>

                        <div className="search-panel">

                            <div className="search-box">

                                <span>⌕</span>

                                <input
                                    type="text"
                                    placeholder="Search food or pickup location..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <select
                                value={filter}
                                onChange={(e) =>
                                    setFilter(
                                        e.target.value
                                    )
                                }
                                className="filter-select"
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

                        {loading ? (
                            <div className="empty-state">

                                <div className="empty-icon">
                                    ⏳
                                </div>

                                <h3>
                                    Loading donations...
                                </h3>

                                <p>
                                    Please wait while we find
                                    available donations.
                                </p>

                            </div>
                        ) : filteredDonations.length ===
                          0 ? (
                            <div className="empty-state">

                                <div className="empty-icon">
                                    🍽️
                                </div>

                                <h3>
                                    No Available Donations
                                </h3>

                                <p>
                                    There are currently no
                                    donations matching your
                                    search.
                                </p>

                            </div>
                        ) : (
                            <div className="donation-grid">

                                {filteredDonations.map(
                                    (donation) => (
                                        <div
                                            className="volunteer-donation-card"
                                            key={
                                                donation._id
                                            }
                                        >

                                            <div className="donation-card-header">

                                                <div className="food-icon">
                                                    🍲
                                                </div>

                                                <span className="status-badge available">
                                                    Available
                                                </span>

                                            </div>

                                            <h3>
                                                {
                                                    donation.foodType
                                                }
                                            </h3>

                                            <div className="donation-detail">

                                                <span>
                                                    Quantity
                                                </span>

                                                <strong>
                                                    {
                                                        donation.quantity
                                                    }{" "}
                                                    {
                                                        donation.unit
                                                    }
                                                </strong>

                                            </div>

                                            <div className="donation-detail">

                                                <span>
                                                    Best Before
                                                </span>

                                                <strong>
                                                    {donation.bestBefore
                                                        ? new Date(
                                                              donation.bestBefore
                                                          ).toLocaleString()
                                                        : "N/A"}
                                                </strong>

                                            </div>

                                            <div className="pickup-detail">

                                                <span>
                                                    📍
                                                </span>

                                                <p>
                                                    {
                                                        donation.pickupAddress
                                                    }
                                                </p>

                                            </div>

                                            {donation.donorProofImage && (
                                                <div className="proof-preview">

                                                    <span>
                                                        📷 Food Proof
                                                    </span>

                                                    <img
                                                        src={
                                                            donation.donorProofImage
                                                        }
                                                        alt="Food donation proof"
                                                    />

                                                </div>
                                            )}

                                            <button
                                                className="claim-btn"
                                                onClick={() =>
                                                    claimDonation(
                                                        donation._id
                                                    )
                                                }
                                            >
                                                🤝 Claim Donation
                                            </button>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </section>

                    {/* CLAIMED DONATIONS */}

                    <section
                        id="claimed-donations"
                        className="dashboard-section claimed-section"
                    >

                        <div className="section-heading">

                            <div>

                                <span className="section-eyebrow">
                                    MY ACTIVITY
                                </span>

                                <h2>
                                    My Claimed Donations
                                </h2>

                                <p>
                                    Manage your pickups and
                                    complete food deliveries.
                                </p>

                            </div>

                            <span className="result-count">
                                {
                                    claimedDonations.length
                                }{" "}
                                total
                            </span>

                        </div>

                        {claimedLoading ? (
                            <div className="empty-state">

                                <div className="empty-icon">
                                    ⏳
                                </div>

                                <h3>
                                    Loading claimed donations...
                                </h3>

                            </div>
                        ) : claimedDonations.length ===
                          0 ? (
                            <div className="empty-state">

                                <div className="empty-icon">
                                    📦
                                </div>

                                <h3>
                                    No Claimed Donations
                                </h3>

                                <p>
                                    You have not claimed any
                                    donations yet.
                                </p>

                                <button
                                    className="primary-btn small"
                                    onClick={() =>
                                        scrollToSection(
                                            "available-donations"
                                        )
                                    }
                                >
                                    Find Donations
                                </button>

                            </div>
                        ) : (
                            <div className="claimed-grid">

                                {claimedDonations.map(
                                    (donation) => {

                                        let statusClass =
                                            "claimed";

                                        if (
                                            donation.status ===
                                            "picked"
                                        ) {
                                            statusClass =
                                                "picked";
                                        }

                                        if (
                                            donation.status ===
                                            "distributed"
                                        ) {
                                            statusClass =
                                                "distributed";
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
                                                className="claimed-card"
                                                key={
                                                    donation._id
                                                }
                                            >

                                                <div className="claimed-header">

                                                    <div>

                                                        <span className="claimed-food-icon">
                                                            🍲
                                                        </span>

                                                        <h3>
                                                            {
                                                                donation.foodType
                                                            }
                                                        </h3>

                                                    </div>

                                                    <span
                                                        className={`status-badge ${statusClass}`}
                                                    >
                                                        {
                                                            donation.status
                                                        }
                                                    </span>

                                                </div>

                                                <div className="claimed-details">

                                                    <div>

                                                        <span>
                                                            Quantity
                                                        </span>

                                                        <strong>
                                                            {
                                                                donation.quantity
                                                            }{" "}
                                                            {
                                                                donation.unit
                                                            }
                                                        </strong>

                                                    </div>

                                                    <div>

                                                        <span>
                                                            Pickup
                                                        </span>

                                                        <strong>
                                                            {
                                                                donation.pickupAddress
                                                            }
                                                        </strong>

                                                    </div>

                                                    <div>

                                                        <span>
                                                            OTP Status
                                                        </span>

                                                        <strong>
                                                            {donation.otpVerified
                                                                ? "Verified ✓"
                                                                : "Pending"}
                                                        </strong>

                                                    </div>

                                                </div>

                                                {donation.donorProofImage && (
                                                    <div className="proof-preview">

                                                        <span>
                                                            📷 Donor Food Proof
                                                        </span>

                                                        <img
                                                            src={
                                                                donation.donorProofImage
                                                            }
                                                            alt="Donor food proof"
                                                        />

                                                    </div>
                                                )}

                                                {donation.status ===
                                                    "claimed" &&
                                                    !donation.otpVerified && (
                                                        <div className="action-box otp-box">

                                                            <h4>
                                                                🔐 Verify Pickup
                                                            </h4>

                                                            <p>
                                                                Ask the donor
                                                                for the
                                                                6-digit OTP.
                                                            </p>

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
                                                                    handleOtpChange(
                                                                        donation._id,
                                                                        e.target.value.replace(
                                                                            /\D/g,
                                                                            ""
                                                                        )
                                                                    )
                                                                }
                                                            />

                                                            <button
                                                                className="action-btn green-btn"
                                                                onClick={() =>
                                                                    verifyOTP(
                                                                        donation._id
                                                                    )
                                                                }
                                                            >
                                                                ✓ Verify OTP
                                                            </button>

                                                        </div>
                                                    )}

                                                {donation.status ===
                                                    "picked" && (
                                                    <div className="action-box picked-box">

                                                        <h4>
                                                            ✓ Food Picked Up
                                                        </h4>

                                                        <p>
                                                            OTP has been
                                                            verified.
                                                            Upload proof
                                                            after delivering
                                                            the food.
                                                        </p>

                                                        {!proofUploaded && (
                                                            <>
                                                                <h4 className="proof-title">
                                                                    📷 Distribution
                                                                    Proof
                                                                </h4>

                                                                <p>
                                                                    Upload a
                                                                    photo showing
                                                                    that the food
                                                                    has been
                                                                    delivered.
                                                                </p>

                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleDistributionProofChange(
                                                                            donation._id,
                                                                            e
                                                                                .target
                                                                                .files[0]
                                                                        )
                                                                    }
                                                                />

                                                                {selectedProof && (
                                                                    <div className="selected-file">

                                                                        Selected:
                                                                        <strong>
                                                                            {" "}
                                                                            {
                                                                                selectedProof.name
                                                                            }
                                                                        </strong>

                                                                    </div>
                                                                )}

                                                                <button
                                                                    className="action-btn blue-btn"
                                                                    disabled={
                                                                        !selectedProof ||
                                                                        isUploading
                                                                    }
                                                                    onClick={() =>
                                                                        uploadDistributionProof(
                                                                            donation._id
                                                                        )
                                                                    }
                                                                >
                                                                    {isUploading
                                                                        ? "Uploading..."
                                                                        : "📤 Upload Distribution Proof"}
                                                                </button>

                                                            </>
                                                        )}

                                                        {proofUploaded && (
                                                            <div className="uploaded-proof">

                                                                <h4>
                                                                    ✓ Proof
                                                                    Uploaded
                                                                </h4>

                                                                <img
                                                                    src={
                                                                        donation.volunteerProofImage
                                                                    }
                                                                    alt="Distribution proof"
                                                                />

                                                            </div>
                                                        )}

                                                        <button
                                                            className="action-btn distribute-btn"
                                                            disabled={
                                                                !proofUploaded
                                                            }
                                                            onClick={() =>
                                                                markAsDistributed(
                                                                    donation._id
                                                                )
                                                            }
                                                        >
                                                            📦 Mark as Distributed
                                                        </button>

                                                        {!proofUploaded && (
                                                            <small>
                                                                Upload proof to
                                                                enable this
                                                                button.
                                                            </small>
                                                        )}

                                                    </div>
                                                )}

                                                {donation.status ===
                                                    "distributed" && (
                                                    <div className="action-box distributed-box">

                                                        <h4>
                                                            ✓ Donation
                                                            Distributed
                                                        </h4>

                                                        <p>
                                                            This donation has
                                                            been successfully
                                                            delivered.
                                                        </p>

                                                        {donation.volunteerProofImage && (
                                                            <div className="uploaded-proof">

                                                                <h4>
                                                                    📷 Distribution
                                                                    Proof
                                                                </h4>

                                                                <img
                                                                    src={
                                                                        donation.volunteerProofImage
                                                                    }
                                                                    alt="Distribution proof"
                                                                />

                                                            </div>
                                                        )}

                                                    </div>
                                                )}

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    </section>

                    {/* IMPACT */}

                    <section
                        id="impact-section"
                        className="impact-section"
                    >

                        <div>

                            <span className="section-eyebrow">
                                YOUR IMPACT
                            </span>

                            <h2>
                                Small actions create big
                                change. 💚
                            </h2>

                            <p>
                                Every donation you pick up and
                                deliver helps reduce food waste
                                and supports someone in need.
                            </p>

                        </div>

                        <div className="impact-number">

                            <strong>
                                {
                                    distributedCount
                                }
                            </strong>

                            <span>
                                Successful Deliveries
                            </span>

                        </div>

                    </section>

                    {/* FOOTER */}

                    <footer className="dashboard-footer">

                        <div>

                            <strong>
                                🍲 FoodShare
                            </strong>

                            <span>
                                Making a difference, one meal at
                                a time.
                            </span>

                        </div>

                        <span>
                            © 2026 FoodShare
                        </span>

                    </footer>

                </div>
            </main>

            {/* PROFILE MODAL */}

            {profileModalOpen && (
                <div
                    className="profile-modal-overlay"
                    onClick={closeProfile}
                >

                    <div
                        className="profile-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="profile-modal-close"
                            onClick={closeProfile}
                            aria-label="Close profile"
                        >
                            ×
                        </button>

                        <div className="profile-modal-avatar">
                            {volunteerProfile.name
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <h2>
                            {
                                volunteerProfile.name
                            }
                        </h2>

                        <p className="profile-modal-role">
                            {
                                volunteerProfile.role
                            }
                        </p>

                        <div className="profile-details">

                            <div className="profile-detail-row">

                                <span>
                                    👤 Name
                                </span>

                                <strong>
                                    {
                                        volunteerProfile.name
                                    }
                                </strong>

                            </div>

                            <div className="profile-detail-row">

                                <span>
                                    ✉️ Email
                                </span>

                                <strong>
                                    {
                                        volunteerProfile.email
                                    }
                                </strong>

                            </div>

                            <div className="profile-detail-row">

                                <span>
                                    🤝 Role
                                </span>

                                <strong>
                                    {
                                        volunteerProfile.role
                                    }
                                </strong>

                            </div>

                            <div className="profile-detail-row">

                                <span>
                                    ❤️ Deliveries
                                </span>

                                <strong>
                                    {
                                        distributedCount
                                    }
                                </strong>

                            </div>

                        </div>

                        <button
                            className="profile-modal-button"
                            onClick={closeProfile}
                        >
                            Done
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
};

export default VolunteerDashboard;
