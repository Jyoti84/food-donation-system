import { useState } from "react";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import DonorDashboard from "./DonorDashboard";
import VolunteerDashboard from "./VolunteerDashboard";
import AdminDashboard from "./AdminDashboard";

function App() {
    const [page, setPage] = useState("home");

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

    if (page === "home") {
        return (
            <div
                style={{
                    width: "100%",
                    minHeight: "100vh"
                }}
            >
                <Home
                    onLogin={() => setPage("login")}
                    onRegister={() => setPage("register")}
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
                    onLogin={(role) => setPage(role)}
                    onRegister={() => setPage("register")}
                    onBackHome={() => setPage("home")}
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
                onLogin={() => setPage("login")}
                onBackHome={() => setPage("home")}
            />
            
        </div>
    );
}

export default App;
