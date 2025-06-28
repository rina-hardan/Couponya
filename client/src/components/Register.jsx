import { useState, useEffect } from "react";
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
  const [regions, setRegions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // שגיאה שתוצג למשתמש
  const [errorList, setErrorList] = useState([]);

  const handleRegions = async () => {
    try {
      const response = await fetchFromServer("regions/", "GET");
      setRegions(response.regions); // בהנחה ש־res מחזיר מערך של אזורים
    } catch (err) {
      console.error("Failed to fetch regions", err);
    }
  };

  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setIsCustomer(role === "customer");
    if (role === "customer") {
      handleRegions();
    }
  };
  const validateForm = (formData, isCustomer, logoFile) => {
    let errors = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const getField = (name) => formData.get(name)?.trim();

    const userName = getField("userName");
    const name = getField("name");
    const email = getField("email");
    const password = getField("password");
    const role = getField("role");
    const website_url = getField("website_url");

    if (!userName) errors.push({ msg: "Username is required" });
    if (!name) errors.push({ msg: "Full name is required" });
    if (!email || !emailRegex.test(email)) errors.push({ msg: "Valid email is required" });
    if (!password || password.length < 6) errors.push({ msg: "Password must be at least 6 characters" });
    if (!["customer", "business_owner"].includes(role))
      errors.push({ msg: "Role must be customer or business_owner" });

    if (isCustomer) {
      const birth_date = getField("birth_date");
      const region_id = getField("region_id");

      if (!birth_date) {
        errors.push({ msg: "Birth date is required" });
      } else if (isNaN(Date.parse(birth_date))) {
        errors.push({ msg: "Birth date must be a valid date" });
      }

      if (!region_id || isNaN(region_id) || parseInt(region_id) <= 0) {
        errors.push({ msg: "Region ID must be a positive number" });
      }
    }

    if (!isCustomer) {
      const business_name = getField("business_name");
      const description = getField("description");

      if (!business_name) errors.push({ msg: "Business name is required" });
      if (!description) errors.push({ msg: "Business description is required" });

      if (website_url && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(website_url)) {
        errors.push({ msg: "Website URL must be valid" });
      }

      if (!logoFile) {
        errors.push({ msg: "Logo is required" });
      }
    }

    return errors;
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    const errors = validateForm(formData, isCustomer, logoFile);
    if (errors.length > 0) {
      setErrorList(errors);
      setErrorMessage("");
      return;
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
      if (Array.isArray(err?.response?.data?.message)) {
        setErrorList(err.response.data.message);
        setErrorMessage("");

      } else {
        setErrorMessage(err?.response?.data?.message || "Registration failed");
        setErrorList([]);

      }

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

            {errorMessage && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {errorMessage}
              </Alert>
            )}


            {errorList.length > 0 && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  {errorList.map((err, idx) => (
                    <li key={idx}>{err.msg || err}</li>
                  ))}
                </ul>
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
                  <TextField
                    select
                    fullWidth
                    name="region_id"
                    label="Region"
                    required
                  >
                    {regions.map((region) => (
                      <MenuItem key={region.id} value={region.id}>
                        {region.name}
                      </MenuItem>
                    ))}
                  </TextField>
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
