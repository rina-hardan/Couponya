import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFromServer } from "../api/ServerAPI";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import logo from "../pic/logo.png";
import "../css/Register.css";

export default function Register() {
  const [isCustomer, setIsCustomer] = useState(null);
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setIsCustomer(role === "customer");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const userData = {
      userName: formData.get("username"),
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    };

    if (isCustomer) {
      userData.birth_date = formData.get("birth_date");
      userData.address = formData.get("address");
    } else {
      userData.business_name = formData.get("business_name");
      userData.description = formData.get("description");
      userData.website_url = formData.get("website_url");
      userData.logo_url = formData.get("logo_url");
    }

    try {
      const result = await fetchFromServer("users/register", "POST", userData);
      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("currentUser", JSON.stringify(result.user));
        alert("Registration successful!");
        navigate("/home");
      }
    } catch (err) {
      alert(err.message || "Registration failed");
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

            <Box component="form" onSubmit={handleRegister} className="register-form">
              <TextField fullWidth name="username" label="Username" required />
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
                  <TextField fullWidth name="logo_url" label="Logo URL" />
                </>
              )}

              <Button type="submit" fullWidth variant="contained" className="register-button">
                Register
              </Button>

              <Typography variant="body2" className="register-link">
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
