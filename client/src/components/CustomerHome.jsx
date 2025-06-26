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
  ListItem,
  ListItemText,
  Button,
  TextField,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import logo from "../pic/logo.png";
import "../css/CustomerHome.css";
import { fetchFromServer } from "../api/ServerAPI";
import CartItem from "../components/CartItem"; // רכיב המייצג פריט בסל הקניות

export default function CustomerHome() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartItems, setCartItems] = useState([]); // מצב לשמירת המוצרים בסל הקניות
  const [cartPopoverOpen, setCartPopoverOpen] = useState(false); // מצב לפתיחה וסגירה של חלונית סל הקניות
  const navigate = useNavigate();
  const [usePoints, setUsePoints] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const open = Boolean(anchorEl);

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

  const loadCartItems = async () => {
    try {
      const data = await fetchFromServer("cart/");
      setCartItems(data.cartItems);
    } catch (error) {
      console.error("Failed to load cart items", error);
    }
  };

  const handleCartClick = (event) => {
    loadCartItems();
    setCartPopoverOpen(true);
  };

  const handleCartPopoverClose = () => {
    setCartPopoverOpen(false);
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await fetchFromServer(`cart/remove`, "DELETE", { couponId: itemId });
      setCartItems(prevItems => prevItems.filter(item => item.coupon_id !== itemId));
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      await fetchFromServer(`cart/updateQuantity`, "PUT", { couponId: itemId, quantity: parseInt(newQuantity) });
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.coupon_id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const handleLogout = () => {
     handleClose();
     localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="home-page">
      <div className="home-wrapper">
        <header className="home-header">
          <img src={logo} alt="Couponya Logo" className="home-logo" />

          <Box className="profile-section">
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
              <Typography>Hello {currentUser.userName}</Typography>
            </IconButton>

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
          </Box>
        </header>

        <main className="main-content">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleCartClick}>
              <Badge badgeContent={cartItems.length} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>

          {/* Popover לסל הקניות */}
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
            {cartItems.length > 0 ? (
              <List>
                {cartItems.map((item, index) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={() => { handleRemoveItem(item.id) }}
                    onUpdate={handleUpdateQuantity}
                  />

                ))}
              </List>

            ) : (
              <Typography sx={{ p: 2 }}>No items in your cart</Typography>
            )}
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              You have {currentUser.points} points available.
            </Typography>
            <Button
              onClick={() => setUsePoints(prev => !prev)}
              variant="outlined"
              sx={{ marginTop: 1 }}
            >
              {usePoints ? "Don't Use Points" : "Use Points"}
            </Button>

            <Button
              onClick={() => navigate("/checkout", {
                state: {
                  cartItems: cartItems,  // פרטי המוצרים בסל
                  userPoints: currentUser.points,  // נקודות הלקוח
                  customerBirthDate: currentUser.birth_date  // תאריך לידה
                }
              })}
              variant="contained"
              sx={{ margin: 2 }}
            >
              Checkout
            </Button>
          </Popover>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
