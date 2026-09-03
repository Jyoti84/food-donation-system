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
                minHeight: "100vh"
            }}
        >
            {page === "login" ? (
                <Login
                    onLogin={(role) => setPage(role)}
                    onRegister={() => setPage("register")}
                />
            ) : (
                <Register onLogin={() => setPage("login")} />
            )}
        </div>
    );
}

export default App;