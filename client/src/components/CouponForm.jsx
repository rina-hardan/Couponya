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
  Alert,
  Paper
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

  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

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
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, is_active: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const requiredFields = [
      "title",
      "description",
      "original_price",
      "discounted_price",
      "address",
      "code",
      "quantity",
      "expiry_date",
      "category_id",
      "region_id"
    ];

    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
        const formattedDate = new Date(formData.expiry_date).toISOString().split("T")[0];
        setFormData((prev) => ({
          ...prev,
          expiry_date: formattedDate,
        }));

      if (initialData.id) {
          for(var key in formData) {
            if (formData[key] === initialData[key]) {
              delete formData[key];
            }
          }
        await fetchFromServer(`/coupons/${initialData.id}`, "PUT", formData);
      } else {
        await fetchFromServer("/coupons/create", "POST", formData);
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
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f4f6f8", display: "flex", justifyContent: "center", alignItems: "start", py: 6 }}>
      <Paper elevation={4} sx={{ p: 4, width: "100%", maxWidth: 500 }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          {initialData?.id ? "Edit Coupon" : "Add New Coupon"}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {Object.keys(fieldErrors).length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please fill in all required fields.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            margin="dense"
            error={!!fieldErrors.title}
            helperText={fieldErrors.title}
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
            margin="dense"
            error={!!fieldErrors.description}
            helperText={fieldErrors.description}
          />
          <TextField
            label="Original Price"
            name="original_price"
            type="number"
            value={formData.original_price}
            onChange={handleChange}
            fullWidth
            required
            margin="dense"
            error={!!fieldErrors.original_price}
            helperText={fieldErrors.original_price}
          />
          <TextField
            label="Discounted Price"
            name="discounted_price"
            type="number"
            value={formData.discounted_price}
            onChange={handleChange}
            fullWidth
            required
            margin="dense"
            error={!!fieldErrors.discounted_price}
            helperText={fieldErrors.discounted_price}
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            required
            margin="dense"
            error={!!fieldErrors.address}
            helperText={fieldErrors.address}
          />
          <TextField
            label="Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            fullWidth
            required
            margin="dense"
            error={!!fieldErrors.code}
            helperText={fieldErrors.code}
          />
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            fullWidth
            required
            margin="dense"
            error={!!fieldErrors.quantity}
            helperText={fieldErrors.quantity}
            onWheel={(e) => e.target.blur()} // ⬅ זה מבטל את גלילת העכבר על השדה

          />
          <TextField
            label="Expiry Date"
            name="expiry_date"
            type="date"
            value={formData.expiry_date?.split("T")[0] || ""}
            onChange={handleChange}
            fullWidth
            required
            margin="dense"
            error={!!fieldErrors.expiry_date}
            helperText={fieldErrors.expiry_date}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Category"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            fullWidth
            required
            margin="dense"
            error={!!fieldErrors.category_id}
            helperText={fieldErrors.category_id}
          >
            <MenuItem value="">Select Category</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
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
            margin="dense"
            error={!!fieldErrors.region_id}
            helperText={fieldErrors.region_id}
          >
            <MenuItem value="">Select Region</MenuItem>
            {regions.map((reg) => (
              <MenuItem key={reg.id} value={reg.id}>{reg.name}</MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={<Checkbox checked={formData.is_active} onChange={handleCheckboxChange} />}
            label="Active"
            sx={{ mt: 1 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : initialData?.id ? "Update Coupon" : "Create Coupon"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
