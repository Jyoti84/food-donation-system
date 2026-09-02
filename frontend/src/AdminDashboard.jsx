import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

function AdminDashboard({ onLogout }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);

    const [donations, setDonations] = useState([]);
    const [donationsLoading, setDonationsLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/admin/stats`,
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

            setUsers(data.users);
        } catch (error) {
            console.error("Fetch users error:", error);
            alert("Server error");
        } finally {
            setUsersLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchUsers();
    }, []);

    const getRoleStyle = (role) => {
        if (role === "donor") {
            return {
                backgroundColor: "#e8f5e9",
                color: "#198754"
            };
        }

        if (role === "volunteer") {
            return {
                backgroundColor: "#e3f2fd",
                color: "#1565c0"
            };
        }

        if (role === "admin") {
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
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
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
                        Admin Dashboard
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
                {/* Welcome Section */}
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
                        Welcome Admin 👋
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#777",
                            fontSize: "16px"
                        }}
                    >
                        Monitor food donations and manage the
                        FoodShare platform.
                    </p>
                </section>

                {/* Statistics */}
                <section style={{ marginBottom: "45px" }}>
                    <div style={{ marginBottom: "20px" }}>
                        <h2
                            style={{
                                margin: 0,
                                color: "#344e41",
                                fontSize: "27px"
                            }}
                        >
                            Platform Statistics 📊
                        </h2>

                        <p
                            style={{
                                marginTop: "6px",
                                color: "#777"
                            }}
                        >
                            Overview of users and food donations.
                        </p>
                    </div>

                    {loading ? (
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                padding: "45px",
                                borderRadius: "16px",
                                textAlign: "center"
                            }}
                        >
                            <p style={{ color: "#777" }}>
                                Loading statistics...
                            </p>
                        </div>
                    ) : stats ? (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(220px, 1fr))",
                                gap: "22px"
                            }}
                        >
                            {/* Total Users */}
                            <div
                                style={{
                                    backgroundColor: "#ffffff",
                                    padding: "25px",
                                    borderRadius: "16px",
                                    boxShadow:
                                        "0 6px 18px rgba(0,0,0,0.07)",
                                    borderLeft:
                                        "5px solid #198754"
                                }}
                            >
                                <div style={{ fontSize: "30px" }}>
                                    👥
                                </div>

                                <p
                                    style={{
                                        margin: "12px 0 5px",
                                        color: "#777",
                                        fontSize: "14px"
                                    }}
                                >
                                    Total Users
                                </p>

                                <h2
                                    style={{
                                        margin: 0,
                                        color: "#198754",
                                        fontSize: "32px"
                                    }}
                                >
                                    {stats.totalUsers}
                                </h2>
                            </div>

                            {/* Donors */}
                            <div
                                style={{
                                    backgroundColor: "#ffffff",
                                    padding: "25px",
                                    borderRadius: "16px",
                                    boxShadow:
                                        "0 6px 18px rgba(0,0,0,0.07)",
                                    borderLeft:
                                        "5px solid #198754"
                                }}
                            >
                                <div style={{ fontSize: "30px" }}>
                                    ❤️
                                </div>

                                <p
                                    style={{
                                        margin: "12px 0 5px",
                                        color: "#777",
                                        fontSize: "14px"
                                    }}
                                >
                                    Total Donors
                                </p>

                                <h2
                                    style={{
                                        margin: 0,
                                        color: "#198754",
                                        fontSize: "32px"
                                    }}
                                >
                                    {stats.totalDonors}
                                </h2>
                            </div>

                            {/* Volunteers */}
                            <div
                                style={{
                                    backgroundColor: "#ffffff",
                                    padding: "25px",
                                    borderRadius: "16px",
                                    boxShadow:
                                        "0 6px 18px rgba(0,0,0,0.07)",
                                    borderLeft:
                                        "5px solid #1565c0"
                                }}
                            >
                                <div style={{ fontSize: "30px" }}>
                                    🤝
                                </div>

                                <p
                                    style={{
                                        margin: "12px 0 5px",
                                        color: "#777",
                                        fontSize: "14px"
                                    }}
                                >
                                    Total Volunteers
                                </p>

                                <h2
                                    style={{
                                        margin: 0,
                                        color: "#1565c0",
                                        fontSize: "32px"
                                    }}
                                >
                                    {stats.totalVolunteers}
                                </h2>
                            </div>

                            {/* Total Donations */}
                            <div
                                style={{
                                    backgroundColor: "#ffffff",
                                    padding: "25px",
                                    borderRadius: "16px",
                                    boxShadow:
                                        "0 6px 18px rgba(0,0,0,0.07)",
                                    borderLeft:
                                        "5px solid #7b1fa2"
                                }}
                            >
                                <div style={{ fontSize: "30px" }}>
                                    🍱
                                </div>

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
                                        color: "#7b1fa2",
                                        fontSize: "32px"
                                    }}
                                >
                                    {stats.totalDonations}
                                </h2>
                            </div>

                            {/* Available */}
                            <div
                                style={{
                                    backgroundColor: "#ffffff",
                                    padding: "25px",
                                    borderRadius: "16px",
                                    boxShadow:
                                        "0 6px 18px rgba(0,0,0,0.07)",
                                    borderLeft:
                                        "5px solid #198754"
                                }}
                            >
                                <div style={{ fontSize: "30px" }}>
                                    🟢
                                </div>

                                <p
                                    style={{
                                        margin: "12px 0 5px",
                                        color: "#777",
                                        fontSize: "14px"
                                    }}
                                >
                                    Available Donations
                                </p>

                                <h2
                                    style={{
                                        margin: 0,
                                        color: "#198754",
                                        fontSize: "32px"
                                    }}
                                >
                                    {stats.availableDonations}
                                </h2>
                            </div>

                            {/* Claimed */}
                            <div
                                style={{
                                    backgroundColor: "#ffffff",
                                    padding: "25px",
                                    borderRadius: "16px",
                                    boxShadow:
                                        "0 6px 18px rgba(0,0,0,0.07)",
                                    borderLeft:
                                        "5px solid #856404"
                                }}
                            >
                                <div style={{ fontSize: "30px" }}>
                                    📦
                                </div>

                                <p
                                    style={{
                                        margin: "12px 0 5px",
                                        color: "#777",
                                        fontSize: "14px"
                                    }}
                                >
                                    Claimed Donations
                                </p>

                                <h2
                                    style={{
                                        margin: 0,
                                        color: "#856404",
                                        fontSize: "32px"
                                    }}
                                >
                                    {stats.claimedDonations}
                                </h2>
                            </div>

                            {/* Picked */}
                            <div
                                style={{
                                    backgroundColor: "#ffffff",
                                    padding: "25px",
                                    borderRadius: "16px",
                                    boxShadow:
                                        "0 6px 18px rgba(0,0,0,0.07)",
                                    borderLeft:
                                        "5px solid #1565c0"
                                }}
                            >
                                <div style={{ fontSize: "30px" }}>
                                    🚚
                                </div>

                                <p
                                    style={{
                                        margin: "12px 0 5px",
                                        color: "#777",
                                        fontSize: "14px"
                                    }}
                                >
                                    Picked Donations
                                </p>

                                <h2
                                    style={{
                                        margin: 0,
                                        color: "#1565c0",
                                        fontSize: "32px"
                                    }}
                                >
                                    {stats.pickedDonations}
                                </h2>
                            </div>

                            {/* Distributed */}
                            <div
                                style={{
                                    backgroundColor: "#ffffff",
                                    padding: "25px",
                                    borderRadius: "16px",
                                    boxShadow:
                                        "0 6px 18px rgba(0,0,0,0.07)",
                                    borderLeft:
                                        "5px solid #7b1fa2"
                                }}
                            >
                                <div style={{ fontSize: "30px" }}>
                                    🎉
                                </div>

                                <p
                                    style={{
                                        margin: "12px 0 5px",
                                        color: "#777",
                                        fontSize: "14px"
                                    }}
                                >
                                    Distributed Donations
                                </p>

                                <h2
                                    style={{
                                        margin: 0,
                                        color: "#7b1fa2",
                                        fontSize: "32px"
                                    }}
                                >
                                    {stats.distributedDonations}
                                </h2>
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                padding: "40px",
                                borderRadius: "16px",
                                textAlign: "center"
                            }}
                        >
                            <p style={{ color: "#777" }}>
                                No statistics available.
                            </p>
                        </div>
                    )}
                </section>

                {/* All Users */}
                <section>
                    <div style={{ marginBottom: "20px" }}>
                        <h2
                            style={{
                                margin: 0,
                                color: "#344e41",
                                fontSize: "27px"
                            }}
                        >
                            All Users 👥
                        </h2>

                        <p
                            style={{
                                marginTop: "6px",
                                color: "#777"
                            }}
                        >
                            View all registered users on FoodShare.
                        </p>
                    </div>

                    {usersLoading ? (
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                padding: "45px",
                                borderRadius: "16px",
                                textAlign: "center",
                                boxShadow:
                                    "0 5px 18px rgba(0,0,0,0.06)"
                            }}
                        >
                            <p style={{ color: "#777" }}>
                                Loading users...
                            </p>
                        </div>
                    ) : users.length === 0 ? (
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                padding: "45px",
                                borderRadius: "16px",
                                textAlign: "center",
                                boxShadow:
                                    "0 5px 18px rgba(0,0,0,0.06)"
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "50px",
                                    marginBottom: "10px"
                                }}
                            >
                                👥
                            </div>

                            <h3
                                style={{
                                    margin: "0 0 8px",
                                    color: "#344e41"
                                }}
                            >
                                No users found
                            </h3>

                            <p
                                style={{
                                    margin: 0,
                                    color: "#888"
                                }}
                            >
                                Registered users will appear here.
                            </p>
                        </div>
                    ) : (
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "16px",
                                boxShadow:
                                    "0 6px 18px rgba(0,0,0,0.07)",
                                overflow: "hidden"
                            }}
                        >
                            {/* Table Header */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "2fr 3fr 1.3fr 1.5fr",
                                    gap: "20px",
                                    padding: "18px 25px",
                                    backgroundColor: "#f8faf8",
                                    borderBottom:
                                        "1px solid #edf2ee",
                                    fontWeight: "bold",
                                    color: "#344e41"
                                }}
                            >
                                <div>Name</div>
                                <div>Email</div>
                                <div>Role</div>
                                <div>Registered</div>
                            </div>

                            {/* Users */}
                            {users.map((user) => (
                                <div
                                    key={user._id}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "2fr 3fr 1.3fr 1.5fr",
                                        gap: "20px",
                                        alignItems: "center",
                                        padding: "18px 25px",
                                        borderBottom:
                                            "1px solid #edf2ee"
                                    }}
                                >
                                    <div
                                        style={{
                                            color: "#344e41",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {user.name}
                                    </div>

                                    <div
                                        style={{
                                            color: "#666",
                                            wordBreak:
                                                "break-word"
                                        }}
                                    >
                                        {user.email}
                                    </div>

                                    <span
                                        style={{
                                            ...getRoleStyle(
                                                user.role
                                            ),
                                            width: "fit-content",
                                            padding: "6px 12px",
                                            borderRadius: "20px",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            textTransform:
                                                "capitalize"
                                        }}
                                    >
                                        {user.role}
                                    </span>

                                    <div
                                        style={{
                                            color: "#777",
                                            fontSize: "14px"
                                        }}
                                    >
                                        {user.createdAt
                                            ? new Date(
                                                  user.createdAt
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </div>
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
                    padding: "30px",
                    color: "#777",
                    fontSize: "13px",
                    boxSizing: "border-box"
                }}
            >
                FoodShare — Share food. Spread kindness. 🌱❤️
            </footer>
        </div>
    );
}

export default AdminDashboard;
