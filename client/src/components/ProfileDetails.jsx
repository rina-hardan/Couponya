import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import "../css/ProfileDetails.css";
import { fetchFromServer } from "../api/ServerAPI";
import { useNavigate } from "react-router-dom";

const ProfileDetails = () => {
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const isCustomer = user.role === "customer";
  const isBusinessOwner = user.role === "business_owner";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await fetchFromServer("/users/update", "PUT", formData);

      setSuccessMessage("Updated successfully");
      console.log("Update result:", result);
      const updatedUser = {
        ...user,
        ...formData  
      };

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      if (user.role === "customer") {
        navigate("/CustomerHome");
      } else if (user.role === "business_owner") {
        navigate("/BusinessOwnerHome");
      }
    } catch (err) {
      console.error("Error:", err);
      setErrorMessage(err.message || "Server error");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box className="profile-container">
        <Typography variant="h4" className="profile-title" gutterBottom>
          My Profile
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <form onSubmit={handleUpdate}>
          <TextField
            label="Full Name"
            name="name"
            defaultValue={user.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Username"
            name="userName"
            defaultValue={user.userName}
            fullWidth
            disabled
            margin="normal"
          />

          <TextField
            label="Email"
            name="email"
            defaultValue={user.email}
            fullWidth
            disabled
            margin="normal"
          />

          {isCustomer && (
            <>
              <TextField
                label="Address"
                name="address"
                defaultValue={user.address || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Birth Date"
                name="birth_date"
                value={user.birth_date?.split("T")[0] || ""}
                disabled
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </>
          )}

          {isBusinessOwner && (
            <>
              <TextField
                label="Business Name"
                name="business_name"
                defaultValue={user.business_name || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                name="description"
                defaultValue={user.description || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Website URL"
                name="website_url"
                defaultValue={user.website_url || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Logo URL"
                name="logo_url"
                defaultValue={user.logo_url || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </>
          )}

          <Button type="submit" variant="contained" className="save-button" fullWidth>
            Save Changes
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ProfileDetails;
