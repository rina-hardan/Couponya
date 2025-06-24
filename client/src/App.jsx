import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "../src/components/Register"; 
import CustomerHome from "../src/components/CustomerHome";
import BusinessOwnerHome from "../src/components/BusinessOwnerHome";
import Login from "../src/components/Login"; 
import ProfileDetails from "../src/components/ProfileDetails";
import OrderHistory from "../src/components/OrderHistory";
import { useState } from "react";
import { Navigate } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
         <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
        <Route path="/CustomerHome" element={<CustomerHome />} />
           <Route path="/BusinessOwnerHome" element={<BusinessOwnerHome />} />
        <Route path="/order-history" element={<OrderHistory />} />
       <Route path="/profile" element={<ProfileDetails />} />

      </Routes>
    </Router>
  );
}

export default App;