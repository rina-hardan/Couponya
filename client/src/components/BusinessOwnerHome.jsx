// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Menu,
//   MenuItem,
//   Divider,
//   Select,
//   InputLabel,
//   FormControl,
//   Button
// } from "@mui/material";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import LogoutIcon from "@mui/icons-material/Logout";
// import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
// import AddIcon from "@mui/icons-material/Add";
// import logo from "../pic/logo.png";
// import "../css/BusinessOwnerHome.css";
// import BusinessCouponCard from "../components/BusinessCouponCard";
// import { useNavigate, useLocation, Outlet } from "react-router-dom";
// import { fetchFromServer } from "../api/ServerAPI";

// export default function BusinessOwnerHome() {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [coupons, setCoupons] = useState([]);
//   const [status, setStatus] = useState("");
//   const [isActive, setIsActive] = useState("");
//   const [sortBy, setSortBy] = useState("expiry_date");
//   const [sortOrder, setSortOrder] = useState("ASC");
//   const [offset, setOffset] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);

//   const currentUser = JSON.parse(localStorage.getItem("user"));
//   const navigate = useNavigate();
//   const location = useLocation();
//   const open = Boolean(anchorEl);

//   const handleClick = (e) => setAnchorEl(e.currentTarget);
//   const handleClose = () => setAnchorEl(null);

//   const handleLogout = () => {
//     handleClose();
//     localStorage.clear();
//     navigate("/login");
//   };

//   const fetchCoupons = async (isNew = false) => {
//     if (loading || (!isNew && !hasMore)) return;

//     try {
//       setLoading(true);
//       const query = new URLSearchParams();
//       if (status) query.append("status", status);
//       if (isActive !== "") query.append("isActive", isActive);
//       query.append("sortBy", sortBy);
//       query.append("sortOrder", sortOrder);
//       query.append("limit", 10);
//       query.append("offset", isNew ? 0 : offset);

//       const data = await fetchFromServer(`/coupons/BusinessOwnerCoupons?${query}`);
//       if (isNew) {
//         setCoupons(data);
//         setOffset(10);
//         setHasMore(data.length === 10);
//       } else {
//         setCoupons((prev) => [...prev, ...data]);
//         setOffset((prev) => prev + 10);
//         if (data.length < 10) setHasMore(false);
//       }
//     } catch (err) {
//       console.error("Error loading coupons", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (location.pathname.includes("coupon-form")) return;
//     setOffset(0);
//     setHasMore(true);
//     fetchCoupons(true);
//   }, [status, isActive, sortBy, sortOrder, location.pathname]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 100 &&
//         hasMore && !loading
//       ) {
//         fetchCoupons();
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [hasMore, loading]);

//   const handleEdit = (coupon) => {
//     const { purchasedCount, ...cleanCoupon } = coupon;
//     navigate("/BusinessOwnerHome/coupon-form", { state: cleanCoupon });
//   };

//   return (
//     <div className="home-page">
//       <div className="home-wrapper">
//         <header className="home-header">
//           <img src={logo} alt="Couponya Logo" className="home-logo" />
//           <Box className="profile-section">
//             <IconButton onClick={handleClick}>
//               <BusinessCenterIcon sx={{ mr: 1 }} />
//               <Typography>Hello {currentUser?.userName}</Typography>
//             </IconButton>
//             <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
//               <MenuItem onClick={() => navigate("/profile")}>
//                 <AccountCircleIcon sx={{ mr: 1 }} />
//                 Personal Details
//               </MenuItem>
//               <Divider />
//               <MenuItem onClick={handleLogout}>
//                 <LogoutIcon sx={{ mr: 1 }} />
//                 Logout
//               </MenuItem>
//             </Menu>
//           </Box>
//         </header>

//         <main className="main-content">
//           <Typography variant="h4" gutterBottom>
//             Welcome to your dashboard, {currentUser?.name}
//           </Typography>

//           <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mb={3}>
//             <FormControl>
//               <InputLabel>Status</InputLabel>
//               <Select value={status} onChange={(e) => setStatus(e.target.value)} native>
//                 <option value="">All</option>
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Confirmed</option>
//               </Select>
//             </FormControl>

//             <FormControl>
//               <InputLabel>Active</InputLabel>
//               <Select value={isActive} onChange={(e) => setIsActive(e.target.value)} native>
//                 <option value="">All</option>
//                 <option value="true">Active</option>
//                 <option value="false">Inactive</option>
//               </Select>
//             </FormControl>

//             <FormControl>
//               <InputLabel>Sort By</InputLabel>
//               <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} native>
//                 <option value="expiry_date">Expiry Date</option>
//                 <option value="discounted_price">Price</option>
//                 <option value="title">Title</option>
//                 <option value="quantity">Quantity</option>
//               </Select>
//             </FormControl>

//             <FormControl>
//               <InputLabel>Order</InputLabel>
//               <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} native>
//                 <option value="ASC">Ascending</option>
//                 <option value="DESC">Descending</option>
//               </Select>
//             </FormControl>

//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={() => navigate("/BusinessOwnerHome/coupon-form", { state: null })}
//             >
//               Add Coupon
//             </Button>
//           </Box>

//           {coupons.map((coupon) => (
//             <BusinessCouponCard
//               key={coupon.id}
//               coupon={coupon}
//               onEdit={handleEdit}
//             />
//           ))}
//           {loading && <Typography>Loading more coupons...</Typography>}
//           {!hasMore && <Typography>No more coupons to load.</Typography>}

//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }
// pages/BusinessOwnerHome.jsx
import React, { useState } from "react";
import {
  Box, Typography, IconButton, Menu, MenuItem, Divider
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import logo from "../pic/logo.png";
import "../css/BusinessOwnerHome.css";
import { useNavigate, Outlet } from "react-router-dom";

export default function BusinessOwnerHome() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
