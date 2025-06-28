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
import "../css/UnconfirmedCoupons.css";

const UnconfirmedCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorList, setErrorList] = useState([]);

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
      const message = error.response?.data?.message;
      if (Array.isArray(message)) {
        setErrorList(message);
        setErrorMessage("");
      } else {
        setErrorMessage(message || error.message || "Login failed.");
        setErrorList([]);
      }
    }
    setConfirming(null);
  };

  useEffect(() => {
    fetchUnconfirmed();
  }, []);

  return (
    <Box className="unconfirmed-page">
      <div className="unconfirmed-wrapper">
        <Typography variant="h4" className="unconfirmed-title">
          קופונים ממתינים לאישור
        </Typography>

        {errorMessage && (
          <Alert severity="error" className="unconfirmed-alert">
            {errorMessage}
          </Alert>
        )}

        {errorList.length > 0 && (
          <Alert severity="error" className="unconfirmed-alert">
            <ul>
              {errorList.map((err, idx) => (
                <li key={idx}>{err.msg || err}</li>
              ))}
            </ul>
          </Alert>
        )}

        {loading ? (
          <Box className="loading-spinner">
            <CircularProgress />
          </Box>
        ) : coupons.length === 0 ? (
          <Typography className="no-coupons-text">
            אין קופונים לאישור כרגע.
          </Typography>
        ) : (
          coupons.map((coupon) => (
            <Card key={coupon.id} className="coupon-card">
              <CardContent>
                <Typography variant="h6">{coupon.title}</Typography>
                <Typography variant="body2" className="coupon-description">
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
      </div>
    </Box>
  );
};

export default UnconfirmedCoupons;
