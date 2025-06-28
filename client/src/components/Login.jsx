import { useState,useEffect } from "react";
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
  Link,
  Alert,
} from "@mui/material";
import "../css/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorList, setErrorList] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    window.history.replaceState(null, "", window.location.href);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage("");
      setErrorList([]);

      const result = await fetchFromServer("users/login", "POST", {
        email,
        password,
      });

      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("currentUser", JSON.stringify(result.user));

        if (result.user.role === "customer") {
          navigate("/CustomerHome");
        } else if (result.user.role === "business_owner") {
          navigate("/BusinessOwnerHome");
        } else if (result.user.role === "admin") {
          navigate("/AdminHome");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      const message = error.response?.data?.message;

      if (Array.isArray(message)) {
        setErrorList(message);
        setErrorMessage("");
      } else {
        setErrorMessage(message || error.message || "Login failed.");
        setErrorList([]);
      }
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

            {/* הודעת שגיאה אחת */}
            {errorMessage && (
              <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
                {errorMessage}
              </Alert>
            )}

            {/* כמה הודעות שגיאה */}
            {errorList.length > 0 && (
              <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  {errorList.map((err, idx) => (
                    <li key={idx}>{err.msg || err}</li>
                  ))}
                </ul>
              </Alert>
            )}

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
              <Typography variant="body2" sx={{ mt: 2 }}>
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
