
import React, { useState } from "react";
import {
  Box, Typography, IconButton, Menu, MenuItem, Divider
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import logo from "../pic/logo.png";
import "../css/BusinessOwnerHome.css";
import { useNavigate, Outlet } from "react-router-dom";

export default function BusinessOwnerHome() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="home-page">
      <div className="home-wrapper">
        <header className="home-header">
          <img src={logo} alt="Couponya Logo" className="home-logo" />

          <Box className="profile-section">
            <IconButton onClick={handleClick}>
              <BusinessCenterIcon sx={{ mr: 1 }} />
              <Typography>Hello {currentUser?.userName}</Typography>
            </IconButton>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={() => navigate("/profile")}>
                <AccountCircleIcon sx={{ mr: 1 }} />
                Personal Details
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
