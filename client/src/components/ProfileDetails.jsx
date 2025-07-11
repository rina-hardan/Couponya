import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  MenuItem,
  Alert,
} from "@mui/material";
import "../css/ProfileDetails.css";
import { fetchFromServer } from "../api/ServerAPI";
import { useNavigate } from "react-router-dom";


const ProfileDetails = () => {
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [errorList, setErrorList] = useState([]);
  const [regions, setRegions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  const navigate = useNavigate();

  const isCustomer = user.role === "customer";
  const isBusinessOwner = user.role === "business_owner";

  useEffect(() => {
    if (isCustomer) {
      const fetchRegions = async () => {
        try {
          const response = await fetchFromServer("regions/", "GET");
          setRegions(response.regions || []);
        } catch (error) {
          console.error("Failed to fetch regions:", error);
        }
      };
      fetchRegions();
    }
  }, [isCustomer]);
  const validateFormData = () => {
    const errors = [];

    if (isCustomer && (formData.region_id &&formData.region_id <= 0)) {
      errors.push({ msg: "Please select a valid region." });
    }
    if (isBusinessOwner) {
      if (formData.business_name && formData.business_name?.trim() === "") {
        errors.push({ msg: "Business name is required." });
      }
      if (formData.website_url && !isValidURL(formData.website_url)) {
        errors.push({ msg: "Website URL must be valid." });
      }
    }
    if (formData.name !== undefined && formData.name.trim() === "") {
      errors.push({ msg: "Name cannot be empty." });
    }

    return errors;
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

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
    setErrorList([]);
    setSuccessMessage("");

    const validationErrors = validateFormData();
    if (validationErrors.length > 0) {
      setErrorList(validationErrors);
      return;
    }

    const dataToSend = new FormData();

    for (const key in formData) {
      if (formData[key]) dataToSend.append(key, formData[key]);
    }


    if (logoFile) {
      dataToSend.append("logo", logoFile);
    }

    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await fetchFromServer("/users/update", "PUT", dataToSend);

      if (result.user) {
        localStorage.setItem("currentUser", JSON.stringify(result.user));
      }

      setSuccessMessage("Updated successfully");
      alert("Updated successfully");

      if (user.role === "customer") {
        navigate("/CustomerHome");
      } else if (user.role === "business_owner") {
        navigate("/BusinessOwnerHome");
      }
    } catch (error) {
      console.error("Error:", error);
      const message = error.response?.data?.message;

      if (Array.isArray(message)) {
        setErrorList(message);
        setErrorMessage("");
      } else {
        setErrorMessage(message || error.message || "Login failed.");
        setErrorList([]);
      }
      setErrorMessage(err.message || "Server error");
    }
  };

  return (
   <div className="profile-page">
  <Container maxWidth="sm" >
    <Box className="profile-container">
        <Typography variant="h4" className="profile-title" gutterBottom>
          My Profile
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        {errorList.length > 0 && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {errorList.map((err, idx) => (
                <li key={idx}>{err.msg || err}</li>
              ))}
            </ul>
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
                select
                label="Region"
                name="region_id"
                value={formData.region_id || user.region_id || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              >
                {regions.map((region) => (
                  <MenuItem key={region.id} value={region.id}>
                    {region.name}
                  </MenuItem>
                ))}
              </TextField>

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

              <Typography variant="body2" sx={{ mt: 2 }}>
                Upload New Logo
              </Typography>
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files[0])}
              />
              {user.logo_url && (
                <Box mt={2}>
                  <Typography variant="caption">Current Logo:</Typography>
                  <img
                    src={import.meta.env.VITE_API_BASE_URL + user.logo_url}
                    alt="Current Logo"
                    style={{ maxWidth: "100%", height: "100px" }}
                  />
                </Box>
              )}
            </>
          )}

          <Button type="submit" variant="contained" className="save-button" fullWidth sx={{ mt: 3 }}>
            Save Changes
          </Button>
        </form>
      </Box>
    </Container>
    </div>
  );
};

export default ProfileDetails;
