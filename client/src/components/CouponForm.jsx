import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  CircularProgress,
  Alert
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchFromServer } from "../api/ServerAPI";

export default function CouponForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state || {};
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    category_id: "",
    region_id: "",
    title: "",
    description: "",
    original_price: "",
    discounted_price: "",
    address: "",
    code: "",
    quantity: "",
    expiry_date: "",
    is_active: true,
    status: "pending",
    ...initialData
  });
  console.log("expiry_date:", formData.expiry_date);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [cats, regs] = await Promise.all([
          fetchFromServer("/categories"),
          fetchFromServer("/regions"),
        ]);
        setCategories(Array.isArray(cats.categories) ? cats.categories : []);
        setRegions(Array.isArray(regs.regions) ? regs.regions : []);
      } catch (err) {
        console.error("Failed to fetch categories/regions", err);
        setError("Failed to load form metadata.");
      }
    };
    fetchMeta();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, is_active: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
    
      if (initialData.id) {
        await fetchFromServer(`/coupons/${initialData.id}`, "PUT", formData);
      } else {
        await fetchFromServer("/coupons", "POST", formData);
      }

      navigate("/BusinessOwnerHome");
    } catch (err) {
      console.error("Submit failed:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: "100%", margin: "auto", mt: 5 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        {initialData?.id ? "Edit Coupon" : "Add New Coupon"}
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        required
        multiline
        rows={3}
        margin="normal"
      />
      <TextField
        label="Original Price"
        name="original_price"
        type="number"
        value={formData.original_price}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Discounted Price"
        name="discounted_price"
        type="number"
        value={formData.discounted_price}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Code"
        name="code"
        value={formData.code}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Quantity"
        name="quantity"
        type="number"
        value={formData.quantity}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Expiry Date"
        name="expiry_date"
        type="date"
        value={new Date(formData.expiry_date).toISOString().split("T")[0]}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />

      <TextField
        select
        label="Category"
        name="category_id"
        value={formData.category_id}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      >
        <MenuItem value="">Select Category</MenuItem>
        {categories?.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Region"
        name="region_id"
        value={formData.region_id}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      >
        <MenuItem value="">Select Region</MenuItem>
        {regions?.map((reg) => (
          <MenuItem key={reg.id} value={reg.id}>
            {reg.name}
          </MenuItem>
        ))}
      </TextField>

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.is_active}
            onChange={handleCheckboxChange}
          />
        }
        label="Active"
        sx={{ mt: 1 }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        sx={{ mt: 3 }}
      >
        {loading ? <CircularProgress size={24} /> : initialData?.id ? "Update Coupon" : "Create Coupon"}
      </Button>
    </Box>
  );
}
