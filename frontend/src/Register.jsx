import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Register({ onLogin, onBackHome }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("donor");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${API_URL}/api/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        role
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Registration failed");
                return;
            }

            // Go back to Login page
            onLogin();

        } catch (error) {
            console.error("Registration error:", error);
            alert("Server error");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
                background:
                    "radial-gradient(circle at 15% 20%, rgba(52, 211, 153, 0.25), transparent 30%), radial-gradient(circle at 85% 80%, rgba(16, 185, 129, 0.2), transparent 30%), linear-gradient(135deg, #064e3b, #022c22)",
                fontFamily: "Arial, sans-serif",
                padding: "30px"
            }}
        >
            {/* Background glowing shapes */}
            <div
                style={{
                    position: "absolute",
                    width: "300px",
                    height: "300px",
                    borderRadius: "50%",
                    background: "rgba(52, 211, 153, 0.12)",
                    filter: "blur(50px)",
                    top: "-80px",
                    left: "-80px"
                }}
            />

            <div
                style={{
                    position: "absolute",
                    width: "350px",
                    height: "350px",
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.10)",
                    filter: "blur(60px)",
                    bottom: "-120px",
                    right: "-100px"
                }}
            />

            {/* Back Arrow Button */}
            <button
                type="button"
                onClick={onBackHome}
                aria-label="Back to Home"
                style={{
                    position: "absolute",
                    top: "28px",
                    left: "32px",
                    width: "44px",
                    height: "44px",
                    border: "1px solid rgba(25, 135, 84, 0.2)",
                    borderRadius: "10px",
                    backgroundColor: "#ffffff",
                    color: "#198754",
                    fontSize: "24px",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    zIndex: 10,
                    lineHeight: "1"
                }}
            >
                ←
            </button>

            {/* Register Card */}
            <div
                style={{
                    width: "400px",
                    backgroundColor: "#ffffff",
                    padding: "40px",
                    borderRadius: "20px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)"
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            fontSize: "48px",
                            marginBottom: "5px"
                        }}
                    >
                        🍲
                    </div>

                    <h1
                        style={{
                            margin: 0,
                            color: "#198754",
                            fontSize: "30px"
                        }}
                    >
                        FoodShare
                    </h1>

                    <p
                        style={{
                            color: "#777",
                            marginTop: "8px",
                            marginBottom: "25px"
                        }}
                    >
                        Share food. Spread kindness.
                    </p>
                </div>

                <h2
                    style={{
                        textAlign: "center",
                        color: "#333",
                        marginBottom: "25px"
                    }}
                >
                    Create an Account
                </h2>

                <form onSubmit={handleRegister}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "7px",
                            color: "#444",
                            fontWeight: "bold"
                        }}
                    >
                        Full Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "13px",
                            marginBottom: "17px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            fontSize: "15px"
                        }}
                    />

                    <label
                        style={{
                            display: "block",
                            marginBottom: "7px",
                            color: "#444",
                            fontWeight: "bold"
                        }}
                    >
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "13px",
                            marginBottom: "17px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            fontSize: "15px"
                        }}
                    />

                    <label
                        style={{
                            display: "block",
                            marginBottom: "7px",
                            color: "#444",
                            fontWeight: "bold"
                        }}
                    >
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "13px",
                            marginBottom: "17px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            fontSize: "15px"
                        }}
                    />

                    <label
                        style={{
                            display: "block",
                            marginBottom: "7px",
                            color: "#444",
                            fontWeight: "bold"
                        }}
                    >
                        Register As
                    </label>

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "13px",
                            marginBottom: "25px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            fontSize: "15px",
                            backgroundColor: "#fff"
                        }}
                    >
                        <option value="donor">
                            🍱 Donor
                        </option>

                        <option value="volunteer">
                            🤝 Volunteer
                        </option>
                    </select>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "13px",
                            border: "none",
                            borderRadius: "8px",
                            backgroundColor: "#198754",
                            color: "#ffffff",
                            fontSize: "16px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            boxShadow:
                                "0 4px 10px rgba(25,135,84,0.25)"
                        }}
                    >
                        Create Account
                    </button>
                </form>

                {/* Login Option */}
                <div
                    style={{
                        textAlign: "center",
                        marginTop: "20px",
                        fontSize: "14px",
                        color: "#777"
                    }}
                >
                    <span>Already have an account? </span>

                    <button
                        type="button"
                        onClick={onLogin}
                        style={{
                            border: "none",
                            background: "none",
                            padding: 0,
                            color: "#198754",
                            fontSize: "14px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Login
                    </button>
                </div>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "18px",
                        color: "#888",
                        fontSize: "14px"
                    }}
                >
                    Be a part of reducing food waste 🌱
                </p>
            </div>
        </div>
    );
}

export default Register;