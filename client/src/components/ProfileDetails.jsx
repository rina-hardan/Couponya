import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box
} from "@mui/material";
import "../css/ProfileDetails.css";
import { fetchFromServer } from "../api/ServerAPI";

const ProfileDetails = () => {
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  const [formData, setFormData] = useState({});

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
    try {
      const result = await fetchFromServer("/users/update", "PUT", formData);
        alert("Updated successfully");
        if(result.user.role === "customer") {
          navigate("/CustomerHome");
        }
        else if(result.user.role === "business_owner") {
          navigate("/BusinessOwnerHome");
      } else {
        alert(result.error || "Update failed");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box className="profile-container">
        <Typography variant="h4" className="profile-title" gutterBottom>
          My Profile
        </Typography>
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
