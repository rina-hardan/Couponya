import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { Category, CheckCircle } from "@mui/icons-material";
import logo from "../pic/logo.png";
import "../css/CustomerHome.css"; 

export default function AdminHome() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-wrapper">
        <header className="home-header">
          <img src={logo} alt="Couponya Logo" className="home-logo" />

          <Box className="profile-section" sx={{ flexDirection: "row", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<CheckCircle />}
              onClick={() => navigate("unconfirmed-coupons")}
            >
              נהל קופונים
            </Button>
            <Button
              variant="contained"
              startIcon={<Category />}
              onClick={() => navigate("manage-categories")}
            >
              נהל קטגוריות
            </Button>
          </Box>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
