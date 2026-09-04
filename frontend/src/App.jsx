import { useState } from "react";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import DonorDashboard from "./DonorDashboard";
import VolunteerDashboard from "./VolunteerDashboard";
import AdminDashboard from "./AdminDashboard";

function App() {
    // Restore the correct page after refresh
    const [page, setPage] = useState(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const savedPage = sessionStorage.getItem("foodshare_page");

        // If user is already logged in, restore their dashboard
        if (token && role) {
            return role;
        }

        // Otherwise restore the last public page
        if (savedPage) {
            return savedPage;
        }

        // Default page
        return "home";
    });

    // Change page and remember it for refresh
    const navigateTo = (nextPage) => {
        setPage(nextPage);
        sessionStorage.setItem("foodshare_page", nextPage);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        sessionStorage.setItem("foodshare_page", "home");
        setPage("home");
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

    if (page === "home") {
        return (
            <div
                style={{
                    width: "100%",
                    minHeight: "100vh"
                }}
            >
                <Home
                    onLogin={() => navigateTo("login")}
                    onRegister={() => navigateTo("register")}
                />
            </div>
        );
    }

    if (page === "login") {
        return (
            <div
                style={{
                    width: "100%",
                    minHeight: "100vh"
                }}
            >
                <Login
                    onLogin={(role) => navigateTo(role)}
                    onRegister={() => navigateTo("register")}
                    onBackHome={() => navigateTo("home")}
                />
            </div>
        );
    }

    return (
        <div
            style={{
                width: "100%",
                minHeight: "100vh"
            }}
        >
            <Register
                onLogin={() => navigateTo("login")}
                onBackHome={() => navigateTo("home")}
            />
        </div>
    );
}

export default App;