import { useState } from "react";

const API_URL = "https://food-donation-system-jzpj.onrender.com";

function Login({ onLogin, onRegister, onBackHome }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            console.log("Login successful:", data);

            localStorage.setItem("token", data.token);
            onLogin(data.user.role);

            
        } catch (error) {
            console.error("Login error:", error);
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
                fontFamily: "Arial, sans-serif"
            }}
        >
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
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "10px",
                    backgroundColor: "#ffffff",
                    color: "#047857",
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

            {/* Login Card */}
            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    width: "380px",
                    backgroundColor: "#fffdf7",
                    padding: "40px",
                    borderRadius: "20px",
                    boxShadow:
                        "0 20px 60px rgba(0, 0, 0, 0.35)"
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            fontSize: "42px",
                            marginBottom: "8px"
                        }}
                    >
                        🍲
                    </div>

                    <h1
                        style={{
                            margin: 0,
                            color: "#047857",
                            fontSize: "30px",
                            fontWeight: "700"
                        }}
                    >
                        FoodShare
                    </h1>

                    <p
                        style={{
                            color: "#6b7280",
                            marginTop: "8px",
                            marginBottom: "28px"
                        }}
                    >
                        Share food. Spread kindness.
                    </p>
                </div>

                <h2
                    style={{
                        textAlign: "center",
                        color: "#1f2937",
                        marginBottom: "25px"
                    }}
                >
                    Welcome Back
                </h2>

                <form onSubmit={handleLogin}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "7px",
                            color: "#374151",
                            fontWeight: "600"
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
                            marginBottom: "18px",
                            border: "1px solid #d1d5db",
                            borderRadius: "9px",
                            fontSize: "15px",
                            outline: "none",
                            backgroundColor: "#ffffff"
                        }}
                    />

                    <label
                        style={{
                            display: "block",
                            marginBottom: "7px",
                            color: "#374151",
                            fontWeight: "600"
                        }}
                    >
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "13px",
                            marginBottom: "22px",
                            border: "1px solid #d1d5db",
                            borderRadius: "9px",
                            fontSize: "15px",
                            outline: "none",
                            backgroundColor: "#ffffff"
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "13px",
                            border: "none",
                            borderRadius: "9px",
                            backgroundColor: "#047857",
                            color: "#ffffff",
                            fontSize: "16px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            boxShadow: "0 5px 15px rgba(4, 120, 87, 0.25)"
                        }}
                    >
                        Login
                    </button>
                </form>

                {/* Register Option */}
                <p
                    style={{
                        textAlign: "center",
                        marginTop: "22px",
                        marginBottom: "0",
                        color: "#6b7280",
                        fontSize: "14px"
                    }}
                >
                    Don't have an account?{" "}
                    <span
                        onClick={onRegister}
                        style={{
                            color: "#047857",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                    >
                        Register
                    </span>
                </p>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "18px",
                        color: "#9ca3af",
                        fontSize: "13px"
                    }}
                >
                    Together we can reduce food waste ❤️
                </p>
            </div>
        </div>
    );
}

export default Login;