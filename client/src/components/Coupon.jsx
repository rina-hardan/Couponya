
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CardMedia,
  Divider,
  Grid,
  Button,
  IconButton,
} from "@mui/material";
import {
  CalendarToday,
  AttachMoney,
  Inventory,
  LocationOn,
  Add,
  Remove,
} from "@mui/icons-material";
import { fetchFromServer } from "../api/ServerAPI"; // פונקציה לשליחת בקשות לשרת
const Coupon = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const coupon = location.state?.coupon;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!coupon) navigate("/coupons");
  }, [coupon, navigate]);

  if (!coupon) return null;

  const increaseQty = () => {
    if (quantity < coupon.quantity) setQuantity((q) => q + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const totalPrice = quantity * coupon.discounted_price;

  const handleAddToCart = async (coupon) => {
    try {
      const response = await fetchFromServer("cart/add", "POST", {
        couponId: coupon.id, quantity: quantity, title: coupon.title, pricePerUnit: coupon.discounted_price
      })

      navigate("/CustomerHome");
    } catch (error) { console.error("Error adding to cart:", error); alert("Failed to add coupon to cart. Please try again later."); }
  };
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box textAlign="center" mb={4}>
        <CardMedia
          component="img"
          image={
            coupon.logo_url ? `${BASE_URL}${coupon.logo_url}` : "/default_logo.png"
          }
          alt="Business Logo"
          sx={{ width: 160, height: 160, mx: "auto", borderRadius: "50%" }}
        />
        <Typography variant="h4" fontWeight={600} mt={2}>
          {coupon.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {coupon.business_name}
        </Typography>
        {coupon.website_url && (
          <Typography
            variant="body2"
            color="primary"
            mt={1}
            component="a"
            href={coupon.website_url.startsWith("http")
              ? coupon.website_url
              : `https://${coupon.website_url}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textDecoration: "underline" }}
          >
            {coupon.website_url}
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box dir="rtl">
        <Typography variant="h5" fontWeight={600} gutterBottom>
          תיאור הקופון
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4}>
          {coupon.description}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <AttachMoney color="action" />
              <Typography variant="body1" fontWeight={500}>
                מחיר מקורי:
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <s>{coupon.original_price} ₪</s>
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <AttachMoney color="primary" />
              <Typography variant="body1" fontWeight={500}>
                מחיר בהנחה:
              </Typography>
              <Typography variant="body1" color="primary" fontWeight={600}>
                {coupon.discounted_price} ₪
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <Inventory color="action" />
              <Typography variant="body1" fontWeight={500}>
                כמות זמינה:
              </Typography>
              <Typography variant="body1">{coupon.quantity}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarToday color="action" />
              <Typography variant="body1" fontWeight={500}>
                בתוקף עד:
              </Typography>
              <Typography variant="body1">
                {new Date(coupon.expiry_date).toLocaleDateString("he-IL")}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationOn color="action" />
              <Typography variant="body1" fontWeight={500}>
                כתובת:
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {coupon.address}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              mt={2}
            >
              <IconButton onClick={decreaseQty} disabled={quantity === 1}>
                <Remove />
              </IconButton>
              <Typography variant="h6">{quantity}</Typography>
              <IconButton onClick={increaseQty} disabled={quantity >= coupon.quantity}>
                <Add />
              </IconButton>
              <Typography variant="h6">
                סה"כ: {totalPrice} ₪
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box textAlign="center" mt={5}>

          <Button variant="contained" color="primary" size="large" onClick={() => handleAddToCart(coupon)} disabled={coupon.quantity === 0}
          >
            הוסף לסל
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Coupon;
