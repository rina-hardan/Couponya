import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "../src/components/Register"; 
import Home from "../src/components/Home";
import Login from "../src/components/Login"; 
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
        <Route path="/home" element={<Home />} />
        <Route path="/order-history" element={<OrderHistory />} />
      </Routes>
    </Router>
  );
}

export default App;