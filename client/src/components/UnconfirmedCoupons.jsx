import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { fetchFromServer } from "../api/ServerAPI";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const UnconfirmedCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // הודעת שגיאה

  const fetchUnconfirmed = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const data = await fetchFromServer("/coupons/unconfirmedCoupons");
      setCoupons(data);
    } catch (error) {
      console.error("Error fetching unconfirmed coupons:", error);
      setErrorMessage(error.message || "Failed to load unconfirmed coupons");
    }
    setLoading(false);
  };

  const handleConfirm = async (couponId) => {
    setErrorMessage("");
    setConfirming(couponId);
    try {
      await fetchFromServer(`/coupons/confirmCoupon/${couponId}`, "PUT");
      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    } catch (error) {
      console.error("Error confirming coupon:", error);
      setErrorMessage(error.message || "Failed to confirm the coupon");
    }
    setConfirming(null);
  };

  useEffect(() => {
    fetchUnconfirmed();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        קופונים ממתינים לאישור
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : coupons.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          אין קופונים לאישור כרגע.
        </Typography>
      ) : (
        coupons.map((coupon) => (
          <Card key={coupon.id} sx={{ mb: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">{coupon.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {coupon.description}
              </Typography>
              <Typography variant="body2">
                מחיר: <s>{coupon.original_price} ₪</s> → {coupon.discounted_price} ₪ | מלאי: {coupon.quantity}
              </Typography>
              <Typography variant="body2" color="primary">
                בתוקף עד: {new Date(coupon.expiry_date).toLocaleDateString("he-IL")}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                onClick={() => handleConfirm(coupon.id)}
                disabled={confirming === coupon.id}
              >
                {confirming === coupon.id ? "מאשר..." : "אשר קופון"}
              </Button>
            </CardActions>
          </Card>
        ))
      )}
    </Box>
  );
};

export default UnconfirmedCoupons;
