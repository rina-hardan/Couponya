import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "../src/components/Register";
import CustomerHome from "../src/components/CustomerHome";
import BusinessOwnerHome from "../src/components/BusinessOwnerHome";
import Login from "../src/components/Login";
import ProfileDetails from "../src/components/ProfileDetails";
import CouponsDisplay from "./components/CouponsDisplay";
import Coupon from "./components/Coupon";
import CategoriesList from "./components/CategoriesList";
import OrderHistory from "../src/components/OrderHistory";
import Checkout from "../src/components/Checkout";
import AdminHome from "./components/AdminHome";
import BusinessCouponsManager from "./components/BusinessCouponsManager";
import ManageCategories from "./components/ManageCategories";
import UnconfirmedCoupons from "./components/UnconfirmedCoupons";
import CouponForm from "./components/CouponForm";
import { useState } from "react";
import { Navigate } from "react-router-dom";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/CustomerHome" element={<CustomerHome />}>
          <Route index element={<CategoriesList />} />
          <Route path="coupons" element={<CouponsDisplay />} />
          <Route path="coupon/:id" element={<Coupon />} />
        </Route>
        <Route path="/AdminHome" element={<AdminHome />}>
          <Route path="unconfirmed-coupons" element={<UnconfirmedCoupons />} />
          <Route path="manage-categories" element={<ManageCategories />} />
        </Route>
        <Route path="/BusinessOwnerHome" element={<BusinessOwnerHome />} >
         <Route index element={<BusinessCouponsManager />} />
          <Route path="coupon-form" element={<CouponForm />} />
        </Route>
        <Route path="/coupons" element={<CouponsDisplay />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/profile" element={<ProfileDetails />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;