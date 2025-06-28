import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Box, Typography, Button, Alert } from "@mui/material"; // הוספתי את ה-importים החסרים
import { fetchFromServer } from "../api/ServerAPI"; // פונקציה לשליחת בקשות לשרת
export default function Checkout() {
  const location = useLocation();
  const { cartItems, userPoints, customerBirthDate } = location.state || {}; // לשלוף את הנתונים מה-state

  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [errorList, setErrorList] = useState([]); // רשימת שגיאות אם יש מערך

  const [usePoints, setUsePoints] = useState(false);
  const navigate = useNavigate();

  const validateCreditCard = () => {
    const cardRegex = /^[0-9]{16}$/;
    if (!cardRegex.test(creditCardNumber)) {
      setError("Invalid credit card number. It should be 16 digits.");
      return false;
    }
    return true;
  };
  const validateExpirationDate = () => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expirationDate)) {
      setError("Expiration date must be in MM/YY format.");
      return false;
    }

    const [month, year] = expirationDate.split("/").map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // last 2 digits
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      setError("Card has expired.");
      return false;
    }

    return true;
  };
  const validateCVV = () => {
    const cvvRegex = /^[0-9]{3,4}$/;
    if (!cvvRegex.test(cvv)) {
      setError("CVV must be 3 or 4 digits.");
      return false;
    }
    return true;
  };
  const handleCheckout = async () => {
    setError("");
    setErrorList([]);

    if (
      !validateCreditCard() ||
      !validateExpirationDate() ||
      !validateCVV()
    ) return;
    console.log("Cart Items:", cartItems);
    const items = cartItems.map(item => ({
      couponId: item.coupon_id,
      quantity: item.quantity,
      pricePerUnit: parseFloat(item.price_per_unit),
    }));
    const orderDetails = {
      items: items,
      usePoints: usePoints,
      customerBirthDate: customerBirthDate,
    };
    try {
      const response = await fetchFromServer("order/create", "POST", orderDetails);
      console.log("Order created successfully:", response);
      alert("Payment successful! Your order has been created.");
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      if (currentUser && response.updatedPoints !== undefined) {
        currentUser.points = response.updatedPoints;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      }
      navigate("/CustomerHome");
    } catch (error) {

      console.error("Error creating order:", error);
      const message = error.response?.data?.message;

      if (Array.isArray(message)) {
        setErrorList(message);
        setError("");
      } else {
        setError(message || error.message || "Login failed.");
        setErrorList([]);
      }
    }
  };

  return (
    <Box sx={{ width: 300, margin: "0 auto", paddingTop: 4 }}>
      <Typography variant="h6" gutterBottom>
        Checkout
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {errorList.length > 0 && (
        <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {errorList.map((err, idx) => (
              <li key={idx}>{err.msg || err}</li>
            ))}
          </ul>
        </Alert>
      )}
      <TextField
        label="Credit Card Number"
        variant="outlined"
        fullWidth
        margin="normal"
        value={creditCardNumber}
        onChange={(e) => setCreditCardNumber(e.target.value)}
        error={!!error}
        helperText={error}
      />
      <TextField
        label="Expiration Date (MM/YY)"
        variant="outlined"
        fullWidth
        margin="normal"
        value={expirationDate}
        onChange={(e) => setExpirationDate(e.target.value)}
      />
      <TextField
        label="CVV"
        variant="outlined"
        fullWidth
        margin="normal"
        value={cvv}
        onChange={(e) => setCvv(e.target.value)}
      />

      <Typography sx={{ marginTop: 2 }}>
        You have {userPoints} points available.
      </Typography>
      <Button
        onClick={() => setUsePoints(!usePoints)}
        variant="outlined"
        sx={{ marginTop: 1 }}
      >
        {usePoints ? "Don't Use Points" : "Use Points"}
      </Button>

      <Button
        onClick={handleCheckout}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        Confirm Payment
      </Button>
    </Box>
  );
}
