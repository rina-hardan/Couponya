import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../css/Register.css';
import { fetchFromServer } from "../api/ServerAPI.js";
import logo from '../pic/logo.png'; // Adjust the path as necessary

export default function Register() {
  const [isCustomer, setIsCustomer] = useState(null);
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setIsCustomer(selectedRole === "customer");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target.form;
    const formData = new FormData(form);

    const userData = {
      userName: formData.get("username"),
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    };

    if (isCustomer) {
      userData.birth_date = formData.get("birth_date");
      userData.address = formData.get("address");
    } else {
      userData.business_name = formData.get("business_name");
      userData.description = formData.get("description");
      userData.website_url = formData.get("website_url");
      userData.logo_url = formData.get("logo_url");
    }

    try {
      const result = await fetchFromServer("users/register", "POST", userData);
      if (result.token) {
        localStorage.setItem("token", result.token);
        alert("Registration successful!");
        navigate("/home");
      }
    } catch (error) {
      alert(error.message || "Something went wrong during registration.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <img src={logo} alt="Couponya Logo" className="logo" />
        <h2>Welcome to Couponya</h2>
        <p className="subtitle">Create your account</p>
        <form className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required />
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>

          <div className="form-group">
            <label htmlFor="role">Select Role</label>
            <select id="role" name="role" required onChange={handleRoleChange}>
              <option value="">-- Choose Role --</option>
              <option value="customer">Customer</option>
              <option value="business_owner">Business Owner</option>
            </select>
          </div>

          {isCustomer && (
            <>
              <div className="form-group">
                <label htmlFor="birth_date">Birth Date</label>
                <input type="date" id="birth_date" name="birth_date" required />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input type="text" id="address" name="address" required />
              </div>
            </>
          )}

          {isCustomer === false && (
            <>
              <div className="form-group">
                <label htmlFor="business_name">Business Name</label>
                <input type="text" id="business_name" name="business_name" required />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" rows="3" />
              </div>
              <div className="form-group">
                <label htmlFor="website_url">Website URL</label>
                <input type="url" id="website_url" name="website_url" />
              </div>
              <div className="form-group">
                <label htmlFor="logo_url">Logo URL</label>
                <input type="url" id="logo_url" name="logo_url" />
              </div>
            </>
          )}

          <button type="submit" className="submit-btn" onClick={handleRegister}>Register</button>
          <p className="login-link">
            Already have an account? <span onClick={() => navigate("/login")}>Login here</span>
          </p>
        </form>
      </div>
    </div>
  );
}
