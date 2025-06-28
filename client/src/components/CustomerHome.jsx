import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Badge,
  Popover,
  List,
  Button,
  Alert
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import logo from "../pic/logo.png";
import couponBirthday from "../pic/couponBirthday.png";
import "../css/CustomerHome.css";
import { fetchFromServer } from "../api/ServerAPI";
import CartItem from "../components/CartItem";

export default function CustomerHome() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartPopoverOpen, setCartPopoverOpen] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorList, setErrorList] = useState([]); // רשימת שגיאות אם יש מערך

  const [showBirthdayPopup, setShowBirthdayPopup] = useState(false);
  const [hasBirthdayDiscount, setHasBirthdayDiscount] = useState(false);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const open = Boolean(anchorEl);

  useEffect(() => {
    const birthDate = new Date(currentUser.birth_date);
    const currentMonth = new Date().getMonth();
    const birthMonth = birthDate.getMonth();
    const alreadyShown = localStorage.getItem("birthdayPopupShown");

    if (birthMonth === currentMonth) {
      setHasBirthdayDiscount(true);
      if (!alreadyShown) {
        setShowBirthdayPopup(true);
        localStorage.setItem("birthdayPopupShown", "true");
      }
    }
  }, []);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const goToProfile = () => {
    handleClose();
    navigate("/profile");
  };
  const goToHistory = () => {
    handleClose();
    navigate("/order-history");
  };
  const handleLogout = () => {
    handleClose();
    localStorage.clear();
    navigate("/login", { replace: true });
  };
  const handleCartClick = () => {
    loadCartItems();
    setCartPopoverOpen(true);
  };
  const handleCartPopoverClose = () => {
    setCartPopoverOpen(false);
  };
  const loadCartItems = async () => {
    try {
      const data = await fetchFromServer("cart/");
      setCartItems(data.cartItems);
    } catch (error) {
      console.error("Failed to load cart items", error);
    }
  };
  const handleRemoveItem = async (itemId) => {
    try {
      await fetchFromServer(`cart/remove`, "DELETE", { couponId: itemId });
      setCartItems(prevItems => prevItems.filter(item => item.coupon_id !== itemId));
    } catch (error) {
      console.error("Failed to remove item", error);
      const message = error.response?.data?.message;

      if (Array.isArray(message)) {
        setErrorList(message);
        setErrorMessage("");
      } else {
        setErrorMessage(message || error.message || "Login failed.");
        setErrorList([]);
      }
    }
  };
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      await fetchFromServer(`cart/updateQuantity`, "PUT", {
        couponId: itemId,
        quantity: parseInt(newQuantity)
      });
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.coupon_id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };
  const goToSpecialCoupons = () => {
    navigate("/CustomerHome/coupons", {
      state: { specialOnly: true }
    });
  };

  return (
    <div className="home-page">
      <div className="home-wrapper">
        <header className="home-header">
          <img src={logo} alt="Couponya Logo" className="home-logo" />

          {hasBirthdayDiscount && (
            <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
              🎉 You have an extra 10% discount on every purchase this month for your birthday!
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, alignItems: "center" }}>
            <Button
              onClick={goToSpecialCoupons}
              variant="contained"
              color="secondary"
              sx={{ borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Special For You
            </Button>

            <IconButton onClick={handleCartClick}>
              <Badge badgeContent={cartItems.length} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <IconButton
              onClick={handleClick}
              sx={{
                backgroundColor: "#fffef5",
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "8px 16px",
                color: "#333",
                '&:hover': {
                  backgroundColor: "#fcf8e3"
                }
              }}
            >
              <AccountCircleIcon sx={{ mr: 1 }} />
              <Typography>{currentUser.userName}</Typography>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: 3,
                padding: 1,
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
              }
            }}
          >
            <MenuItem onClick={goToProfile}>
              <AccountCircleIcon sx={{ mr: 1 }} />
              <Typography>Personal Details</Typography>
            </MenuItem>
            <MenuItem onClick={goToHistory}>
              <ListAltIcon sx={{ mr: 1 }} />
              <Typography>Order History</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              <Typography>Logout</Typography>
            </MenuItem>
          </Menu>

          <Popover
            open={cartPopoverOpen}
            anchorEl={anchorEl}
            onClose={handleCartPopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Typography sx={{ p: 2 }}>Your Cart</Typography>
            {errorList.length > 0 && (
              <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  {errorList.map((err, idx) => (
                    <li key={idx}>{err.msg || err}</li>
                  ))}
                </ul>
              </Alert>
            )}
            {cartItems.length > 0 ? (
              <List>
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={() => handleRemoveItem(item.coupon_id)}
                    onUpdate={handleUpdateQuantity}
                  />
                ))}
              </List>
            ) : (
              <Typography sx={{ p: 2 }}>No items in your cart</Typography>
            )}
            <Typography variant="body2" sx={{ marginTop: 2, px: 2 }}>
              You have {currentUser.points} points available.
            </Typography>
            <Button
              onClick={() => setUsePoints(prev => !prev)}
              variant="outlined"
              sx={{ margin: 1 }}
            >
              {usePoints ? "Don't Use Points" : "Use Points"}
            </Button>
            <Button
              onClick={() => navigate("/checkout", {
                state: {
                  cartItems: cartItems,
                  userPoints: currentUser.points,
                  customerBirthDate: currentUser.birth_date
                }
              })}
              variant="contained"
              sx={{ margin: 2 }}
            >
              Checkout
            </Button>
          </Popover>

          <Popover
            open={showBirthdayPopup}
            onClose={() => setShowBirthdayPopup(false)}
            anchorReference="anchorPosition"
            anchorPosition={{ top: 80, left: window.innerWidth - 500 }}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ zIndex: 1300 }}
          >
            <Box sx={{
              p: 2,
              textAlign: 'center',
              width: '220px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <img
                src={couponBirthday}
                alt="Birthday Discount"
                style={{ width: '100%', height: '120px', objectFit: 'contain', borderRadius: 8 }}
              />
              <Button
                onClick={() => setShowBirthdayPopup(false)}
                sx={{ mt: 2 }}
                variant="contained"
                fullWidth
              >
                Yay, Thanks!
              </Button>
            </Box>
          </Popover>
        </header>

        <main className="main-content">
          {errorMessage && (
            <Box sx={{ mx: 3, mt: 2 }}>
              <Alert severity="error" onClose={() => setErrorMessage("")}>
                {errorMessage}
              </Alert>
            </Box>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
