import { useEffect, useState } from "react";
import "./AdminDashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

function AdminDashboard({ onLogout }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);

    const [donations, setDonations] = useState([]);
    const [donationsLoading, setDonationsLoading] = useState(true);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // User management
    const [userSearch, setUserSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    // Donation management
    const [donationSearch, setDonationSearch] = useState("");
    const [donationStatusFilter, setDonationStatusFilter] =
        useState("all");
    const [selectedDonation, setSelectedDonation] =
        useState(null);
    const [deleteLoading, setDeleteLoading] = useState(null);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/admin/stats`,
                {
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

            setStats(data);
        } catch (error) {
            console.error("Admin stats error:", error);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/admin/users`,
                {
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

            setUsers(data.users);
        } catch (error) {
            console.error("Fetch users error:", error);
            alert("Server error");
        } finally {
            setUsersLoading(false);
        }
    };

    const fetchDonations = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/admin/donations`,
                {
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
            setDonationsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchDonations();
    }, []);

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth"
        });

        setSidebarOpen(false);
    };

    const getRoleStyle = (role) => {
        if (role === "donor") {
            return "role-badge donor";
        }

        if (role === "volunteer") {
            return "role-badge volunteer";
        }

        if (role === "admin") {
            return "role-badge admin";
        }

        return "role-badge";
    };

    const updateUserStatus = async (userId, action) => {
        try {
            setActionLoading(userId);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/admin/users/${userId}/${action}`,
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

            setUsers((currentUsers) =>
                currentUsers.map((user) =>
                    user._id === userId
                        ? {
                              ...user,
                              isActive:
                                  action === "activate"
                          }
                        : user
                )
            );
        } catch (error) {
            console.error(
                "Update user status error:",
                error
            );

            alert("Server error");
        } finally {
            setActionLoading(null);
        }
    };

    const deleteDonation = async (donation) => {
        if (donation.status !== "available") {
            alert(
                "Only available donations can be deleted by admin."
            );
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete "${donation.foodType}" donation?\n\nThis action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(donation._id);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/donations/admin/${donation._id}`,
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

            setDonations((currentDonations) =>
                currentDonations.filter(
                    (item) =>
                        item._id !== donation._id
                )
            );

            setSelectedDonation(null);

            // Refresh platform statistics
            fetchStats();

            alert("Donation deleted successfully.");
        } catch (error) {
            console.error(
                "Admin delete donation error:",
                error
            );

            alert("Server error");
        } finally {
            setDeleteLoading(null);
        }
    };

    // User filters
    const filteredUsers = users.filter((user) => {
        const searchValue =
            userSearch.toLowerCase().trim();

        const matchesSearch =
            !searchValue ||
            user.name
                ?.toLowerCase()
                .includes(searchValue) ||
            user.email
                ?.toLowerCase()
                .includes(searchValue);

        const matchesRole =
            roleFilter === "all" ||
            user.role === roleFilter;

        const isActive = user.isActive !== false;

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && isActive) ||
            (statusFilter === "inactive" && !isActive);

        return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
        );
    });

    const activeUsersCount = users.filter(
        (user) => user.isActive !== false
    ).length;

    const inactiveUsersCount = users.filter(
        (user) => user.isActive === false
    ).length;

    // Donation filters
    const filteredDonations = donations.filter(
        (donation) => {
            const searchValue =
                donationSearch.toLowerCase().trim();

            const matchesSearch =
                !searchValue ||
                donation.foodType
                    ?.toLowerCase()
                    .includes(searchValue) ||
                donation.pickupAddress
                    ?.toLowerCase()
                    .includes(searchValue) ||
                donation.donor?.name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                donation.donor?.email
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                donationStatusFilter === "all" ||
                donation.status ===
                    donationStatusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        }
    );

    const donationStatusCounts = {
        available: donations.filter(
            (donation) =>
                donation.status === "available"
        ).length,

        claimed: donations.filter(
            (donation) =>
                donation.status === "claimed"
        ).length,

        picked: donations.filter(
            (donation) =>
                donation.status === "picked"
        ).length,

        distributed: donations.filter(
            (donation) =>
                donation.status === "distributed"
        ).length,

        expired: donations.filter(
            (donation) =>
                donation.status === "expired"
        ).length
    };

    let currentUserId = null;

    try {
        const token = localStorage.getItem("token");

        if (token) {
            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            currentUserId =
                payload.id ||
                payload._id ||
                payload.userId ||
                null;
        }
    } catch {
        currentUserId = null;
    }

    return (
        <div className="admin-dashboard">

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                />
            )}

            {/* Sidebar */}
            <aside
                className={`admin-sidebar ${
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
                        <h2>FoodShare</h2>
                        <span>Admin Panel</span>
                    </div>
                </div>

                <div className="sidebar-menu">
                    <p className="menu-label">
                        MAIN MENU
                    </p>

                    <button
                        className="sidebar-link active"
                        onClick={() =>
                            scrollToSection(
                                "admin-dashboard"
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
                                "statistics-section"
                            )
                        }
                    >
                        <span>▣</span>
                        Platform Statistics
                    </button>

                    <button
                        className="sidebar-link"
                        onClick={() =>
                            scrollToSection(
                                "users-section"
                            )
                        }
                    >
                        <span>♙</span>
                        User Management
                    </button>

                    <p className="menu-label activity-label">
                        MANAGEMENT
                    </p>

                    <button
                        className="sidebar-link"
                        onClick={() =>
                            scrollToSection(
                                "donations-section"
                            )
                        }
                    >
                        <span>◈</span>
                        Donation Management
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

            {/* Main Area */}
            <div className="admin-main">

                {/* Topbar */}
                <header className="admin-topbar">
                    <button
                        className="mobile-menu-button"
                        onClick={() =>
                            setSidebarOpen(
                                !sidebarOpen
                            )
                        }
                    >
                        ☰
                    </button>

                    <div className="topbar-heading">
                        <div className="breadcrumb">
                            FoodShare{" "}
                            <span>/</span>{" "}
                            Admin
                        </div>

                        <h1>
                            Admin Dashboard
                        </h1>
                    </div>

                    <div className="topbar-actions">
                        <button className="notification-button">
                            🔔
                            <span className="notification-dot"></span>
                        </button>

                        <div className="admin-profile">
                            <div className="admin-avatar">
                                A
                            </div>

                            <div className="admin-profile-text">
                                <strong>
                                    Administrator
                                </strong>

                                <span>
                                    Platform Manager
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="admin-content">

                    {/* Welcome */}
                    <section
                        id="admin-dashboard"
                        className="admin-welcome"
                    >
                        <div className="welcome-content">
                            <span className="welcome-badge">
                                PLATFORM OVERVIEW
                            </span>

                            <h2>
                                Welcome back, Admin! 👋
                            </h2>

                            <p>
                                Monitor FoodShare
                                activity, users and
                                food donations from
                                one place.
                            </p>
                        </div>

                        <div className="welcome-visual">
                            📊
                        </div>
                    </section>

                    {/* Statistics */}
                    <section
                        id="statistics-section"
                        className="admin-section"
                    >
                        <div className="section-heading">
                            <div>
                                <h2>
                                    Platform Statistics
                                </h2>

                                <p>
                                    A quick overview of
                                    the FoodShare
                                    platform.
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="admin-empty-state">
                                <div className="loading-spinner"></div>
                                <p>
                                    Loading
                                    statistics...
                                </p>
                            </div>
                        ) : stats ? (
                            <div className="admin-stats-grid">

                                <div className="admin-stat-card">
                                    <div className="stat-icon green">
                                        👥
                                    </div>

                                    <div>
                                        <p>Total Users</p>
                                        <h3>
                                            {stats.totalUsers}
                                        </h3>
                                    </div>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="stat-icon heart">
                                        ❤️
                                    </div>

                                    <div>
                                        <p>Total Donors</p>
                                        <h3>
                                            {stats.totalDonors}
                                        </h3>
                                    </div>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="stat-icon blue">
                                        🤝
                                    </div>

                                    <div>
                                        <p>
                                            Total Volunteers
                                        </p>

                                        <h3>
                                            {stats.totalVolunteers}
                                        </h3>
                                    </div>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="stat-icon purple">
                                        🍱
                                    </div>

                                    <div>
                                        <p>
                                            Total Donations
                                        </p>

                                        <h3>
                                            {stats.totalDonations}
                                        </h3>
                                    </div>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="stat-icon green">
                                        🟢
                                    </div>

                                    <div>
                                        <p>
                                            Available
                                            Donations
                                        </p>

                                        <h3>
                                            {stats.availableDonations}
                                        </h3>
                                    </div>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="stat-icon yellow">
                                        📦
                                    </div>

                                    <div>
                                        <p>
                                            Claimed
                                            Donations
                                        </p>

                                        <h3>
                                            {stats.claimedDonations}
                                        </h3>
                                    </div>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="stat-icon blue">
                                        🚚
                                    </div>

                                    <div>
                                        <p>
                                            Picked
                                            Donations
                                        </p>

                                        <h3>
                                            {stats.pickedDonations}
                                        </h3>
                                    </div>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="stat-icon purple">
                                        🎉
                                    </div>

                                    <div>
                                        <p>
                                            Distributed
                                            Donations
                                        </p>

                                        <h3>
                                            {stats.distributedDonations}
                                        </h3>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="admin-empty-state">
                                <div>📊</div>

                                <h3>
                                    No statistics
                                    available
                                </h3>

                                <p>
                                    Statistics could
                                    not be loaded.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* User Management */}
                    <section
                        id="users-section"
                        className="admin-section users-section"
                    >
                        <div className="section-heading">
                            <div>
                                <h2>
                                    User Management 👥
                                </h2>

                                <p>
                                    Manage registered
                                    FoodShare users
                                    and their account
                                    status.
                                </p>
                            </div>

                            <div className="user-count">
                                {filteredUsers.length}{" "}
                                Users
                            </div>
                        </div>

                        <div className="user-management-summary">

                            <div className="user-summary-card">
                                <span className="summary-icon">
                                    👥
                                </span>

                                <div>
                                    <span>
                                        Total Users
                                    </span>

                                    <strong>
                                        {users.length}
                                    </strong>
                                </div>
                            </div>

                            <div className="user-summary-card active-summary">
                                <span className="summary-icon">
                                    🟢
                                </span>

                                <div>
                                    <span>
                                        Active Users
                                    </span>

                                    <strong>
                                        {activeUsersCount}
                                    </strong>
                                </div>
                            </div>

                            <div className="user-summary-card inactive-summary">
                                <span className="summary-icon">
                                    🔴
                                </span>

                                <div>
                                    <span>
                                        Inactive Users
                                    </span>

                                    <strong>
                                        {inactiveUsersCount}
                                    </strong>
                                </div>
                            </div>

                        </div>

                        <div className="user-filters">

                            <div className="user-search-box">
                                <span>🔍</span>

                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={userSearch}
                                    onChange={(e) =>
                                        setUserSearch(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <select
                                value={roleFilter}
                                onChange={(e) =>
                                    setRoleFilter(
                                        e.target.value
                                    )
                                }
                                className="user-filter-select"
                            >
                                <option value="all">
                                    All Roles
                                </option>

                                <option value="donor">
                                    Donors
                                </option>

                                <option value="volunteer">
                                    Volunteers
                                </option>

                                <option value="admin">
                                    Admins
                                </option>
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                                className="user-filter-select"
                            >
                                <option value="all">
                                    All Status
                                </option>

                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>
                            </select>

                        </div>

                        {usersLoading ? (
                            <div className="admin-empty-state">
                                <div className="loading-spinner"></div>
                                <p>
                                    Loading users...
                                </p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="admin-empty-state">
                                <div className="empty-icon">
                                    👥
                                </div>

                                <h3>
                                    No users found
                                </h3>

                                <p>
                                    Registered users
                                    will appear
                                    here.
                                </p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="admin-empty-state">
                                <div className="empty-icon">
                                    🔍
                                </div>

                                <h3>
                                    No matching users
                                </h3>

                                <p>
                                    Try changing your
                                    search or filters.
                                </p>
                            </div>
                        ) : (
                            <div className="users-table-wrapper">
                                <div className="users-table">

                                    <div className="users-table-header">
                                        <div>User</div>
                                        <div>Email</div>
                                        <div>Role</div>
                                        <div>Status</div>
                                        <div>Registered</div>
                                        <div>Actions</div>
                                    </div>

                                    {filteredUsers.map(
                                        (user) => {
                                            const isActive =
                                                user.isActive !==
                                                false;

                                            const isCurrentAdmin =
                                                currentUserId ===
                                                user._id;

                                            return (
                                                <div
                                                    className="user-row"
                                                    key={
                                                        user._id
                                                    }
                                                >
                                                    <div className="user-info">
                                                        <div className="user-avatar">
                                                            {user.name
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                ?.toUpperCase()}
                                                        </div>

                                                        <div className="user-name-block">
                                                            <strong>
                                                                {
                                                                    user.name
                                                                }
                                                            </strong>

                                                            <button
                                                                className="view-user-button"
                                                                onClick={() =>
                                                                    setSelectedUser(
                                                                        user
                                                                    )
                                                                }
                                                            >
                                                                View
                                                                details
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="user-email">
                                                        {
                                                            user.email
                                                        }
                                                    </div>

                                                    <div>
                                                        <span
                                                            className={getRoleStyle(
                                                                user.role
                                                            )}
                                                        >
                                                            {
                                                                user.role
                                                            }
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <span
                                                            className={`user-status ${
                                                                isActive
                                                                    ? "active"
                                                                    : "inactive"
                                                            }`}
                                                        >
                                                            <span className="status-dot"></span>

                                                            {isActive
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </div>

                                                    <div className="registered-date">
                                                        {user.createdAt
                                                            ? new Date(
                                                                  user.createdAt
                                                              ).toLocaleDateString()
                                                            : "N/A"}
                                                    </div>

                                                    <div className="user-actions">
                                                        {isCurrentAdmin ? (
                                                            <span className="current-admin-label">
                                                                Current
                                                                Admin
                                                            </span>
                                                        ) : (
                                                            <button
                                                                className={`status-action-button ${
                                                                    isActive
                                                                        ? "deactivate"
                                                                        : "activate"
                                                                }`}
                                                                disabled={
                                                                    actionLoading ===
                                                                    user._id
                                                                }
                                                                onClick={() =>
                                                                    updateUserStatus(
                                                                        user._id,
                                                                        isActive
                                                                            ? "deactivate"
                                                                            : "activate"
                                                                    )
                                                                }
                                                            >
                                                                {actionLoading ===
                                                                user._id
                                                                    ? "Updating..."
                                                                    : isActive
                                                                    ? "Deactivate"
                                                                    : "Activate"}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}

                                </div>
                            </div>
                        )}
                    </section>

                    {/* Donation Management */}
                    <section
                        id="donations-section"
                        className="admin-section donations-section"
                    >
                        <div className="section-heading">
                            <div>
                                <h2>
                                    Donation Management 🍱
                                </h2>

                                <p>
                                    Monitor and review all
                                    food donations on the
                                    FoodShare platform.
                                </p>
                            </div>

                            <div className="user-count">
                                {
                                    filteredDonations.length
                                }{" "}
                                Donations
                            </div>
                        </div>

                        <div className="donation-management-summary">

                            <div className="donation-summary-card">
                                <span className="summary-icon">
                                    🍱
                                </span>

                                <div>
                                    <span>
                                        Total Donations
                                    </span>

                                    <strong>
                                        {donations.length}
                                    </strong>
                                </div>
                            </div>

                            <div className="donation-summary-card">
                                <span className="summary-icon">
                                    🟢
                                </span>

                                <div>
                                    <span>
                                        Available
                                    </span>

                                    <strong>
                                        {
                                            donationStatusCounts.available
                                        }
                                    </strong>
                                </div>
                            </div>

                            <div className="donation-summary-card">
                                <span className="summary-icon">
                                    📦
                                </span>

                                <div>
                                    <span>
                                        Claimed
                                    </span>

                                    <strong>
                                        {
                                            donationStatusCounts.claimed
                                        }
                                    </strong>
                                </div>
                            </div>

                            <div className="donation-summary-card">
                                <span className="summary-icon">
                                    🚚
                                </span>

                                <div>
                                    <span>
                                        Picked
                                    </span>

                                    <strong>
                                        {
                                            donationStatusCounts.picked
                                        }
                                    </strong>
                                </div>
                            </div>

                            <div className="donation-summary-card">
                                <span className="summary-icon">
                                    🎉
                                </span>

                                <div>
                                    <span>
                                        Distributed
                                    </span>

                                    <strong>
                                        {
                                            donationStatusCounts.distributed
                                        }
                                    </strong>
                                </div>
                            </div>

                            <div className="donation-summary-card">
                                <span className="summary-icon">
                                    ⏰
                                </span>

                                <div>
                                    <span>
                                        Expired
                                    </span>

                                    <strong>
                                        {
                                            donationStatusCounts.expired
                                        }
                                    </strong>
                                </div>
                            </div>

                        </div>

                        <div className="donation-filters">

                            <div className="donation-search-box">
                                <span>🔍</span>

                                <input
                                    type="text"
                                    placeholder="Search food, donor or pickup location..."
                                    value={
                                        donationSearch
                                    }
                                    onChange={(e) =>
                                        setDonationSearch(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <select
                                value={
                                    donationStatusFilter
                                }
                                onChange={(e) =>
                                    setDonationStatusFilter(
                                        e.target.value
                                    )
                                }
                                className="donation-filter-select"
                            >
                                <option value="all">
                                    All Status
                                </option>

                                <option value="available">
                                    Available
                                </option>

                                <option value="claimed">
                                    Claimed
                                </option>

                                <option value="picked">
                                    Picked
                                </option>

                                <option value="distributed">
                                    Distributed
                                </option>

                                <option value="expired">
                                    Expired
                                </option>
                            </select>

                        </div>

                        {donationsLoading ? (
                            <div className="admin-empty-state">
                                <div className="loading-spinner"></div>
                                <p>
                                    Loading donations...
                                </p>
                            </div>
                        ) : donations.length === 0 ? (
                            <div className="admin-empty-state">
                                <div className="empty-icon">
                                    🍱
                                </div>

                                <h3>
                                    No donations found
                                </h3>

                                <p>
                                    Food donations will
                                    appear here.
                                </p>
                            </div>
                        ) : filteredDonations.length ===
                          0 ? (
                            <div className="admin-empty-state">
                                <div className="empty-icon">
                                    🔍
                                </div>

                                <h3>
                                    No matching donations
                                </h3>

                                <p>
                                    Try changing your
                                    search or status
                                    filter.
                                </p>
                            </div>
                        ) : (
                            <div className="donations-table-wrapper">
                                <div className="donations-table">

                                    <div className="donations-table-header">
                                        <div>Food</div>
                                        <div>Donor</div>
                                        <div>Quantity</div>
                                        <div>Status</div>
                                        <div>
                                            Best Before
                                        </div>
                                        <div>Action</div>
                                    </div>

                                    {filteredDonations.map(
                                        (donation) => (
                                            <div
                                                className="donation-row"
                                                key={
                                                    donation._id
                                                }
                                            >
                                                <div className="donation-food-info">
                                                    <div className="donation-food-icon">
                                                        🍱
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {
                                                                donation.foodType
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                donation.pickupAddress
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="donation-donor-info">
                                                    <strong>
                                                        {donation
                                                            .donor
                                                            ?.name ||
                                                            "Unknown"}
                                                    </strong>

                                                    <span>
                                                        {donation
                                                            .donor
                                                            ?.email ||
                                                            "N/A"}
                                                    </span>
                                                </div>

                                                <div className="donation-quantity">
                                                    {
                                                        donation.quantity
                                                    }{" "}
                                                    {
                                                        donation.unit
                                                    }
                                                </div>

                                                <div>
                                                    <span
                                                        className={`donation-status ${donation.status}`}
                                                    >
                                                        <span className="status-dot"></span>

                                                        {
                                                            donation.status
                                                        }
                                                    </span>
                                                </div>

                                                <div className="donation-date">
                                                    {donation.bestBefore
                                                        ? new Date(
                                                              donation.bestBefore
                                                          ).toLocaleDateString()
                                                        : "N/A"}
                                                </div>

                                                <div className="donation-action-group">

                                                    <button
                                                        className="view-donation-button"
                                                        onClick={() =>
                                                            setSelectedDonation(
                                                                donation
                                                            )
                                                        }
                                                    >
                                                        View
                                                        Details
                                                    </button>

                                                    {donation.status ===
                                                        "available" && (
                                                        <button
                                                            className="delete-donation-button"
                                                            disabled={
                                                                deleteLoading ===
                                                                donation._id
                                                            }
                                                            onClick={() =>
                                                                deleteDonation(
                                                                    donation
                                                                )
                                                            }
                                                        >
                                                            {deleteLoading ===
                                                            donation._id
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>
                                                    )}

                                                </div>
                                            </div>
                                        )
                                    )}

                                </div>
                            </div>
                        )}
                    </section>

                    {/* Existing Overview */}
                    <section className="admin-overview-section">

                        <div className="overview-card">
                            <div className="overview-icon">
                                🍱
                            </div>

                            <div>
                                <h3>
                                    Donation Overview
                                </h3>

                                <p>
                                    FoodShare currently has{" "}
                                    <strong>
                                        {stats?.totalDonations ??
                                            0}
                                    </strong>{" "}
                                    total donations,
                                    with{" "}
                                    <strong>
                                        {stats?.availableDonations ??
                                            0}
                                    </strong>{" "}
                                    currently
                                    available.
                                </p>
                            </div>
                        </div>

                        <div className="overview-card">
                            <div className="overview-icon">
                                🤝
                            </div>

                            <div>
                                <h3>
                                    Community Overview
                                </h3>

                                <p>
                                    The platform has{" "}
                                    <strong>
                                        {stats?.totalDonors ??
                                            0}
                                    </strong>{" "}
                                    donors and{" "}
                                    <strong>
                                        {stats?.totalVolunteers ??
                                            0}
                                    </strong>{" "}
                                    volunteers
                                    contributing to
                                    the FoodShare
                                    community.
                                </p>
                            </div>
                        </div>

                    </section>

                </main>

                {/* User Details Modal */}
                {selectedUser && (
                    <div
                        className="user-modal-overlay"
                        onClick={() =>
                            setSelectedUser(null)
                        }
                    >
                        <div
                            className="user-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >
                            <button
                                className="modal-close-button"
                                onClick={() =>
                                    setSelectedUser(null)
                                }
                            >
                                ×
                            </button>

                            <div className="modal-user-avatar">
                                {selectedUser.name
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </div>

                            <h2>
                                {selectedUser.name}
                            </h2>

                            <span
                                className={getRoleStyle(
                                    selectedUser.role
                                )}
                            >
                                {selectedUser.role}
                            </span>

                            <div className="user-detail-list">

                                <div className="user-detail-item">
                                    <span>Email</span>

                                    <strong>
                                        {
                                            selectedUser.email
                                        }
                                    </strong>
                                </div>

                                <div className="user-detail-item">
                                    <span>Status</span>

                                    <strong>
                                        {selectedUser.isActive !==
                                        false
                                            ? "Active"
                                            : "Inactive"}
                                    </strong>
                                </div>

                                <div className="user-detail-item">
                                    <span>
                                        Registered
                                    </span>

                                    <strong>
                                        {selectedUser.createdAt
                                            ? new Date(
                                                  selectedUser.createdAt
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </strong>
                                </div>

                                <div className="user-detail-item">
                                    <span>User ID</span>

                                    <strong>
                                        {
                                            selectedUser._id
                                        }
                                    </strong>
                                </div>

                            </div>

                            <button
                                className="modal-done-button"
                                onClick={() =>
                                    setSelectedUser(null)
                                }
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Donation Details Modal */}
                {selectedDonation && (
                    <div
                        className="user-modal-overlay"
                        onClick={() =>
                            setSelectedDonation(null)
                        }
                    >
                        <div
                            className="donation-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >
                            <button
                                className="modal-close-button"
                                onClick={() =>
                                    setSelectedDonation(null)
                                }
                            >
                                ×
                            </button>

                            <div className="modal-donation-icon">
                                🍱
                            </div>

                            <h2>
                                {
                                    selectedDonation.foodType
                                }
                            </h2>

                            <span
                                className={`donation-status ${selectedDonation.status}`}
                            >
                                <span className="status-dot"></span>

                                {
                                    selectedDonation.status
                                }
                            </span>

                            <div className="user-detail-list">

                                <div className="user-detail-item">
                                    <span>
                                        Quantity
                                    </span>

                                    <strong>
                                        {
                                            selectedDonation.quantity
                                        }{" "}
                                        {
                                            selectedDonation.unit
                                        }
                                    </strong>
                                </div>

                                <div className="user-detail-item">
                                    <span>Donor</span>

                                    <strong>
                                        {selectedDonation
                                            .donor
                                            ?.name ||
                                            "Unknown"}
                                    </strong>
                                </div>

                                <div className="user-detail-item">
                                    <span>
                                        Donor Email
                                    </span>

                                    <strong>
                                        {selectedDonation
                                            .donor
                                            ?.email ||
                                            "N/A"}
                                    </strong>
                                </div>

                                <div className="user-detail-item">
                                    <span>
                                        Pickup Address
                                    </span>

                                    <strong>
                                        {
                                            selectedDonation.pickupAddress
                                        }
                                    </strong>
                                </div>

                                <div className="user-detail-item">
                                    <span>
                                        Best Before
                                    </span>

                                    <strong>
                                        {selectedDonation.bestBefore
                                            ? new Date(
                                                  selectedDonation.bestBefore
                                              ).toLocaleString()
                                            : "N/A"}
                                    </strong>
                                </div>

                                <div className="user-detail-item">
                                    <span>
                                        Claimed By
                                    </span>

                                    <strong>
                                        {selectedDonation
                                            .claimedBy
                                            ?.name ||
                                            "Not claimed"}
                                    </strong>
                                </div>

                                <div className="user-detail-item">
                                    <span>
                                        Volunteer Email
                                    </span>

                                    <strong>
                                        {selectedDonation
                                            .claimedBy
                                            ?.email ||
                                            "N/A"}
                                    </strong>
                                </div>

                                <div className="user-detail-item">
                                    <span>
                                        OTP Verified
                                    </span>

                                    <strong>
                                        {selectedDonation.otpVerified
                                            ? "Yes"
                                            : "No"}
                                    </strong>
                                </div>

                                <div className="user-detail-item">
                                    <span>
                                        Donor Proof
                                    </span>

                                    <strong>
                                        {selectedDonation.donorProofImage
                                            ? "Available"
                                            : "Not uploaded"}
                                    </strong>
                                </div>

                                <div className="user-detail-item">
                                    <span>
                                        Distribution Proof
                                    </span>

                                    <strong>
                                        {selectedDonation.volunteerProofImage
                                            ? "Available"
                                            : "Not uploaded"}
                                    </strong>
                                </div>

                                <div className="user-detail-item">
                                    <span>
                                        Created
                                    </span>

                                    <strong>
                                        {selectedDonation.createdAt
                                            ? new Date(
                                                  selectedDonation.createdAt
                                              ).toLocaleString()
                                            : "N/A"}
                                    </strong>
                                </div>

                            </div>

                            {(selectedDonation.donorProofImage ||
                                selectedDonation.volunteerProofImage) && (
                                <div className="donation-proofs">

                                    <h3>
                                        Donation Proofs
                                    </h3>

                                    <div className="proof-image-grid">

                                        {selectedDonation.donorProofImage && (
                                            <div className="proof-image-card">
                                                <span>
                                                    Donor
                                                    Proof
                                                </span>

                                                <img
                                                    src={
                                                        selectedDonation.donorProofImage
                                                    }
                                                    alt="Donor proof"
                                                />
                                            </div>
                                        )}

                                        {selectedDonation.volunteerProofImage && (
                                            <div className="proof-image-card">
                                                <span>
                                                    Distribution
                                                    Proof
                                                </span>

                                                <img
                                                    src={
                                                        selectedDonation.volunteerProofImage
                                                    }
                                                    alt="Distribution proof"
                                                />
                                            </div>
                                        )}

                                    </div>
                                </div>
                            )}

                            <div className="donation-modal-actions">

                                {selectedDonation.status ===
                                    "available" && (
                                    <button
                                        className="modal-delete-button"
                                        disabled={
                                            deleteLoading ===
                                            selectedDonation._id
                                        }
                                        onClick={() =>
                                            deleteDonation(
                                                selectedDonation
                                            )
                                        }
                                    >
                                        {deleteLoading ===
                                        selectedDonation._id
                                            ? "Deleting..."
                                            : "Delete Donation"}
                                    </button>
                                )}

                                <button
                                    className="modal-done-button"
                                    onClick={() =>
                                        setSelectedDonation(
                                            null
                                        )
                                    }
                                >
                                    Close
                                </button>

                            </div>

                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer className="admin-footer">
                    <p>
                        FoodShare — Share food.
                        Spread kindness. 🌱❤️
                    </p>
                </footer>

            </div>
        </div>
    );
}

export default AdminDashboard;