import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFromServer } from "../api/ServerAPI";
import logo from "../pic/logo.png";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
  Link,
} from "@mui/material";
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
        localStorage.setItem("currentUser", JSON.stringify(result.user));
         alert("Login successful!");
        if (result.user.role === "customer") {
          navigate("/CustomerHome");
        } else if (result.user.role === "business_owner") 
          {navigate("/BusinessOwnerHome"); }
      }
    } catch (error) {
      alert(error.message || "Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <Box className="login-page">
      <Container maxWidth="xs">
        <Paper elevation={4} className="login-paper">
          <Box display="flex" flexDirection="column" alignItems="center">
            <div className="login-logo-wrapper">
              <img src={logo} alt="Couponya Logo" />
            </div>
            <Typography component="h1" variant="h5" className="login-title">
              Welcome to Couponya
            </Typography>

            <Box component="form" onSubmit={handleLogin} className="login-form">
              <TextField
                required
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  sx: { borderRadius: "25px" },
                }}
              />
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  sx: { borderRadius: "25px" },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="login-button"
              >
                Login
              </Button>
              <Typography variant="body2" >
                Don't have an account?{" "}
                <Link onClick={() => navigate("/register")} className="login-link">
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
