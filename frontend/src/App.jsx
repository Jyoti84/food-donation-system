import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import DonorDashboard from "./DonorDashboard";
import VolunteerDashboard from "./VolunteerDashboard";
import AdminDashboard from "./AdminDashboard";

function App() {
    const [page, setPage] = useState("login");

    const handleLogout = () => {
        localStorage.removeItem("token");
        setPage("login");
    };

    if (page === "donor") {
        return (
            <div
                style={{
                    width: "100%",
                    minHeight: "100vh"
                }}
            >
                <DonorDashboard onLogout={handleLogout} />
            </div>
        );
    }

    if (page === "volunteer") {
        return (
            <div
                style={{
                    width: "100%",
                    minHeight: "100vh"
                }}
            >
                <VolunteerDashboard onLogout={handleLogout} />
            </div>
        );
    }

    if (page === "admin") {
        return (
            <div
                style={{
                    width: "100%",
                    minHeight: "100vh"
                }}
            >
                <AdminDashboard onLogout={handleLogout} />
            </div>
        );
    }

    return (
        <div
            style={{
                width: "100%",
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #e8f5e9, #f1f8e9)"
            }}
        >
            {page === "login" ? (
                <Login onLogin={(role) => setPage(role)} />
            ) : (
                <Register />
            )}

            <div
                style={{
                    textAlign: "center",
                    padding: "20px 0 30px"
                }}
            >
                <button
                    onClick={() =>
                        setPage(
                            page === "login"
                                ? "register"
                                : "login"
                        )
                    }
                    style={{
                        border: "none",
                        background: "transparent",
                        color: "#198754",
                        fontSize: "15px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    {page === "login"
                        ? "Don't have an account? Register"
                        : "Already have an account? Login"}
                </button>
            </div>
        </div>
    );
}

export default App;
