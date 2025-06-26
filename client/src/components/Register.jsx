import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Link,
  Alert,
} from "@mui/material";
import logo from "../pic/logo.png";
import "../css/Register.css";
import { fetchFromServer } from "../api/ServerAPI";

export default function Register() {
  const [isCustomer, setIsCustomer] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // שגיאה שתוצג למשתמש
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setIsCustomer(role === "customer");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      setErrorMessage(""); 

      const result = await fetchFromServer("users/register", "POST", formData);

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
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Registration failed");
    }
  };

  return (
    <Box className="register-page">
      <Container maxWidth="xs">
        <CssBaseline />
        <Paper elevation={4} className="register-paper">
          <Box display="flex" flexDirection="column" alignItems="center">
            <div className="register-logo-wrapper">
              <img src={logo} alt="Couponya Logo" />
            </div>
            <Typography component="h1" variant="h5" className="register-title">
              Welcome to Couponya
            </Typography>
            <Typography variant="body2" className="register-subtitle">
              Create your account
            </Typography>

            {/* הודעת שגיאה */}
            {errorMessage && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleRegister} className="register-form">
              <TextField fullWidth name="userName" label="Username" required />
              <TextField fullWidth name="name" label="Full Name" required />
              <TextField fullWidth name="email" label="Email" type="email" required />
              <TextField fullWidth name="password" label="Password" type="password" required />

              <TextField
                fullWidth
                select
                name="role"
                label="Select Role"
                required
                onChange={handleRoleChange}
              >
                <MenuItem value="">-- Choose Role --</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="business_owner">Business Owner</MenuItem>
              </TextField>

              {isCustomer && (
                <>
                  <TextField fullWidth name="birth_date" label="Birth Date" type="date" InputLabelProps={{ shrink: true }} required />
                  <TextField fullWidth name="address" label="Address" required />
                </>
              )}

              {isCustomer === false && (
                <>
                  <TextField fullWidth name="business_name" label="Business Name" required />
                  <TextField fullWidth name="description" label="Description" multiline rows={3} />
                  <TextField fullWidth name="website_url" label="Website URL" />

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Upload Logo
                  </Typography>
                  <input
                    type="file"
                    name="logo"
                    id="logo"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files[0])}
                    required
                  />
                </>
              )}

              <Button type="submit" fullWidth variant="contained" className="register-button" sx={{ mt: 2 }}>
                Register
              </Button>

              <Typography variant="body2" className="register-link" sx={{ mt: 2 }}>
                Already have an account?{" "}
                <Link onClick={() => navigate("/login")} className="login-nav-link">
                  Login here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
