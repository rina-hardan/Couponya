import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFromServer } from "../api/ServerAPI";
import logo from '../pic/logo.png';
import "../css/Login.css";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const result = await fetchFromServer("users/login", "POST", {
                email,
                password,
            });

            if (result.token) {
                localStorage.setItem("token", result.token);
                alert("Login successful!");
                navigate("/home");
            }
        } catch (error) {
            alert(error.message || "Login failed. Please try again.");
            console.error("Login error:", error);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <img src={logo} alt="Couponya Logo" className="logo" />
                <h2>Login</h2>
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="submit-btn">Login</button>
                    <p className="register-link">
                        Don't have an account? <span onClick={() => navigate("/register")}>Sign up here</span>
                    </p>
                </form>
            </div>
        </div>
    );
}
