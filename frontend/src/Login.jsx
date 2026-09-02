import { useState } from "react";
const API_URL = "https://food-donation-system-jzpj.onrender.com";

function Login({ onLogin }) {
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

            alert("Login successful");
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
                background:
                    "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
                fontFamily: "Arial, sans-serif"
            }}
        >
            <div
                style={{
                    width: "380px",
                    backgroundColor: "#ffffff",
                    padding: "40px",
                    borderRadius: "18px",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.12)"
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            fontSize: "45px",
                            marginBottom: "10px"
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
                            marginBottom: "30px"
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
                    Welcome Back
                </h2>

                <form onSubmit={handleLogin}>
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
                            marginBottom: "18px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            fontSize: "15px",
                            outline: "none"
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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "13px",
                            marginBottom: "25px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            fontSize: "15px",
                            outline: "none"
                        }}
                    />

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
                            cursor: "pointer"
                        }}
                    >
                        Login
                    </button>
                </form>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "25px",
                        color: "#888",
                        fontSize: "14px"
                    }}
                >
                    Together we can reduce food waste ❤️
                </p>
            </div>
        </div>
    );
}

export default Login;
