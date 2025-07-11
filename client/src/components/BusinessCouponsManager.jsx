import React, { useState, useEffect } from "react";
import {
  Typography, Box, Button, Select, MenuItem, InputLabel, FormControl
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BusinessCouponCard from "./BusinessCouponCard";
import { useNavigate } from "react-router-dom";
import { fetchFromServer } from "../api/ServerAPI";

export default function BusinessCouponsManager() {
    const VITE_DEFAULT_LIMIT = parseInt(import.meta.env.VITE_DEFAULT_LIMIT, 10);

  const [coupons, setCoupons] = useState([]);
  const [status, setStatus] = useState("");
  const [isActive, setIsActive] = useState("");
  const [sortBy, setSortBy] = useState("expiry_date");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchCoupons = async (isNew = false) => {
    if (loading || (!isNew && !hasMore)) return;

    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (status) query.append("status", status);
      if (isActive !== "") query.append("isActive", isActive);
      query.append("sortBy", sortBy);
      query.append("sortOrder", sortOrder);
      query.append("limit", VITE_DEFAULT_LIMIT);
      query.append("page", isNew ? 1 : page);

      const data = await fetchFromServer(`/coupons/BusinessOwnerCoupons?${query}`);

      if (isNew) {
        setCoupons(data);
        setPage(2); 
        setHasMore(data.length === 10);
      } else {
        setCoupons((prev) => {
          const existingIds = new Set(prev.map(c => c.id));
          const newCoupons = data.filter(c => !existingIds.has(c.id));
          setHasMore(data.length === 10 && newCoupons.length > 0);
          return [...prev, ...newCoupons];
        });
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error loading coupons", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchCoupons(true);
  }, [status, isActive, sortBy, sortOrder]);

  // גלילה אינסופית
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 100 &&
        hasMore && !loading
      ) {
        fetchCoupons();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  const handleEdit = (coupon) => {
    const { purchasedCount, ...cleanCoupon } = coupon;
    navigate("/BusinessOwnerHome/coupon-form", { state: cleanCoupon });
  };

  return (
    <Box sx={{ px: 3, mt: 3 }}>
      <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mb={3}>
        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Active</InputLabel>
          <Select value={isActive} onChange={(e) => setIsActive(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="expiry_date">Expiry Date</MenuItem>
            <MenuItem value="discounted_price">Price</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="quantity">Quantity</MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Order</InputLabel>
          <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <MenuItem value="ASC">Ascending</MenuItem>
            <MenuItem value="DESC">Descending</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/BusinessOwnerHome/coupon-form")}
        >
          Add Coupon
        </Button>
      </Box>

      {coupons.map((coupon) => (
        <BusinessCouponCard
          key={coupon.id}
          coupon={coupon}
          onEdit={handleEdit}
        />
      ))}
      {loading && <Typography>Loading more coupons...</Typography>}
      {!hasMore && <Typography>No more coupons to load.</Typography>}
    </Box>
  );
}
