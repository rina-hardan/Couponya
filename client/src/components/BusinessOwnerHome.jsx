import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { useNavigate } from "react-router-dom";
import logo from "../pic/logo.png";
import "../css/BusinessOwnerHome.css";

export default function BusinessOwnerHome() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const goToProfile = () => {
    handleClose();
    navigate("/profile");
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="home-page">
      <div className="home-wrapper">
        <header className="home-header">
          <img src={logo} alt="Couponya Logo" className="home-logo" />

          <Box className="profile-section">
            <IconButton
              onClick={handleClick}
              sx={{
                backgroundColor: "#fffef5",
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "8px 16px",
                color: "#333",
                '&:hover': {
                  backgroundColor: "#fcf8e3"
                }
              }}
            >
              <BusinessCenterIcon sx={{ mr: 1 }} />
              <Typography>Hello {currentUser?.userName}</Typography>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: 3,
                  padding: 1,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
                }
              }}
            >
              <MenuItem onClick={goToProfile}>
                <AccountCircleIcon sx={{ mr: 1 }} />
                <Typography>Personal Details</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                <Typography>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </header>

        <main className="main-content">
          <Typography variant="h4" className="welcome-text">
            Welcome to your business dashboard, {currentUser?.name}!
          </Typography>
        </main>
      </div>
    </div>
  );
}
