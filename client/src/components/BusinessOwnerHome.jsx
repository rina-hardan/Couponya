import React, { useState, useEffect } from "react";
import {
  Box, Typography, IconButton, Menu, MenuItem, Divider,
  TextField, Button, Select, InputLabel, FormControl
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AddIcon from "@mui/icons-material/Add";
import logo from "../pic/logo.png";
import "../css/BusinessOwnerHome.css";
import BusinessCouponCard from "../components/BusinessCouponCard";
import { useNavigate } from "react-router-dom";
import { fetchFromServer } from "../api/ServerAPI";
import { Outlet } from "react-router-dom";

export default function BusinessOwnerHome() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [status, setStatus] = useState("");
  const [isActive, setIsActive] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    localStorage.clear();
    navigate("/login");
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (status) query.append("status", status);
      if (isActive !== "") query.append("isActive", isActive);
      query.append("limit", 50);

      const data = await fetchFromServer(`/coupons/BusinessOwnerCoupons?${query}`);

      

      setCoupons(data);
    } catch (err) {
      console.error("Error loading coupons", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (location.pathname.includes("coupon-form")) return;
    fetchCoupons();
  }, [status, isActive,location.pathname]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await fetchFromServer(`/coupons/${id}`, "DELETE");
      fetchCoupons();
    } catch (err) {
      console.error("Failed to delete coupon", err);
    }
  };

  const handleEdit = (coupon) => {
const { purchasedCount, ...cleanCoupon } = coupon;
navigate("/BusinessOwnerHome/coupon-form", { state: cleanCoupon });
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
          <Typography variant="h4" gutterBottom>
            Welcome to your dashboard, {currentUser?.name}
          </Typography>

          <Box display="flex" gap={2} alignItems="center" mb={3}>
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)} native>
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel>Active</InputLabel>
              <Select value={isActive} onChange={(e) => setIsActive(e.target.value)} native>
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/BusinessOwnerHome/coupon-form", { state: null })}
            >
              Add Coupon
            </Button>
          </Box>

          {loading ? (
            <Typography>Loading coupons...</Typography>
          ) : (
            coupons.map((coupon) => (
              <BusinessCouponCard
                key={coupon.id}
                coupon={coupon}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
          <Outlet />

        </main>
      </div>
    </div>
  );
}
